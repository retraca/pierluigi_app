import { describe, it, expect } from "vitest";
import { profitLockOptimize, minReturnMaximize, kellySingle, kellyMulti } from "../../lib/math/stake";

describe("stake kelly", () => {
	it("profitLock returns zero when no arb (margin<=0)", () => {
		const res = profitLockOptimize({
			legs: [
				{ id: "A", venue: "X", outcome: "A", decimalOdds: 1.9 },
				{ id: "B", venue: "Y", outcome: "B", decimalOdds: 1.9 },
			],
		});
		expect(res.totalStake).toBe(0);
		expect(res.roi).toBeLessThanOrEqual(1);
	});

	it("minReturnMaximize equals profitLock for positive arb", () => {
		const data = { legs: [
			{ id: "A", venue: "X", outcome: "A", decimalOdds: 2.1 },
			{ id: "B", venue: "Y", outcome: "B", decimalOdds: 2.1 },
		] };
		const a = profitLockOptimize(data);
		const b = minReturnMaximize(data);
		expect(b.totalStake).toBeCloseTo(a.totalStake, 6);
		expect(b.worstCaseProfit).toBeCloseTo(a.worstCaseProfit, 6);
	});

	it("kellySingle respects bounds and fraction", () => {
		const ks = kellySingle({ fairProbability: 0.55, decimalOdds: 2.0, bankroll: 1000, fraction: 0.5 });
		expect(ks.fraction).toBeGreaterThan(0);
		expect(ks.fraction).toBeLessThanOrEqual(0.5);
		expect(ks.stake).toBeCloseTo(1000 * ks.fraction, 6);
	});

	it("kellyMulti returns per-leg stakes", () => {
		const res = kellyMulti({
			legs: [
				{ id: "A", fairProbability: 0.55, decimalOdds: 2.0 },
				{ id: "B", fairProbability: 0.45, decimalOdds: 3.0 },
			],
			bankroll: 2000,
			fraction: 0.25,
		});
		expect(res["A"].stake).toBeGreaterThanOrEqual(0);
		expect(res["B"].stake).toBeGreaterThanOrEqual(0);
	});
}); 