import { clampProbability } from "./odds";

export interface PmFees {
	makerFeeBps?: number;
	takerFeeBps?: number;
	settlementFeeBps?: number;
	withdrawalFeeBps?: number;
}

export interface SlippageModel {
	// Linear worsening: effective probability increases by slopeBps * (stake / liquidity)
	slopeBps?: number;
	liquidity?: number; // notional depth; if undefined, no slippage
}

export function applyPmFees(probability: number, fees: PmFees, taker = true): number {
	const stackBps = (fees.settlementFeeBps ?? 0) + (fees.withdrawalFeeBps ?? 0) + (taker ? fees.takerFeeBps ?? 0 : fees.makerFeeBps ?? 0);
	const ratio = stackBps / 10_000;
	return clampProbability(probability * (1 + ratio));
}

export function applySlippage(probability: number, stake: number, model?: SlippageModel): number {
	if (!model || !model.liquidity || !model.slopeBps) return probability;
	const impact = (model.slopeBps / 10_000) * (stake / model.liquidity);
	return clampProbability(probability * (1 + impact));
}

export function effectiveFillProbability(
	inputProbability: number,
	stake: number,
	fees: PmFees,
	slippage?: SlippageModel,
	taker = true,
): number {
	const afterFees = applyPmFees(inputProbability, fees, taker);
	return applySlippage(afterFees, stake, slippage);
} 