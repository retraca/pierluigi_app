"use client";

import RoutesLayout from "../_layout";
import { useState } from "react";
import { detectNWayArb } from "@/lib/math/arb";
import { profitLockOptimize } from "@/lib/math/stake";

export default function ArbPage() {
	const [rows, setRows] = useState([
		{ id: "A", venue: "Book A", outcome: "A", decimalOdds: 2.1 },
		{ id: "B", venue: "Book B", outcome: "B", decimalOdds: 2.1 },
	]);
	const detection = detectNWayArb(rows);
	const stakes = detection.isArbitrage ? profitLockOptimize({ legs: rows }) : null;
	return (
		<RoutesLayout>
			<div className="space-y-4">
				<h1 className="text-xl font-semibold">Arbitrage Finder</h1>
				<div className="text-sm">Sum 1/odds = {detection.sumInverse.toFixed(4)}</div>
				<div className="text-sm">Arb Margin = {Math.max(0, detection.margin).toFixed(4)}</div>
				{stakes ? (
					<div className="border rounded p-3">
						<h2 className="font-medium mb-2">Profit‑lock Stakes</h2>
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left">
									<th>Venue</th>
									<th>Outcome</th>
									<th>Stake</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((r) => (
									<tr key={r.id}>
										<td>{r.venue}</td>
										<td>{r.outcome}</td>
										<td>{(stakes.stakes[r.id] ?? 0).toFixed(2)}</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="text-sm mt-2">Worst/Best P&L: {stakes.worstCaseProfit.toFixed(2)}</div>
					</div>
				) : (
					<div className="text-sm">No arbitrage detected</div>
				)}
			</div>
		</RoutesLayout>
	);
} 