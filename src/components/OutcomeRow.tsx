"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OutcomeInput, Venue, InputType } from "@/lib/types";

const venueOptions: Venue[] = ["Sportsbook", "Prediction Market"];
const inputTypeOptions: InputType[] = ["Decimal", "American", "Fractional", "Probability", "PM YES", "PM NO"];

export function OutcomeRow({ row, onChange, onRemove }: { row: OutcomeInput; onChange: (r: OutcomeInput) => void; onRemove: () => void }) {
	return (
		<div className="grid grid-cols-12 gap-2 items-center">
			<Input className="col-span-3" value={row.label} onChange={(e) => onChange({ ...row, label: e.target.value })} placeholder="Outcome" />
			<Select value={row.venue} onValueChange={(v) => onChange({ ...row, venue: v as Venue })}>
				<SelectTrigger className="col-span-2"><SelectValue placeholder="Venue" /></SelectTrigger>
				<SelectContent>
					{venueOptions.map((v) => (
						<SelectItem key={v} value={v}>{v}</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={row.inputType} onValueChange={(v) => onChange({ ...row, inputType: v as InputType })}>
				<SelectTrigger className="col-span-2"><SelectValue placeholder="Type" /></SelectTrigger>
				<SelectContent>
					{inputTypeOptions.map((t) => (
						<SelectItem key={t} value={t}>{t}</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Input className="col-span-2" value={String(row.value)} onChange={(e) => onChange({ ...row, value: e.target.value })} placeholder="Value" />
			<Input className="col-span-1" type="number" value={row.feePct} onChange={(e) => onChange({ ...row, feePct: Number(e.target.value) })} step="0.01" min="0" max="1" />
			<Input className="col-span-1" type="number" value={row.slippagePct} onChange={(e) => onChange({ ...row, slippagePct: Number(e.target.value) })} step="0.01" min="0" max="1" />
			<Input className="col-span-1" type="number" value={row.limit ?? ""} onChange={(e) => onChange({ ...row, limit: e.target.value ? Number(e.target.value) : undefined })} step="1" min="0" placeholder="Limit" />
			<button className="text-sm text-red-600" onClick={onRemove}>Remove</button>
		</div>
	);
} 