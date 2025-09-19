import { create } from "zustand";

export interface SettingsState {
	defaultOddsFormat: "decimal" | "american" | "fractional" | "hongKong" | "indonesian" | "malay";
	currencySymbol: string;
	darkModeDefault: boolean;
	language: string;
	defaultFeesBps: number;
	defaultSlippageBps: number;
	defaultBankroll: number;
	minRoi: number; // e.g., 0.0 -> no constraint
	stakeTick: number; // e.g., 0.01 or 1
	persistSession: boolean;
	set: (p: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
	defaultOddsFormat: "decimal",
	currencySymbol: "$",
	darkModeDefault: true,
	language: "en",
	defaultFeesBps: 0,
	defaultSlippageBps: 0,
	defaultBankroll: 1000,
	minRoi: 0,
	stakeTick: 0.01,
	persistSession: true,
	set: (p) => set(() => ({ ...p })),
})); 