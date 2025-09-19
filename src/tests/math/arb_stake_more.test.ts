import { describe, it, expect } from "vitest";
import { detectWithFeesAndSlippage } from "../../lib/math/arb";
import { profitLockOptimize } from "../../lib/math/stake";

describe("arb & stake additional", () => {
	it("fees and slippage reduce margin", () => {
		const base = [{ id: "A", venue: "X", outcome: "A", decimalOdds: 2.1 }, { id: "B", venue: "Y", outcome: "B", decimalOdds: 2.1 }];
		const res0 = detectWithFeesAndSlippage(base, 0);
		const res1 = detectWithFeesAndSlippage(base.map((l) => ({ ...l, feeBps: 100, slippageBps: 100 })), 1);
		expect(res1.margin).toBeLessThanOrEqual(res0.margin);
	});

	it("caps bind and reduce C", () => {
		const res = profitLockOptimize({
			legs: [
				{ id: "A", venue: "X", outcome: "A", decimalOdds: 3.2, maxStake: 10 },
				{ id: "B", venue: "Y", outcome: "B", decimalOdds: 3.2, maxStake: 5 },
				{ id: "C", venue: "Z", outcome: "C", decimalOdds: 3.2, maxStake: 100 },
			],
		});
		// Leg with smallest cap should bind
		expect(res.stakes["B"]).toBeCloseTo(5, 6);
	});
}); 