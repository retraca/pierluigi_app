"use client";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { Three } from "@/lib/arb3";

export default function ReturnBars({ returns, target }: { returns: Three; target: number }) {
	const data = [
		{ name: "Home", value: returns.home },
		{ name: "Draw", value: returns.draw },
		{ name: "Away", value: returns.away },
	];
	return (
		<div style={{ width: "100%", height: 260 }}>
			<ResponsiveContainer>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
					<XAxis dataKey="name" stroke="#A9A9B2" />
					<YAxis stroke="#A9A9B2" />
					<Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
					<ReferenceLine y={target} stroke="#22C55E" strokeDasharray="4 4" label={{ value: `Target $${target.toFixed(2)}`, position: "insideTop", fill: "#22C55E" }} />
					<Bar dataKey="value" fill="#9B87D9" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
} 