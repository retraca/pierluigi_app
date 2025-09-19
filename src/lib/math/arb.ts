import { decimalToProbability } from "./odds";
import { bpsToRatio, FeeSpec } from "./edge";

export interface Leg {
	id: string;
	venue: string;
	outcome: string;
	decimalOdds: number;
	maxStake?: number; // cap per leg
	feeBps?: number; // applied to winnings
	slippageBps?: number; // odds worsen by this bps at submitted stake (linear model)
}

export interface ArbDetectionResult {
	isArbitrage: boolean;
	margin: number; // 1 - sum(1/adjOdds)
	participating: Leg[];
	sumInverse: number;
}

export function adjustOdds(
	decimalOdds: number,
	stake: number,
	feeBps = 0,
	slippageBps = 0,
): number {
	const fee = bpsToRatio(feeBps);
	const slip = bpsToRatio(slippageBps);
	const worsened = decimalOdds * (1 - slip * Math.max(0, stake));
	const b = worsened - 1;
	const afterFee = 1 + b * (1 - fee);
	return Math.max(1 + 1e-9, afterFee);
}

export function detectNWayArb(legs: Leg[]): ArbDetectionResult {
	const sumInv = legs.reduce((acc, leg) => acc + 1 / leg.decimalOdds, 0);
	const margin = 1 - sumInv;
	return {
		isArbitrage: margin > 0,
		margin,
		participating: legs,
		sumInverse: sumInv,
	};
}

export function detectWithFeesAndSlippage(
	legs: Leg[],
	assumedStakePerLeg = 1,
): ArbDetectionResult {
	const adj = legs.map((l) => ({
		...l,
		decimalOdds: adjustOdds(l.decimalOdds, assumedStakePerLeg, l.feeBps ?? 0, l.slippageBps ?? 0),
	}));
	return detectNWayArb(adj);
}

export function binaryArb(legA: Leg, legB: Leg): ArbDetectionResult {
	return detectNWayArb([legA, legB]);
}

export function impliedOverround(legs: Leg[]): number {
	const sum = legs.reduce((a, l) => a + decimalToProbability(l.decimalOdds), 0);
	return sum;
} 