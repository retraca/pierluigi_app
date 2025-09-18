"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutcomeRow } from "@/components/OutcomeRow";
import { OutcomeInput, Scenario, SessionState } from "@/lib/types";
import { OutcomeArraySchema, ScenarioEnum } from "@/lib/validations";
import { analyze } from "@/lib/math";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";

const defaultRow = (): OutcomeInput => ({
	id: nanoid(6),
	label: "",
	venue: "Sportsbook",
	inputType: "Decimal",
	value: 2.0,
	feePct: 0,
	slippagePct: 0,
});

export function ArbForm({ session, onSessionChange }: { session: SessionState | null; onSessionChange: (s: SessionState) => void }) {
	const [scenario, setScenario] = useState<Scenario>(session?.scenario ?? "Book vs Book");
	const [rows, setRows] = useState<OutcomeInput[]>(session?.outcomes?.length ? session.outcomes : [defaultRow(), defaultRow()]);
	const [totalStake, setTotalStake] = useState<number>(session?.totalStake ?? 100);

	const canAdd = rows.length < 6;
	const canRemove = rows.length > 2;

	const compute = () => {
		const parsed = OutcomeArraySchema.safeParse(rows);
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "Invalid rows");
			return;
		}
		try {
			const result = analyze(rows, totalStake, { suppressArb: scenario === "Book vs PM (YES only)" });
			onSessionChange({
				outcomes: rows,
				scenario,
				totalStake,
				converter: session?.converter ?? { value: "2.0", format: "Decimal" },
			});
			window.dispatchEvent(new CustomEvent("calc:result", { detail: result }));
		} catch (e: any) {
			toast.error(e?.message ?? "Computation failed");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Arbitrage / Edge Calculator</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Tabs value={scenario} onValueChange={(v) => setScenario(v as Scenario)}>
					<TabsList>
						<TabsTrigger value="Book vs Book">Book vs Book</TabsTrigger>
						<TabsTrigger value="Book vs PM (YES & NO)">Book vs PM</TabsTrigger>
						<TabsTrigger value="Book vs PM (YES only)">Book vs PM (NO unavailable)</TabsTrigger>
					</TabsList>
					<TabsContent value={scenario}>
						<div className="space-y-2">
							<div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground">
								<div className="col-span-3">Label</div>
								<div className="col-span-2">Venue</div>
								<div className="col-span-2">Input</div>
								<div className="col-span-2">Value</div>
								<div className="col-span-1">Fee %</div>
								<div className="col-span-1">Slippage %</div>
								<div className="col-span-1">Limit</div>
							</div>
							{rows.map((r, idx) => (
								<OutcomeRow
									key={r.id}
									row={r}
									onChange={(nr) => setRows(rows.map((x) => (x.id === r.id ? nr : x)))}
									onRemove={() => canRemove && setRows(rows.filter((x) => x.id !== r.id))}
								/>
							))}
							<div className="flex gap-2">
								<Button type="button" variant="outline" onClick={() => canAdd && setRows([...rows, defaultRow()])} disabled={!canAdd}>Add outcome</Button>
								<Button type="button" variant="secondary" onClick={() => canRemove && setRows(rows.slice(0, rows.length - 1))} disabled={!canRemove}>Remove last</Button>
							</div>
						</div>
					</TabsContent>
				</Tabs>
				<div className="flex items-center gap-2 pt-2">
					<label className="text-sm text-muted-foreground">Total stake</label>
					<Input className="w-40" type="number" value={totalStake} onChange={(e) => setTotalStake(Number(e.target.value))} min="0" step="1" />
					<Button onClick={compute}>Check opportunities</Button>
				</div>
			</CardContent>
		</Card>
	);
} 