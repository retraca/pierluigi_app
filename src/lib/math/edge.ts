export interface FeeSpec {
	// Percentage fees applied to winnings or stake in basis points (bps)
	winningsFeeBps?: number; // applied to net winnings (odds-1)*stake
	stakeFeeBps?: number; // applied to stake
}

export function bpsToRatio(bps = 0): number {
	return bps / 10_000;
}

export function effectiveNetPayoutPer1(decimalOdds: number, fees?: FeeSpec): number {
	const b = decimalOdds - 1;
	const winFee = bpsToRatio(fees?.winningsFeeBps);
	const stakeFee = bpsToRatio(fees?.stakeFeeBps);
	// Expected profit calculation assumes fees reduce returns and increase costs
	const netWin = b * (1 - winFee);
	const netStakeCost = 1 * (1 + stakeFee) - 1; // extra cost over 1 stake
	return netWin - netStakeCost;
}

// Edge per $1 staked in decimal-odds world: fair_prob * netPayout - (1 - fair_prob)
export function computeEdgePerDollar(
	fairProbability: number,
	decimalOdds: number,
	fees?: FeeSpec,
): number {
	const netPayout = effectiveNetPayoutPer1(decimalOdds, fees);
	return fairProbability * netPayout - (1 - fairProbability);
}

export function expectedProfit(
	stake: number,
	fairProbability: number,
	decimalOdds: number,
	fees?: FeeSpec,
): number {
	const edgePer = computeEdgePerDollar(fairProbability, decimalOdds, fees);
	return stake * edgePer;
}

export function roi(
	fairProbability: number,
	decimalOdds: number,
	fees?: FeeSpec,
): number {
	const edgePer = computeEdgePerDollar(fairProbability, decimalOdds, fees);
	return edgePer; // per-dollar return
} 