import { describe, it, expect } from "vitest";
import { malayToDecimal, decimalToMalay, indonesianToDecimal, decimalToIndonesian, decimalToFractional, fractionalToDecimal } from "../../lib/math/odds";

describe("odds more", () => {
	it("malay positive/negative boundaries", () => {
		expect(malayToDecimal(1)).toBe(2);
		expect(malayToDecimal(-0.5)).toBe(1.5);
		expect(() => malayToDecimal(0)).toThrow();
	});
	it("indonesian zero and negatives", () => {
		expect(indonesianToDecimal(0)).toBe(1);
		const d = 1.8;
		const indo = decimalToIndonesian(d);
		expect(indonesianToDecimal(indo)).toBeCloseTo(d, 6);
	});
	it("fractional round-trip common", () => {
		const d = 2.5;
		const [n, k] = decimalToFractional(d);
		expect(fractionalToDecimal(n, k)).toBeCloseTo(d, 6);
	});
}); 