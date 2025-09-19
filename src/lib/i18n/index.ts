import en from "./en.json";

export type Messages = typeof en;

const dictionaries: Record<string, Messages> = {
	en,
};

export function t(key: keyof Messages, locale = "en"): string {
	const dict = dictionaries[locale] ?? en;
	return dict[key] ?? key;
} 