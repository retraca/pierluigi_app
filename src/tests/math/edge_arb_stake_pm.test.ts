import { describe, it, expect } from "vitest";
import { computeEdgePerDollar } from "../../lib/math/edge";
import { detectNWayArb } from "../../lib/math/arb";
import { profitLockOptimize } from "../../lib/math/stake";
import { effectiveFillProbability } from "../../lib/math/pm";

describe("edge & arb & stake & pm", () => {
	it("edge positive when fair prob > break-even", () => {
		const odds = 2.2;
		const pBreakEven = 1 / odds;
		const edge = computeEdgePerDollar(pBreakEven + 0.01, odds);
		expect(edge).toBeGreaterThan(0);
	});

	it("detects simple 2-way arb when sum inverses < 1", () => {
		const res = detectNWayArb([
			{ id: "A", venue: "X", outcome: "A", decimalOdds: 2.1 },
			{ id: "B", venue: "Y", outcome: "B", decimalOdds: 2.1 },
		]);
		expect(res.isArbitrage).toBe(true);
		expect(res.margin).toBeGreaterThan(0);
	});

	it("profit-lock yields equalized payout across outcomes", () => {
		const res = profitLockOptimize({
			legs: [
				{ id: "A", venue: "X", outcome: "A", decimalOdds: 2.2 },
				{ id: "B", venue: "Y", outcome: "B", decimalOdds: 2.2 },
			],
		});
		// equal stakes when odds equal
		expect(res.stakes["A"]).toBeCloseTo(res.stakes["B"], 6);
		expect(res.worstCaseProfit).toBeCloseTo(res.bestCaseProfit, 6);
	});

	it("PM effective prob increases with fees and slippage", () => {
		const p0 = 0.5;
		const pEff = effectiveFillProbability(p0, 100, { makerFeeBps: 10, takerFeeBps: 20 }, { slopeBps: 100, liquidity: 1000 }, true);
		expect(pEff).toBeGreaterThanOrEqual(p0);
	});
}); 