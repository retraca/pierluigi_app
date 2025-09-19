"use client";
import { useMemo, useState } from "react";
import ArbForm, { FormState } from "@/components/arb3/ArbForm";
import Summary from "@/components/arb3/Summary";
import StakePie from "@/components/arb3/charts/StakePie";
import ReturnBars from "@/components/arb3/charts/ReturnBars";
import CompareBars from "@/components/arb3/charts/CompareBars";
import { arbAnalysis, impliedFromOdds, edges } from "@/lib/arb3";

export default function Page() {
	const [form, setForm] = useState<FormState>({
		eventName: "",
		datetime: "",
		stake: 100,
		odds: { home: 5.2, draw: 4.0, away: 3.25 },
		marketProb: { home: 30, draw: 28, away: 42 },
	});

	const analysis = useMemo(() => arbAnalysis(form.odds, form.stake), [form]);
	const sportsImplied = useMemo(() => impliedFromOdds(form.odds), [form]);
	const delta = useMemo(() => edges(sportsImplied, form.marketProb), [sportsImplied, form.marketProb]);

	const equalReturn = analysis.R;
	const returns = {
		home: analysis.stakeSplit.home * form.odds.home,
		draw: analysis.stakeSplit.draw * form.odds.draw,
		away: analysis.stakeSplit.away * form.odds.away,
	};

	return (
		<main className="p-6 max-w-7xl mx-auto space-y-6">
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Arb Lab – 3-Way Sure Bet</h1>
				<button
					className="btn"
					onClick={() =>
						setForm({
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
			</header>

			<div className="gridTwo">
				<div className="space-y-6">
					<ArbForm value={form} onChange={setForm} />
				</div>

				<div className="space-y-6">
					<Summary
						A={analysis.A}
						hasArb={analysis.hasArb}
						R={analysis.R}
						profit={analysis.profit}
						roi={analysis.roi}
						split={analysis.stakeSplit}
						returns={returns}
						stake={form.stake}
					/>

					<div className="card p-4">
						<h3 className="sectionTitle mb-4">Stake Split</h3>
						<StakePie split={analysis.stakeSplit} />
					</div>

					<div className="card p-4">
						<h3 className="sectionTitle mb-4">Equal-Return Check</h3>
						<ReturnBars returns={returns} target={equalReturn} />
					</div>

					<div className="card p-4">
						<h3 className="sectionTitle mb-4">Sportsbook vs Market Probabilities</h3>
						<CompareBars sportsImplied={sportsImplied} marketProbPct={form.marketProb} />
						<p className="subtle mt-3">
							Positive delta means the sportsbook is pricing lower probability than the market – potential value.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
} 