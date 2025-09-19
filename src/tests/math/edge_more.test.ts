import { describe, it, expect } from "vitest";
import { computeEdgePerDollar, expectedProfit, roi } from "../../lib/math/edge";

describe("edge more", () => {
	it("fees decrease edge and ROI", () => {
		const p = 0.55;
		const o = 2.0;
		const e0 = computeEdgePerDollar(p, o);
		const e1 = computeEdgePerDollar(p, o, { winningsFeeBps: 100, stakeFeeBps: 100 });
		expect(e1).toBeLessThan(e0);
		expect(roi(p, o, { winningsFeeBps: 100 })).toBeLessThan(roi(p, o));
		const prof = expectedProfit(100, p, o, { winningsFeeBps: 100 });
		expect(prof).toBeCloseTo(100 * computeEdgePerDollar(p, o, { winningsFeeBps: 100 }), 6);
	});
}); 