import Papa from "papaparse";
import { z } from "zod";

export const RowSchema = z.object({
	market_id: z.string(),
	venue: z.string(),
	outcome: z.string(),
	odds_format: z.enum(["decimal", "american", "fractional", "hongKong", "indonesian", "malay"]),
	odds_value: z.string().or(z.number()),
	max_stake: z.string().or(z.number()).optional(),
	fee_bps: z.string().or(z.number()).optional(),
	is_prediction_market: z.string().or(z.boolean()).optional(),
	pm_price: z.string().or(z.number()).optional(),
});
export type CsvRow = z.infer<typeof RowSchema>;

export function parseCsv(text: string): { rows: CsvRow[]; errors: string[] } {
	const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
	const errors: string[] = [];
	const rows: CsvRow[] = [];
	for (const rec of parsed.data as Record<string, unknown>[]) {
		const result = RowSchema.safeParse(rec);
		if (result.success) rows.push(result.data);
		else errors.push(result.error.message);
	}
	return { rows, errors };
} 