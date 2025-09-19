import { describe, it, expect } from "vitest";
import {
	decimalToProbability,
	probabilityToDecimal,
	decimalToAmerican,
	americanToDecimal,
	decimalToHongKong,
	hongKongToDecimal,
	decimalToIndonesian,
	indonesianToDecimal,
	decimalToMalay,
	malayToDecimal,
	decimalToFractional,
	fractionalToDecimal,
} from "../../lib/math/odds";

function close(a: number, b: number, tol = 1e-9) {
	expect(Math.abs(a - b)).toBeLessThanOrEqual(tol);
}

describe("odds conversions", () => {
	it("decimal <-> probability", () => {
		const d = 2.5;
		const p = decimalToProbability(d);
		close(probabilityToDecimal(p), d);
	});

	it("american <-> decimal", () => {
		for (const d of [1.5, 1.91, 2.0, 3.25, 10]) {
			const a = decimalToAmerican(d);
			const back = americanToDecimal(a);
			close(back, d, 1e-6);
		}
	});

	it("hongkong <-> decimal", () => {
		for (const d of [1.25, 2.0, 3.0]) {
			const hk = decimalToHongKong(d);
			const back = hongKongToDecimal(hk);
			close(back, d);
		}
	});

	it("indonesian <-> decimal", () => {
		for (const d of [1.5, 1.8, 2.0, 4.0]) {
			const i = decimalToIndonesian(d);
			const back = indonesianToDecimal(i);
			close(back, d, 1e-6);
		}
	});

	it("malay <-> decimal", () => {
		for (const d of [1.5, 1.8, 2.0, 4.0]) {
			const m = decimalToMalay(d);
			const back = malayToDecimal(m);
			close(back, d, 1e-6);
		}
	});

	it("fractional <-> decimal", () => {
		const samples: [number, number][][] = [
			[[1, 1]],
			[[3, 2]],
			[[5, 2]],
			[[13, 5]],
		];
		for (const [[n, k]] of samples) {
			const d = fractionalToDecimal(n, k);
			const [n2, k2] = decimalToFractional(d);
			close(fractionalToDecimal(n2, k2), d, 1e-6);
		}
	});
}); 