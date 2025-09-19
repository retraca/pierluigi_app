import { Leg, adjustOdds, detectNWayArb } from "./arb";

export interface ProfitLockInput {
	legs: Leg[];
	assumedStakePerLeg?: number; // used for slippage adjustment preview
	minRoi?: number; // minimum ROI constraint as fraction (e.g., 0.01)
}

export interface StakesResult {
	stakes: Record<string, number>;
	totalStake: number;
	worstCaseProfit: number;
	bestCaseProfit: number;
	roi: number;
}

// Compute equal-payout stakes s_i = C / o_i (after adjustments). Choose largest C obeying caps.
export function profitLockOptimize(input: ProfitLockInput): StakesResult {
	const { legs } = input;
	// Adjust odds using 1 unit stake to model slippage conservatively
	const adjOdds = legs.map((l) => ({
		...l,
		adjDecimal: adjustOdds(l.decimalOdds, 1, l.feeBps ?? 0, l.slippageBps ?? 0),
	}));
	const sumInv = adjOdds.reduce((a, l) => a + 1 / l.adjDecimal, 0);
	const margin = 1 - sumInv;
	if (margin <= 0) {
		return { stakes: {}, totalStake: 0, worstCaseProfit: 0, bestCaseProfit: 0, roi: -sumInv + 1 };
	}
	// Max C such that s_i = C / o_i <= cap_i
	let maxC = Infinity;
	for (const leg of adjOdds) {
		if (leg.maxStake && leg.maxStake > 0) {
			maxC = Math.min(maxC, leg.maxStake * leg.adjDecimal);
		}
	}
	if (!Number.isFinite(maxC)) maxC = 1; // default unit scale
	const stakes: Record<string, number> = {};
	for (const leg of adjOdds) {
		const s = maxC / leg.adjDecimal;
		stakes[leg.id] = s;
	}
	const totalStake = Object.values(stakes).reduce((a, b) => a + b, 0);
	const payout = maxC; // equal across outcomes
	const profit = payout - totalStake;
	const worstCaseProfit = profit;
	const bestCaseProfit = profit; // equalized
	const roi = profit / totalStake;
	return { stakes, totalStake, worstCaseProfit, bestCaseProfit, roi };
}

export function minReturnMaximize(input: ProfitLockInput): StakesResult {
	// For positive arb, maximizing min return subject to caps equals maximizing C
	return profitLockOptimize(input);
}

export interface KellyInput {
	fairProbability: number;
	decimalOdds: number;
	bankroll: number;
	fraction?: number; // fractional Kelly (e.g., 0.5)
}

export function kellySingle({ fairProbability: p, decimalOdds: o, bankroll, fraction = 1 }: KellyInput) {
	const b = o - 1;
	const fStar = (b * p - (1 - p)) / b;
	const f = Math.max(0, Math.min(1, fStar * fraction));
	return { fraction: f, stake: bankroll * f };
}

export interface KellyMultiLegInput {
	legs: { id: string; fairProbability: number; decimalOdds: number }[];
	bankroll: number;
	fraction?: number;
}

export function kellyMulti({ legs, bankroll, fraction = 1 }: KellyMultiLegInput) {
	const rec: Record<string, { fraction: number; stake: number }> = {};
	for (const leg of legs) {
		const { fraction: f, stake } = kellySingle({
			fairProbability: leg.fairProbability,
			decimalOdds: leg.decimalOdds,
			bankroll,
			fraction,
		});
		rec[leg.id] = { fraction: f, stake };
	}
	return rec;
} 