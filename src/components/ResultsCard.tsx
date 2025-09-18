"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { rowsToCSV, downloadCSV } from "@/lib/csv";
import { CalcResult } from "@/lib/types";

export function ResultsCard({ session }: { session: any }) {
	const [result, setResult] = useState<CalcResult | null>(null);

	useEffect(() => {
		const handler = (e: any) => setResult(e.detail);
		window.addEventListener("calc:result", handler as any);
		return () => window.removeEventListener("calc:result", handler as any);
	}, []);

	const badge = result?.resultType ?? "No Edge";
	const badgeClass =
		badge === "True Arbitrage" ? "bg-green-600 text-white" : badge === "Value Only" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900";

	return (
		<Card>
			<CardHeader>
				<CardTitle>Results</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center justify-between">
					<span className={`text-xs px-2 py-1 rounded ${badgeClass}`}>{badge}</span>
					{result && (
						<Button variant="outline" onClick={() => downloadCSV(rowsToCSV(result.rows), "arb_results.csv")}>Export CSV</Button>
					)}
				</div>
				{result && (
					<div className="space-y-2 text-sm">
						{result.overround !== undefined && (
							<div>Overround: {result.overround.toFixed(6)}</div>
						)}
						{result.resultType === "True Arbitrage" && (
							<div>
								<div>Guaranteed Profit: {result.guaranteedProfit}</div>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
									{result.rows.map((r) => (
										<div key={r.label} className="border rounded p-2">
											<div className="font-medium">{r.label}</div>
											<div>Stake: {r.stake?.toFixed(2)}</div>
											<div>Eff. Odds: {r.effectiveDecimal.toFixed(4)}</div>
										</div>
									))}
								</div>
							</div>
						)}
						{result.resultType === "Value Only" && (
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{result.rows.filter((r) => r.kelly && r.kelly > 0).map((r) => (
									<div key={r.label} className="border rounded p-2">
										<div className="font-medium">{r.label}</div>
										<div>Kelly: {(r.kelly! * 100).toFixed(2)}%</div>
										<div>½-Kelly: {(r.halfKelly! * 100).toFixed(2)}%</div>
									</div>
								))}
							</div>
						)}
						<div className="text-xs text-muted-foreground">
							Detailed rows computed client-side. Fees and slippage reduce effective odds.
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
} 