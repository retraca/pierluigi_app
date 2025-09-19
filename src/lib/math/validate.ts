export function isFiniteNumber(n: unknown): n is number {
	return typeof n === "number" && Number.isFinite(n);
}

export function assertFiniteNumber(n: unknown, name = "value"): asserts n is number {
	if (!isFiniteNumber(n)) throw new Error(`${name} must be a finite number`);
}

export function assertProbability(p: number, name = "probability"): void {
	assertFiniteNumber(p, name);
	if (p <= 0 || p >= 1) throw new Error(`${name} must be in (0,1)`);
}

export function assertPositive(n: number, name = "value"): void {
	assertFiniteNumber(n, name);
	if (n <= 0) throw new Error(`${name} must be > 0`);
}

export function sumApproximatelyOne(values: number[], tol = 1e-8): boolean {
	const sum = values.reduce((a, b) => a + b, 0);
	return Math.abs(sum - 1) <= tol;
} 