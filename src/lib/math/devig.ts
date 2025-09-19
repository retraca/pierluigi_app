import { decimalToProbability, probabilityToDecimal, clampProbability } from "./odds";

export type DeVigMethod = "proportional" | "shin" | "power";

export interface DeVigOptions {
	method: DeVigMethod;
	powerExponent?: number; // for power method
	maxIterations?: number;
	tolerance?: number;
}

export interface OutcomeOdds {
	id: string;
	decimalOdds: number;
}

export interface DeVigResultRow {
	id: string;
	rawProbability: number;
	normalizedProbability: number;
	fairProbability: number;
	fairDecimalOdds: number;
}

export function normalizeProbabilities(ps: number[]): number[] {
	const sum = ps.reduce((a, b) => a + b, 0);
	if (!Number.isFinite(sum) || sum <= 0) throw new Error("Invalid probabilities to normalize");
	return ps.map((p) => clampProbability(p / sum));
}

export function impliedProbabilitiesFromDecimal(odds: OutcomeOdds[]): number[] {
	return odds.map((o) => decimalToProbability(o.decimalOdds));
}

export function proportionalDeVig(odds: OutcomeOdds[]): DeVigResultRow[] {
	const q = impliedProbabilitiesFromDecimal(odds);
	const pNorm = normalizeProbabilities(q);
	return odds.map((o, i) => {
		const fairP = pNorm[i];
		return {
			id: o.id,
			rawProbability: q[i],
			normalizedProbability: pNorm[i],
			fairProbability: fairP,
			fairDecimalOdds: probabilityToDecimal(fairP),
		};
	});
}

// Shin method: given observed implied probs q_i (sum>1), find z in [0, 0.5) such that
// p_i(z) = (sqrt(z^2 + 4(1 - z) q_i) - z) / (2(1 - z)), and sum_i p_i(z) = 1
function shinFairProbs(q: number[], tol = 1e-9, maxIter = 200): number[] {
	const sumQ = q.reduce((a, b) => a + b, 0);
	if (sumQ <= 1 + 1e-12) return normalizeProbabilities(q);
	let lo = 0;
	let hi = 0.5 - 1e-9; // z cannot reach 0.5 in practice
	let bestZ = 0;
	for (let iter = 0; iter < maxIter; iter++) {
		const mid = (lo + hi) / 2;
		const pSum = q
			.map((qi) => {
				const disc = Math.max(0, mid * mid + 4 * (1 - mid) * qi);
				const num = Math.sqrt(disc) - mid;
				const den = 2 * (1 - mid);
				return clampProbability(num / den);
			})
			.reduce((a, b) => a + b, 0);
		if (Math.abs(pSum - 1) < tol) {
			bestZ = mid;
			break;
		}
		if (pSum > 1) {
			// decrease z
			hi = mid;
		} else {
			lo = mid;
		}
		bestZ = mid;
	}
	return q.map((qi) => {
		const disc = Math.max(0, bestZ * bestZ + 4 * (1 - bestZ) * qi);
		const num = Math.sqrt(disc) - bestZ;
		const den = 2 * (1 - bestZ);
		return clampProbability(num / den);
	});
}

export function shinDeVig(odds: OutcomeOdds[], tolerance = 1e-9, maxIterations = 200): DeVigResultRow[] {
	const q = impliedProbabilitiesFromDecimal(odds);
	const fair = shinFairProbs(q, tolerance, maxIterations);
	const pNorm = normalizeProbabilities(q);
	return odds.map((o, i) => ({
		id: o.id,
		rawProbability: q[i],
		normalizedProbability: pNorm[i],
		fairProbability: fair[i],
		fairDecimalOdds: probabilityToDecimal(fair[i]),
	}));
}

export function powerDeVig(
	odds: OutcomeOdds[],
	exponent = 1,
): DeVigResultRow[] {
	const q = impliedProbabilitiesFromDecimal(odds);
	const pow = q.map((qi) => Math.pow(qi, exponent));
	const fair = normalizeProbabilities(pow);
	const pNorm = normalizeProbabilities(q);
	return odds.map((o, i) => ({
		id: o.id,
		rawProbability: q[i],
		normalizedProbability: pNorm[i],
		fairProbability: fair[i],
		fairDecimalOdds: probabilityToDecimal(fair[i]),
	}));
}

export function devig(
	odds: OutcomeOdds[],
	options: DeVigOptions,
): DeVigResultRow[] {
	switch (options.method) {
		case "proportional":
			return proportionalDeVig(odds);
		case "shin":
			return shinDeVig(odds, options.tolerance, options.maxIterations);
		case "power":
			return powerDeVig(odds, options.powerExponent ?? 1);
		default:
			return proportionalDeVig(odds);
	}
} 