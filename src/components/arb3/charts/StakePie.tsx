"use client";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Three } from "@/lib/arb3";

export default function StakePie({ split }: { split: Three }) {
	const data = [
		{ name: "Home", value: split.home },
		{ name: "Draw", value: split.draw },
		{ name: "Away", value: split.away },
	];
	const colors = ["#22C55E", "#B8A7E8", "#9B87D9"];
	return (
		<div style={{ width: "100%", height: 260 }}>
			<ResponsiveContainer>
				<PieChart>
					<Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} stroke="#000" strokeOpacity={0.2}>
						{data.map((_, i) => (
							<Cell key={i} fill={colors[i % colors.length]} />
						))}
					</Pie>
					<Tooltip formatter={(v: any) => `$${Number(v).toFixed(2)}`} contentStyle={{ background: "#121215", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
} 