"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings, SessionState, OddsFormat } from "@/lib/types";
import { loadSettings, saveSettings, resetSession } from "@/lib/storage";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function SettingsCard({ session, onSessionChange }: { session: SessionState | null; onSessionChange: (s: SessionState) => void }) {
	const { theme, setTheme, systemTheme } = useTheme();
	const [settings, setSettings] = useState<Settings>(
		loadSettings() ?? { defaultOddsFormat: "Decimal", feePct: 0, slippagePct: 0, currency: "$", darkMode: "system" }
	);

	useEffect(() => {
		saveSettings(settings);
	}, [settings]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Settings & Assumptions</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					<div>
						<label className="text-sm text-muted-foreground">Default Format</label>
						<Select value={settings.defaultOddsFormat} onValueChange={(v) => setSettings({ ...settings, defaultOddsFormat: v as OddsFormat })}>
							<SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
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
					<div>
						<label className="text-sm text-muted-foreground">Fee %</label>
						<Input type="number" value={settings.feePct} onChange={(e) => setSettings({ ...settings, feePct: Number(e.target.value) })} min="0" max="1" step="0.01" />
					</div>
					<div>
						<label className="text-sm text-muted-foreground">Slippage %</label>
						<Input type="number" value={settings.slippagePct} onChange={(e) => setSettings({ ...settings, slippagePct: Number(e.target.value) })} min="0" max="1" step="0.01" />
					</div>
					<div>
						<label className="text-sm text-muted-foreground">Currency</label>
						<Input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} />
					</div>
				</div>
				<div className="flex items-center gap-3 pt-2">
					<label className="text-sm text-muted-foreground">Dark mode</label>
					<Select value={(settings.darkMode ?? "system") as any} onValueChange={(v) => { setSettings({ ...settings, darkMode: v as any }); setTheme(v); }}>
						<SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
						<SelectContent>
							<SelectItem value="system">System</SelectItem>
							<SelectItem value="light">Light</SelectItem>
							<SelectItem value="dark">Dark</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="destructive" onClick={() => { resetSession(); onSessionChange({ ...session!, outcomes: [], totalStake: 0 } as any); }}>Reset session</Button>
				</div>
			</CardContent>
		</Card>
	);
} 