import { Three } from "@/lib/arb3";

export type FormState = {
	eventName: string;
	datetime: string;
	stake: number;
	odds: Three;
	marketProb: { home: number; draw: number; away: number };
};

export default function ArbForm({
	value,
	onChange,
}: {
	value: FormState;
	onChange: (v: FormState) => void;
}) {
	const set = (k: Partial<FormState>) => onChange({ ...value, ...k });
	const setOdds = (k: Partial<Three>) => set({ odds: { ...value.odds, ...k } });
	const setMP = (k: Partial<FormState["marketProb"]>) => set({ marketProb: { ...value.marketProb, ...k } });

	const probSum = value.marketProb.home + value.marketProb.draw + value.marketProb.away;

	const impliedFromProb = (p: number) => (p > 0 ? 100 / p : 0);

	const oddsInvalid = {
		home: value.odds.home <= 1.01,
		draw: value.odds.draw <= 1.01,
		away: value.odds.away <= 1.01,
	};

	const stakeInvalid = value.stake <= 0;

	return (
		<div className="card p-4 space-y-6">
			<div>
				<h3 className="sectionTitle mb-2">Event</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<label className="label" htmlFor="eventName">Name</label>
					<input
						id="eventName"
						type="text"
						className="input"
						placeholder="e.g., Team A vs Team B"
						value={value.eventName}
						onChange={(e) => set({ eventName: e.target.value })}
					/>
					<label className="label" htmlFor="datetime">Date & time</label>
					<input
						id="datetime"
						type="text"
						className="input"
						placeholder="YYYY-MM-DD HH:mm"
						value={value.datetime}
						onChange={(e) => set({ datetime: e.target.value })}
					/>
				</div>
			</div>

			<div>
				<h3 className="sectionTitle mb-2">Stake</h3>
				<input
					id="stake"
					type="number"
					min={0}
					step="0.01"
					className="input"
					value={value.stake}
					onChange={(e) => set({ stake: Number(e.target.value) })}
				/>
				{stakeInvalid && <p className="subtle mt-1">Stake must be greater than 0.</p>}
			</div>

			<div>
				<h3 className="sectionTitle mb-2">Sportsbook Odds (decimal)</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div>
						<label className="label" htmlFor="oddH">Home</label>
						<input id="oddH" type="number" min={1.01} step="0.01" className="input" value={value.odds.home} onChange={(e) => setOdds({ home: Number(e.target.value) })} />
						{oddsInvalid.home && <p className="subtle mt-1">Must be greater than 1.01</p>}
					</div>
					<div>
						<label className="label" htmlFor="oddD">Draw</label>
						<input id="oddD" type="number" min={1.01} step="0.01" className="input" value={value.odds.draw} onChange={(e) => setOdds({ draw: Number(e.target.value) })} />
						{oddsInvalid.draw && <p className="subtle mt-1">Must be greater than 1.01</p>}
					</div>
					<div>
						<label className="label" htmlFor="oddA">Away</label>
						<input id="oddA" type="number" min={1.01} step="0.01" className="input" value={value.odds.away} onChange={(e) => setOdds({ away: Number(e.target.value) })} />
						{oddsInvalid.away && <p className="subtle mt-1">Must be greater than 1.01</p>}
					</div>
				</div>
			</div>

			<div>
				<h3 className="sectionTitle mb-2">Prediction-Market Probabilities (%)</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div>
						<label className="label" htmlFor="mpH">Home</label>
						<div className="flex gap-2 items-center">
							<input id="mpH" type="number" min={0} max={100} step="0.1" className="input" value={value.marketProb.home} onChange={(e) => setMP({ home: Number(e.target.value) })} />
							<span className="subtle whitespace-nowrap">Imp. odds {impliedFromProb(value.marketProb.home).toFixed(2)}</span>
						</div>
					</div>
					<div>
						<label className="label" htmlFor="mpD">Draw</label>
						<div className="flex gap-2 items-center">
							<input id="mpD" type="number" min={0} max={100} step="0.1" className="input" value={value.marketProb.draw} onChange={(e) => setMP({ draw: Number(e.target.value) })} />
							<span className="subtle whitespace-nowrap">Imp. odds {impliedFromProb(value.marketProb.draw).toFixed(2)}</span>
						</div>
					</div>
					<div>
						<label className="label" htmlFor="mpA">Away</label>
						<div className="flex gap-2 items-center">
							<input id="mpA" type="number" min={0} max={100} step="0.1" className="input" value={value.marketProb.away} onChange={(e) => setMP({ away: Number(e.target.value) })} />
							<span className="subtle whitespace-nowrap">Imp. odds {impliedFromProb(value.marketProb.away).toFixed(2)}</span>
						</div>
					</div>
				</div>
				{(probSum < 99.9 || probSum > 100.1) && (
					<p className="subtle mt-2">Warning: probabilities sum to {probSum.toFixed(1)}% (not 100%).</p>
				)}
			</div>

			<div className="flex gap-3">
				<button
					type="button"
					className="btn"
					onClick={() =>
						onChange({
							eventName: "Padova vs Virtus Entella",
							datetime: "2025-09-21 18:30",
							stake: 100,
							odds: { home: 5.2, draw: 4.0, away: 3.25 },
							marketProb: { home: 30, draw: 28, away: 42 },
						})
					}
				>
					Load example
				</button>
			</div>
		</div>
	);
} 