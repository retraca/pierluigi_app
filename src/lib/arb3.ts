export type Three = { home: number; draw: number; away: number };

export function impliedFromOdds(o: Three): Three {
	return {
		home: 1 / o.home,
		draw: 1 / o.draw,
		away: 1 / o.away,
	};
}

export function sumThree(t: Three) {
	return t.home + t.draw + t.away;
}

export function arbAnalysis(odds: Three, stake: number) {
	const A = 1 / odds.home + 1 / odds.draw + 1 / odds.away;
	const hasArb = A < 1;
	const R = stake / A;
	const s = {
		home: R / odds.home,
		draw: R / odds.draw,
		away: R / odds.away,
	};
	const profit = R - stake;
	const roi = (profit / stake) * 100;
	return { A, hasArb, R, stakeSplit: s, profit, roi };
}

export function edges(sportsImplied: Three, marketProbPct: Three) {
	const m = {
		home: marketProbPct.home / 100,
		draw: marketProbPct.draw / 100,
		away: marketProbPct.away / 100,
	};
	return {
		home: m.home - sportsImplied.home,
		draw: m.draw - sportsImplied.draw,
		away: m.away - sportsImplied.away,
	};
} 