"use client";

import RoutesLayout from "../_layout";

export default function AboutPage() {
	return (
		<RoutesLayout>
			<div className="space-y-4">
				<h1 className="text-xl font-semibold">About</h1>
				<p className="text-sm opacity-80">Open‑source workbench for sports odds and prediction markets. Educational use only.</p>
			</div>
		</RoutesLayout>
	);
} 