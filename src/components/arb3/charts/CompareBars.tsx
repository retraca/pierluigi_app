"use client";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Three } from "@/lib/arb3";

export default function CompareBars({ sportsImplied, marketProbPct }: { sportsImplied: Three; marketProbPct: { home: number; draw: number; away: number } }) {
	const data = [
		{ name: "Home", Sportsbook: sportsImplied.home * 100, Market: marketProbPct.home },
		{ name: "Draw", Sportsbook: sportsImplied.draw * 100, Market: marketProbPct.draw },
		{ name: "Away", Sportsbook: sportsImplied.away * 100, Market: marketProbPct.away },
	];
	return (
		<div style={{ width: "100%", height: 300 }}>
			<ResponsiveContainer>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
					<XAxis dataKey="name" stroke="#A9A9B2" />
					<YAxis unit="%" stroke="#A9A9B2" />
					<Tooltip formatter={(v: any) => `${Number(v).toFixed(2)}%`} contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
					<Legend />
					<Bar dataKey="Sportsbook" fill="#9B87D9" />
					<Bar dataKey="Market" fill="#22C55E" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
} 