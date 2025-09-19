import { Three } from "@/lib/arb3";

export default function Summary({
	A,
	hasArb,
	R,
	profit,
	roi,
	split,
	returns,
	stake,
}: {
	A: number;
	hasArb: boolean;
	R: number;
	profit: number;
	roi: number;
	split: Three;
	returns: Three;
	stake: number;
}) {
	return (
		<div className="card p-4 space-y-4">
			<div>
				<span
					className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${hasArb ? "bg-primary text-black" : "bg-red-500/20 text-red-300"}`}
				>
					{hasArb ? `Arbitrage found ✅ +${(Math.max(0, roi)).toFixed(2)}%` : "No arbitrage ❌"}
				</span>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
				<Metric label="Guaranteed Return" value={`$${R.toFixed(2)}`} />
				<Metric label="Profit" value={`$${profit.toFixed(2)}`} />
				<Metric label="ROI" value={`${roi.toFixed(2)}%`} />
				<Metric label="Inverse Sum A" value={A.toFixed(4)} />
				<Metric label="Target Return R" value={`$${R.toFixed(2)}`} />
			</div>

			<div>
				<h3 className="sectionTitle mb-2">Split & Returns</h3>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="text-left text-muted-foreground">
							<tr>
								<th className="py-2">Outcome</th>
								<th className="py-2">Stake</th>
								<th className="py-2">Return</th>
							</tr>
						</thead>
						<tbody>
							<Row name="Home" stake={split.home} ret={returns.home} />
							<Row name="Draw" stake={split.draw} ret={returns.draw} />
							<Row name="Away" stake={split.away} ret={returns.away} />
						</tbody>
					</table>
				</div>
				<p className="subtle mt-2">Total stake: ${stake.toFixed(2)}</p>
			</div>
		</div>
	);
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl bg-black/20 border border-white/10 p-3">
			<div className="subtle">{label}</div>
			<div className="text-base font-semibold">{value}</div>
		</div>
	);
}

function Row({ name, stake, ret }: { name: string; stake: number; ret: number }) {
	return (
		<tr className="border-t border-white/10">
			<td className="py-2">{name}</td>
			<td className="py-2">${stake.toFixed(2)}</td>
			<td className="py-2">${ret.toFixed(2)}</td>
		</tr>
	);
} 