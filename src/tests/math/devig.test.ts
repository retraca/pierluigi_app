import { describe, it, expect } from "vitest";
import { proportionalDeVig, shinDeVig, powerDeVig } from "../../lib/math/devig";

const odds = [
	{ id: "A", decimalOdds: 2.0 },
	{ id: "B", decimalOdds: 2.0 },
];

describe("de-vig methods", () => {
	it("proportional normalizes to sum 1", () => {
		const rows = proportionalDeVig(odds);
		const sum = rows.reduce((a, r) => a + r.fairProbability, 0);
		expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
	});

	it("shin reduces overround", () => {
		const rows = shinDeVig(odds);
		const sum = rows.reduce((a, r) => a + r.fairProbability, 0);
		expect(Math.abs(sum - 1)).toBeLessThan(1e-6);
	});

	it("power with exponent != 1 still sums to 1", () => {
		const rows = powerDeVig(odds, 0.8);
		const sum = rows.reduce((a, r) => a + r.fairProbability, 0);
		expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
	});
}); 