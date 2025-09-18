import { OutcomeComputed } from "@/lib/types";

export function rowsToCSV(rows: OutcomeComputed[]): string {
	const headers = [
		"Label",
		"Venue",
		"Input Type",
		"Value",
		"Implied Prob",
		"Fair Prob",
		"Effective Decimal",
		"Stake",
		"Kelly",
		"Half-Kelly",
		"Notes",
	];
	const lines = rows.map((r) => [
		r.label,
		r.venue,
		r.inputType,
		String(r.valueRaw ?? ""),
		String(r.impliedProb ?? ""),
		String(r.fairProb ?? ""),
		String(r.effectiveDecimal ?? ""),
		String(r.stake ?? ""),
		String(r.kelly ?? ""),
		String(r.halfKelly ?? ""),
		r.notes ?? "",
	]);
	const all = [headers, ...lines];
	return all.map((row) => row.map(escapeCSV).join(",")).join("\n");
}

function escapeCSV(field: string): string {
	if (field == null) return "";
	const f = String(field);
	if (/[",\n]/.test(f)) {
		return '"' + f.replace(/"/g, '""') + '"';
	}
	return f;
}

export function downloadCSV(content: string, filename = "export.csv") {
	if (typeof window === "undefined") return;
	const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
} 