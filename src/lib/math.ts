import { OutcomeInput, OutcomeComputed, CalcResult, ResultType } from "@/lib/types";
import { clamp01, decimalToProb, parseValueToDecimal, toSignificant } from "@/lib/formats";

export function computeOverround(probs: number[]): number {
	return probs.reduce((sum, p) => sum + clamp01(p), 0);
}

export function removeVig(probs: number[]): { fairProbs: number[]; overround: number } {
	const bounded = probs.map((p) => clamp01(p));
	const R = computeOverround(bounded);
	if (R <= 0) return { fairProbs: bounded, overround: 0 };
	const fairProbs = bounded.map((p) => (p / R) || 0);
	return { fairProbs, overround: R };
}

export function mapToEffectiveDecimal(format: string, value: number | string, feePct: number, slippagePct: number): number {
	const decimal = parseValueToDecimal(format as any, value);
	const afterFee = decimal * (1 - clamp01(feePct));
	const afterSlip = afterFee * (1 - clamp01(slippagePct));
	return afterSlip;
}

export function detectArbitrage(outcomes: { effectiveDecimal: number; label?: string }[]): {
	hasArb: boolean;
	sumInverse: number;
	weights: number[];
} {
	const inverses = outcomes.map((o) => (o.effectiveDecimal > 0 ? 1 / o.effectiveDecimal : Infinity));
	const sumInverse = inverses.reduce((s, x) => s + x, 0);
	const hasArb = sumInverse < 1 - 1e-12;
	const weights = inverses.map((x) => (sumInverse > 0 ? x / sumInverse : 0));
	return { hasArb, sumInverse, weights };
}

export function computeStakeSplit(totalStake: number, outcomes: { effectiveDecimal: number }[]): {
	stakes: number[];
	guaranteedProfit: number;
} {
	const inverses = outcomes.map((o) => 1 / o.effectiveDecimal);
	const denom = inverses.reduce((s, x) => s + x, 0);
	const stakes = inverses.map((x) => (denom > 0 ? (totalStake * x) / denom : 0));
	const profits = outcomes.map((o, i) => stakes[i] * o.effectiveDecimal - totalStake);
	const guaranteedProfit = Math.min(...profits);
	return { stakes, guaranteedProfit: toSignificant(guaranteedProfit, 6) };
}

export function computeKelly(decimalOdds: number, p: number): { f: number; half: number } {
	const b = Math.max(0, decimalOdds - 1);
	if (b === 0) return { f: 0, half: 0 };
	const clampedP = clamp01(p);
	const f = Math.max(0, Math.min(1, (b * clampedP - (1 - clampedP)) / b));
	return { f, half: f / 2 };
}

export function analyze(outcomes: OutcomeInput[], totalStake: number, options?: { suppressArb?: boolean; fairWithVig?: boolean }): CalcResult {
	const mapped = outcomes.map((o) => {
		const decimal = mapToEffectiveDecimal(o.inputType, o.value, o.feePct, o.slippagePct);
		const impliedProb = decimalToProb(parseValueToDecimal(o.inputType, o.value));
		return {
			label: o.label,
			venue: o.venue,
			inputType: o.inputType,
			valueRaw: o.value,
			impliedProb,
			effectiveDecimal: decimal,
		} as OutcomeComputed;
	});

	const impliedProbs = mapped.map((m) => m.impliedProb);
	const { fairProbs, overround } = removeVig(impliedProbs);
	mapped.forEach((m, i) => {
		m.fairProb = fairProbs[i];
		m.fairDecimalOdds = fairProbs[i] > 0 ? 1 / fairProbs[i] : undefined;
	});

	let resultType: ResultType = "No Edge";
	let guaranteedProfit: number | undefined = undefined;
	let stakeTotal = totalStake;

	if (!options?.suppressArb && mapped.length >= 2) {
		const { hasArb } = detectArbitrage(mapped.map((m) => ({ effectiveDecimal: m.effectiveDecimal })));
		if (hasArb && totalStake > 0) {
			const { stakes, guaranteedProfit: gp } = computeStakeSplit(totalStake, mapped.map((m) => ({ effectiveDecimal: m.effectiveDecimal })));
			mapped.forEach((m, i) => (m.stake = stakes[i]));
			guaranteedProfit = gp;
			resultType = "True Arbitrage";
		}
	}

	if (resultType !== "True Arbitrage") {
		// Value check: pick best positive edge row comparing fair vs book implied
		let bestEdge = -Infinity;
		let bestIndex = -1;
		for (let i = 0; i < mapped.length; i++) {
			const m = mapped[i];
			const pBook = m.impliedProb;
			const pFair = m.fairProb ?? pBook;
			const edge = pFair - pBook;
			if (edge > bestEdge) {
				bestEdge = edge;
				bestIndex = i;
			}
		}
		if (bestIndex >= 0 && bestEdge > 0) {
			const m = mapped[bestIndex];
			const { f, half } = computeKelly(parseValueToDecimal(m.inputType, m.valueRaw), m.fairProb ?? m.impliedProb);
			m.kelly = f;
			m.halfKelly = half;
			resultType = "Value Only";
		}
	}

	return {
		resultType,
		overround,
		rows: mapped,
		stakeTotal,
		guaranteedProfit,
	};
} 