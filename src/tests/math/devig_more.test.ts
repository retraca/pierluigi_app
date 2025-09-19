import { describe, it, expect } from "vitest";
import { devig, proportionalDeVig, shinDeVig, powerDeVig } from "../../lib/math/devig";

const fairOdds = [
	{ id: "A", decimalOdds: 2.5 },
	{ id: "B", decimalOdds: 2.5 },
];

describe("devig additional", () => {
	it("shin falls back to normalization when overround <= 1", () => {
		// Construct odds that sum implied probs <= 1
		const rows = shinDeVig([
			{ id: "A", decimalOdds: 3.0 },
			{ id: "B", decimalOdds: 3.0 },
		]);
		const sum = rows.reduce((a, r) => a + r.fairProbability, 0);
		expect(Math.abs(sum - 1)).toBeLessThan(1e-9);
	});

	it("dispatcher routes to chosen method", () => {
		const a = devig(fairOdds, { method: "proportional" });
		const b = devig(fairOdds, { method: "shin" });
		const c = devig(fairOdds, { method: "power", powerExponent: 0.8 });
		expect(a.length).toBe(2);
		expect(b.length).toBe(2);
		expect(c.length).toBe(2);
	});
}); 