import { describe, it, expect } from "vitest";
import { assertFiniteNumber, assertProbability, assertPositive, sumApproximatelyOne } from "../../lib/math/validate";

describe("validate more", () => {
	it("assertions throw on invalid input", () => {
		expect(() => assertFiniteNumber(NaN)).toThrow();
		expect(() => assertProbability(0)).toThrow();
		expect(() => assertProbability(1)).toThrow();
		expect(() => assertPositive(0)).toThrow();
	});
	it("sumApproximatelyOne respects tolerance", () => {
		expect(sumApproximatelyOne([0.5, 0.5], 1e-9)).toBe(true);
		expect(sumApproximatelyOne([0.5, 0.51], 1e-3)).toBe(false);
	});
}); 