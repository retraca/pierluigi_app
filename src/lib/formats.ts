import { OddsFormat } from "@/lib/types";

export function clamp01(x: number): number {
	if (Number.isNaN(x) || !Number.isFinite(x)) return 0;
	return Math.max(0, Math.min(1, x));
}

export function toSignificant(x: number, sig = 5): number {
	if (!Number.isFinite(x)) return x;
	if (x === 0) return 0;
	const digits = sig - Math.floor(Math.log10(Math.abs(x))) - 1;
	return Number(x.toFixed(Math.max(0, Math.min(6, digits))));
}

export function decimalToProb(decimalOdds: number): number {
	if (decimalOdds <= 0) throw new Error("Decimal odds must be positive");
	return clamp01(1 / decimalOdds);
}

export function americanToProb(american: number): number {
	if (american === 0) throw new Error("American odds cannot be zero");
	return american > 0 ? 100 / (american + 100) : -american / (-american + 100);
}

export function fractionalToDecimal(fraction: string): number {
	const match = String(fraction).trim().match(/^\s*([0-9]+)\s*\/\s*([0-9]+)\s*$/);
	if (!match) throw new Error("Invalid fractional format. Use a/b");
	const a = Number(match[1]);
	const b = Number(match[2]);
	if (b === 0) throw new Error("Invalid fractional denominator 0");
	return 1 + a / b;
}

export function probToDecimal(p: number): number {
	const clamped = Math.max(1e-12, Math.min(1, p));
	return 1 / clamped;
}

export function probToAmerican(p: number): number {
	const clamped = clamp01(p);
	if (clamped <= 0 || clamped > 1) throw new Error("Probability out of range");
	const b = (1 - clamped) / clamped;
	return b >= 1 ? Math.round(b * 100) : Math.round(-100 / b);
}

export function decimalToAmerican(decimal: number): number {
	if (decimal <= 1) throw new Error("Decimal must be > 1");
	const b = decimal - 1;
	return b >= 1 ? Math.round(b * 100) : Math.round(-100 / b);
}

export function parseValueToDecimal(format: OddsFormat, value: number | string): number {
	switch (format) {
		case "Decimal": {
			const v = Number(value);
			if (!(v > 0)) throw new Error("Invalid decimal odds");
			return v;
		}
		case "Probability": {
			const v = Number(value);
			if (!(v > 0 && v <= 1)) throw new Error("Probability must be in (0,1]");
			return probToDecimal(v);
		}
		case "American": {
			const v = Number(value);
			if (!Number.isFinite(v) || v === 0) throw new Error("Invalid American odds");
			return 1 / americanToProb(v);
		}
		case "Fractional": {
			const v = String(value);
			return fractionalToDecimal(v);
		}
		case "PM YES": {
			const v = Number(value);
			if (!(v > 0 && v <= 1)) throw new Error("YES price must be (0,1]");
			return 1 / v;
		}
		case "PM NO": {
			const v = Number(value);
			if (!(v > 0 && v <= 1)) throw new Error("NO price must be (0,1]");
			return 1 / v;
		}
		default:
			throw new Error("Unsupported format");
	}
}

export function toAllFormats(decimalOdds: number) {
	const p = decimalToProb(decimalOdds);
	return {
		decimal: toSignificant(decimalOdds, 6),
		probability: toSignificant(p, 6),
		american: decimalToAmerican(decimalOdds),
		fractional: toSignificant(decimalOdds - 1, 6) + "/1", // display helper (approx)
	};
} 