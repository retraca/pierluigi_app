"use client";

import { Header } from "@/components/Header";
import { ConverterCard } from "@/components/ConverterCard";
import { ArbForm } from "@/components/ArbForm";
import { ResultsCard } from "@/components/ResultsCard";
import { SettingsCard } from "@/components/SettingsCard";
import { useEffect, useState } from "react";
import { SessionState } from "@/lib/types";
import { loadSession, saveSession } from "@/lib/storage";

export default function Page() {
	const [session, setSession] = useState<SessionState | null>(null);

	useEffect(() => {
		setSession(loadSession());
	}, []);

	useEffect(() => {
		if (session) saveSession(session);
	}, [session]);

	return (
		<div className="min-h-screen">
			<div className="max-w-5xl mx-auto p-6 space-y-6">
				<Header />
				<ConverterCard session={session} onSessionChange={setSession} />
				<ArbForm session={session} onSessionChange={setSession} />
				<ResultsCard session={session} />
				<SettingsCard session={session} onSessionChange={setSession} />
			</div>
		</div>
	);
}
