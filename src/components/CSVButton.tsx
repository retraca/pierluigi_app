"use client";

import { Button } from "@/components/ui/button";
import { rowsToCSV, downloadCSV } from "@/lib/csv";
import { OutcomeComputed } from "@/lib/types";

export function CSVButton({ rows, filename = "export.csv" }: { rows: OutcomeComputed[]; filename?: string }) {
	return (
		<Button variant="outline" onClick={() => downloadCSV(rowsToCSV(rows), filename)}>Export CSV</Button>
	);
} 