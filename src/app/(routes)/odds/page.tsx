"use client";

import RoutesLayout from "../_layout";
import { useState } from "react";
import { fromDecimal, decimalToProbability, probabilityToDecimal } from "@/lib/math/odds";
import { proportionalDeVig, devig } from "@/lib/math/devig";

export default function OddsPage() {
	const [odds, setOdds] = useState<number[]>([2.0, 2.0]);
	const implied = odds.map((d) => decimalToProbability(d));
	const rows = proportionalDeVig(odds.map((d, i) => ({ id: String(i), decimalOdds: d })));
	return (
		<RoutesLayout>
			<div className="space-y-4">
				<h1 className="text-xl font-semibold">Odds Converter & De‑vig</h1>
				<div className="grid grid-cols-2 gap-3">
					{odds.map((d, i) => (
						<div key={i} className="space-y-1">
							<label className="text-sm">Outcome {i + 1} (decimal)</label>
							<input
								type="number"
								step="0.01"
								className="border px-2 py-1 w-full"
								value={d}
								onChange={(e) => {
									const next = [...odds];
									next[i] = Number(e.target.value);
									setOdds(next);
								}}
							/>
							<div className="text-xs opacity-70">Implied p: {(implied[i] * 100).toFixed(2)}%</div>
						</div>
					))}
				</div>
				<div className="border rounded p-3">
					<h2 className="font-medium mb-2">Proportional de‑vig</h2>
					<table className="w-full text-sm">
						<thead>
							<tr className="text-left">
								<th>Outcome</th>
								<th>Fair p</th>
								<th>Fair decimal</th>
								<th>American</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((r, i) => {
								const conv = fromDecimal(r.fairDecimalOdds);
								return (
									<tr key={r.id}>
										<td>{i + 1}</td>
										<td>{(r.fairProbability * 100).toFixed(2)}%</td>
										<td>{r.fairDecimalOdds.toFixed(3)}</td>
										<td>{conv.american.toFixed(1)}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</RoutesLayout>
	);
} 