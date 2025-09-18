import { test, expect } from "@playwright/test";

test("converter decimal to prob", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByText("Arb & Edge Tool")).toBeVisible();
	await page.getByPlaceholder("Value").first().fill("2.0");
	await expect(page.getByText("0.5").first()).toBeVisible();
});

test("detects simple arbitrage", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByText("Arb & Edge Tool")).toBeVisible();
	// Fill two rows with 2.1 decimals, no fees
	const inputs = page.getByPlaceholder("Value");
	await inputs.nth(1).fill("2.1");
	await inputs.nth(2).fill("2.1");
	await page.getByRole("button", { name: "Check opportunities" }).click();
	await expect(page.getByText(/True Arbitrage|Guaranteed Profit:/)).toBeVisible({ timeout: 15000 });
}); 