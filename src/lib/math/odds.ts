/*
Odds conversions and implied probability utilities.
All functions throw on invalid inputs. Probabilities are clamped to (EPS, 1-EPS).
*/

export type OddsFormat =
	| "decimal"
	| "american"
	| "fractional"
	| "hongKong"
	| "indonesian"
	| "malay";

const EPS = 1e-9;

export function clampProbability(p: number): number {
	if (!Number.isFinite(p)) throw new Error("Probability must be finite");
	return Math.min(1 - EPS, Math.max(EPS, p));
}

export function assertPositive(n: number, name = "value"): void {
	if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} must be > 0`);
}

// Probability ↔ Decimal
export function probabilityToDecimal(p: number): number {
	const pc = clampProbability(p);
	return 1 / pc;
}

export function decimalToProbability(decimal: number): number {
	assertPositive(decimal, "decimal");
	return clampProbability(1 / decimal);
}

// American odds: positive +A means risk 100 to win A; negative -B means risk B to win 100
export function decimalToAmerican(decimal: number): number {
	assertPositive(decimal, "decimal");
	const b = decimal - 1;
	if (b === 0) return 0;
	if (decimal >= 2) {
		// positive american (can be non-integer for precise invertibility)
		return b * 100;
	}
	// negative american
	return -100 / b;
}

export function americanToDecimal(american: number): number {
	if (!Number.isFinite(american)) throw new Error("american must be finite");
	if (american === 0) return 1; // even odds
	if (american > 0) {
		return 1 + american / 100;
	}
	return 1 + 100 / Math.abs(american);
}

// Fractional odds: a/b meaning win a for stake b
export function decimalToFractional(decimal: number): [number, number] {
	assertPositive(decimal, "decimal");
	const frac = decimal - 1;
	const PREC = 1e-6;
	// Convert to simple fraction using continued fraction with a cap
	let x = frac;
	let a0 = Math.floor(x);
	let h1 = 1,
		k1 = 0,
		h0 = a0,
		k0 = 1;
	let iter = 0;
	while (Math.abs(h0 / k0 - frac) > PREC && iter < 20) {
		x = 1 / (x - Math.floor(x));
		const a = Math.floor(x);
		const h2 = a * h0 + h1;
		const k2 = a * k0 + k1;
		h1 = h0;
		k1 = k0;
		h0 = h2;
		k0 = k2;
		iter++;
	}
	return [h0, k0];
}

export function fractionalToDecimal(numerator: number, denominator: number): number {
	assertPositive(numerator, "numerator");
	assertPositive(denominator, "denominator");
	return 1 + numerator / denominator;
}

// Hong Kong odds: hk = decimal - 1 (non-negative)
export function decimalToHongKong(decimal: number): number {
	assertPositive(decimal, "decimal");
	return decimal - 1;
}

export function hongKongToDecimal(hk: number): number {
	if (!Number.isFinite(hk) || hk < 0) throw new Error("hongKong must be >= 0");
	return 1 + hk;
}

// Indonesian odds: like American but base 1 instead of 100; positive >= 1, negative in (-1, 0)
export function decimalToIndonesian(decimal: number): number {
	assertPositive(decimal, "decimal");
	const b = decimal - 1;
	if (decimal >= 2) return b; // >=1
	return -1 / b; // in (-1, 0)
}

export function indonesianToDecimal(indo: number): number {
	if (!Number.isFinite(indo)) throw new Error("indo must be finite");
	if (indo >= 0) return 1 + indo;
	return 1 + 1 / Math.abs(indo);
}

// Malay odds: values in (-1, 0) U (0, 1]; mapping:
// if decimal >= 2 (hk>=1): malay = 1/(decimal-1) in (0,1]
// if decimal < 2 (hk<1):  malay = -(decimal-1) in (-1,0)
export function decimalToMalay(decimal: number): number {
	assertPositive(decimal, "decimal");
	const hk = decimal - 1;
	if (decimal >= 2) return 1 / hk;
	return -hk;
}

export function malayToDecimal(malay: number): number {
	if (!Number.isFinite(malay)) throw new Error("malay must be finite");
	if (malay === 0) throw new Error("malay cannot be 0");
	if (malay > 0) return 1 + 1 / malay;
	if (malay >= -1) return 1 - malay;
	throw new Error("malay must be >= -1");
}

export function toDecimal(value: number, format: OddsFormat, fractionalDen?: number): number {
	switch (format) {
		case "decimal":
			return value;
		case "american":
			return americanToDecimal(value);
		case "fractional":
			if (!fractionalDen) throw new Error("fractional requires denominator");
			return fractionalToDecimal(value, fractionalDen);
		case "hongKong":
			return hongKongToDecimal(value);
		case "indonesian":
			return indonesianToDecimal(value);
		case "malay":
			return malayToDecimal(value);
		default:
			throw new Error("Unknown odds format");
	}
}

export function fromDecimal(decimal: number): {
	american: number;
	fractional: [number, number];
	hongKong: number;
	indonesian: number;
	malay: number;
	probability: number;
} {
	const american = decimalToAmerican(decimal);
	const fractional = decimalToFractional(decimal);
	const hongKong = decimalToHongKong(decimal);
	const indonesian = decimalToIndonesian(decimal);
	const malay = decimalToMalay(decimal);
	const probability = decimalToProbability(decimal);
	return { american, fractional, hongKong, indonesian, malay, probability };
} 