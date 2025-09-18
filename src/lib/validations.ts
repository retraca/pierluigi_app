import { z } from "zod";

export const OddsFormatEnum = z.enum(["Decimal", "American", "Fractional", "Probability", "PM YES", "PM NO"]);
export const VenueEnum = z.enum(["Sportsbook", "Prediction Market"]);
export const InputTypeEnum = OddsFormatEnum;

export const OutcomeInputSchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1).max(100),
	venue: VenueEnum,
	inputType: InputTypeEnum,
	value: z.union([
		z.number().positive(),
		z.string().regex(/^\s*\d+\s*\/\s*\d+\s*$/),
	]),
	feePct: z.number().min(0).max(1).default(0),
	slippagePct: z.number().min(0).max(1).default(0),
	limit: z.number().min(0).optional(),
});

export const ScenarioEnum = z.enum([
	"Book vs Book",
	"Book vs PM (YES & NO)",
	"Book vs PM (YES only)",
]);

export const OutcomeArraySchema = z
	.array(OutcomeInputSchema)
	.min(2, "At least 2 outcomes")
	.max(6, "At most 6 outcomes");

export const SettingsSchema = z.object({
	defaultOddsFormat: OddsFormatEnum,
	feePct: z.number().min(0).max(1).default(0),
	slippagePct: z.number().min(0).max(1).default(0),
	currency: z.string().min(1).max(6).default("$"),
	darkMode: z.enum(["system", "light", "dark"]).default("system"),
});

export type OutcomeInput = z.infer<typeof OutcomeInputSchema>;
export type Scenario = z.infer<typeof ScenarioEnum>;
export type Settings = z.infer<typeof SettingsSchema>; 