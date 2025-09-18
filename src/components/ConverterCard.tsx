"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { OddsFormat, SessionState } from "@/lib/types";
import { parseValueToDecimal, decimalToProb, probToDecimal, decimalToAmerican, toAllFormats } from "@/lib/formats";
import { toast } from "sonner";

export function ConverterCard({ session, onSessionChange }: { session: SessionState | null; onSessionChange: (s: SessionState) => void }) {
	const [val, setVal] = useState<string>(session?.converter?.value ?? "2.0");
	const [fmt, setFmt] = useState<OddsFormat>(session?.converter?.format ?? "Decimal");

	useEffect(() => {
		if (!session) return;
		onSessionChange({ ...session, converter: { value: val, format: fmt } });
	}, [val, fmt]);

	const results = useMemo(() => {
		try {
			const decimal = parseValueToDecimal(fmt, fmt === "Fractional" ? val : Number(val));
			const p = decimalToProb(decimal);
			const all = toAllFormats(decimal);
			return { decimal, p, all, error: null as null | string };
		} catch (e: any) {
			return { decimal: null, p: null, all: null, error: e?.message ?? "Invalid input" };
		}
	}, [val, fmt]);

	useEffect(() => {
		if (results.error) toast.error(results.error);
	}, [results.error]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Converter</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex gap-2">
					<Input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Value" />
					<Select value={fmt} onValueChange={(v) => setFmt(v as OddsFormat)}>
						<SelectTrigger className="w-[170px]"><SelectValue placeholder="Format" /></SelectTrigger>
						<SelectContent>
							<SelectItem value="Decimal">Decimal</SelectItem>
							<SelectItem value="American">American</SelectItem>
							<SelectItem value="Fractional">Fractional</SelectItem>
							<SelectItem value="Probability">Probability</SelectItem>
							<SelectItem value="PM YES">PM YES</SelectItem>
							<SelectItem value="PM NO">PM NO</SelectItem>
						</SelectContent>
					</Select>
				</div>
				{results.error ? (
					<p className="text-sm text-red-500">{results.error}</p>
				) : (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
						<div><span className="text-muted-foreground">Decimal:</span> {results.all?.decimal}</div>
						<div><span className="text-muted-foreground">Prob:</span> {results.all?.probability}</div>
						<div><span className="text-muted-foreground">American:</span> {results.all?.american}</div>
						<div><span className="text-muted-foreground">Fractional:</span> {results.all?.fractional}</div>
					</div>
				)}
				<div className="flex items-center justify-between pt-2">
					<Button variant="outline" disabled>Remove vig (N-way)…</Button>
				</div>
			</CardContent>
		</Card>
	);
} 