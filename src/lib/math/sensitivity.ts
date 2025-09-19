export function generatePercentShocks(center: number, percents = [1, 2, 3, 4, 5]) {
	return percents.map((pct) => ({ up: center * (1 + pct / 100), down: center * (1 - pct / 100), pct }));
}

export function scenarioGrid<T>(
	values: number[],
	percents = [1, 2, 3, 4, 5],
	compute: (vals: number[]) => T,
): { pct: number; up: T; down: T }[] {
	return percents.map((pct) => {
		const upVals = values.map((v) => v * (1 + pct / 100));
		const downVals = values.map((v) => v * (1 - pct / 100));
		return { pct, up: compute(upVals), down: compute(downVals) };
	});
} 