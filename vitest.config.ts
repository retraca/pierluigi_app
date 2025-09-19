import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [],
	css: { postcss: {} },
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["src/tests/**/*.test.ts"],
		exclude: ["tests/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			reportsDirectory: "./coverage",
			include: ["src/lib/math/**/*.ts"],
			exclude: ["**/*.test.ts"],
		},
	},
}); 