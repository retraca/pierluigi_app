import { describe, it, expect } from "vitest";
import { roundToTick, formatCurrency } from "../../lib/math/money";

describe("money utils", () => {
	it("rounds to tick correctly", () => {
		expect(roundToTick(10.03, 0.01)).toBeCloseTo(10.03);
		expect(roundToTick(10.034, 0.01)).toBeCloseTo(10.03);
		expect(roundToTick(10.035, 0.01)).toBeCloseTo(10.04);
		expect(roundToTick(123, 5)).toBe(125);
	});

	it("formats currency", () => {
		const s = formatCurrency(1234.5, "$", "en-US");
		expect(s).toContain("$");
		expect(s).toContain("1,234.50");
	});
}); 