export function roundToTick(value: number, tick: number): number {
	if (!Number.isFinite(value) || !Number.isFinite(tick) || tick <= 0) throw new Error("Invalid tick");
	return Math.round(value / tick) * tick;
}

export function formatCurrency(value: number, currencySymbol = "$", locale = "en-US"): string {
	return `${currencySymbol}${new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
} 