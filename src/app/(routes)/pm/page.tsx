"use client";

import RoutesLayout from "../_layout";
import { useState } from "react";
import { effectiveFillProbability } from "@/lib/math/pm";

export default function PMPage() {
	const [p, setP] = useState(0.55);
	const [stake, setStake] = useState(100);
	const eff = effectiveFillProbability(p, stake, { takerFeeBps: 50 }, { slopeBps: 100, liquidity: 10_000 });
	return (
		<RoutesLayout>
			<div className="space-y-4">
				<h1 className="text-xl font-semibold">Prediction Market Analyzer</h1>
				<div className="grid grid-cols-2 gap-3">
					<div>
						<label className="text-sm">PM probability</label>
						<input className="border px-2 py-1 w-full" type="number" step="0.001" value={p} onChange={(e) => setP(Number(e.target.value))} />
					</div>
					<div>
						<label className="text-sm">Stake</label>
						<input className="border px-2 py-1 w-full" type="number" step="1" value={stake} onChange={(e) => setStake(Number(e.target.value))} />
					</div>
				</div>
				<div className="text-sm">Effective fill probability: {(eff * 100).toFixed(2)}%</div>
			</div>
		</RoutesLayout>
	);
} 