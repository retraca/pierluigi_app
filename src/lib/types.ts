export type OddsFormat = "Decimal" | "American" | "Fractional" | "Probability" | "PM YES" | "PM NO";

export type Venue = "Sportsbook" | "Prediction Market";

export type InputType = "Decimal" | "American" | "Fractional" | "Probability" | "PM YES" | "PM NO";

export type Scenario =
	| "Book vs Book"
	| "Book vs PM (YES & NO)"
	| "Book vs PM (YES only)";

export interface OutcomeInput {
	id: string;
	label: string;
	venue: Venue;
	inputType: InputType;
	value: number | string; // number for decimals/prob; string supports fractional like "5/2"
	feePct: number; // [0,1]
	slippagePct: number; // [0,1]
	limit?: number; // >= 0 optional
}

export interface Settings {
	defaultOddsFormat: OddsFormat;
	feePct: number;
	slippagePct: number;
	currency: string;
	darkMode?: "system" | "light" | "dark";
}

export interface ConverterState {
	value: string;
	format: OddsFormat;
}

export interface SessionState {
	outcomes: OutcomeInput[];
	scenario: Scenario;
	totalStake: number;
	converter: ConverterState;
}

export interface OutcomeComputed {
	label: string;
	venue: Venue;
	inputType: InputType;
	valueRaw: number | string;
	impliedProb: number; // [0,1]
	fairProb?: number; // vig-removed prob if provided context
	fairDecimalOdds?: number;
	effectiveDecimal: number; // after fees/slippage mapping
	stake?: number; // for arb split
	kelly?: number; // [0,1]
	halfKelly?: number; // [0,1]
	notes?: string;
}

export type ResultType = "True Arbitrage" | "Value Only" | "No Edge";

export interface CalcResult {
	resultType: ResultType;
	overround?: number; // sum of implied probs if computing vig
	rows: OutcomeComputed[];
	stakeTotal?: number;
	guaranteedProfit?: number; // if arb
	edgeNote?: string; // optional summary
} 