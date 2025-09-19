"use client";

import RoutesLayout from "../_layout";
import { useState } from "react";
import { parseCsv } from "@/lib/csv/parse";

export default function BatchPage() {
	const [text, setText] = useState("");
	const [summary, setSummary] = useState<string>("");
	return (
		<RoutesLayout>
			<div className="space-y-4">
				<h1 className="text-xl font-semibold">Batch Processor</h1>
				<textarea className="border w-full h-40 p-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste CSV content here" />
				<button
					className="border px-3 py-1 rounded"
					onClick={() => {
						const { rows, errors } = parseCsv(text);
						setSummary(`Rows: ${rows.length}, Errors: ${errors.length}`);
					}}
				>
					Parse
				</button>
				{summary && <div className="text-sm">{summary}</div>}
			</div>
		</RoutesLayout>
	);
} 