export function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
	if (rows.length === 0) return "";
	const headers = Object.keys(rows[0]);
	const escape = (v: unknown) =>
		typeof v === "string" && (v.includes(",") || v.includes("\n") || v.includes("\""))
			? `"${v.replace(/"/g, '""')}"`
			: String(v ?? "");
	const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
	return lines.join("\n");
}

export function toJson<T>(rows: T[]): string {
	return JSON.stringify(rows, null, 2);
} 