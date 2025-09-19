import { describe, it, expect } from "vitest";
import { effectiveFillProbability } from "../../lib/math/pm";
import { scenarioGrid } from "../../lib/math/sensitivity";
import { isFiniteNumber, sumApproximatelyOne } from "../../lib/math/validate";

describe("pm/sensitivity/validate", () => {
	it("pm effective prob increases with stake and fees", () => {
		const p1 = effectiveFillProbability(0.4, 0, { takerFeeBps: 0 });
		const p2 = effectiveFillProbability(0.4, 100, { takerFeeBps: 50 }, { slopeBps: 100, liquidity: 1000 });
		expect(p2).toBeGreaterThanOrEqual(p1);
	});

	it("scenario grid computes both directions", () => {
		const base = [1, 2, 3];
		const grid = scenarioGrid(base, [5], (vals) => vals.reduce((a, b) => a + b, 0));
		expect(grid[0].up).toBe(1 * 1.05 + 2 * 1.05 + 3 * 1.05);
		expect(grid[0].down).toBe(1 * 0.95 + 2 * 0.95 + 3 * 0.95);
	});

	it("validate helpers", () => {
		expect(isFiniteNumber(5)).toBe(true);
		expect(isFiniteNumber(Infinity)).toBe(false);
		expect(sumApproximatelyOne([0.5, 0.5])).toBe(true);
		expect(sumApproximatelyOne([0.6, 0.5], 1e-3)).toBe(false);
	});
}); 