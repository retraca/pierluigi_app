"use client";

import Link from "next/link";
import { useSettingsStore } from "@/state/appStore";
import { t } from "@/lib/i18n";

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
	const { language } = useSettingsStore();
	return (
		<div className="min-h-screen grid grid-cols-[240px_1fr]">
			<aside className="border-r px-4 py-6 space-y-3">
				<div className="font-semibold">{t("app.title", language)}</div>
				<nav className="flex flex-col gap-2">
					<Link href="/odds" className="hover:underline">
						{t("nav.odds", language)}
					</Link>
					<Link href="/arb" className="hover:underline">
						{t("nav.arb", language)}
					</Link>
					<Link href="/pm" className="hover:underline">
						{t("nav.pm", language)}
					</Link>
					<Link href="/batch" className="hover:underline">
						{t("nav.batch", language)}
					</Link>
					<Link href="/learn" className="hover:underline">
						{t("nav.learn", language)}
					</Link>
					<Link href="/about" className="hover:underline">
						{t("nav.about", language)}
					</Link>
				</nav>
			</aside>
			<main className="p-6">{children}</main>
		</div>
	);
} 