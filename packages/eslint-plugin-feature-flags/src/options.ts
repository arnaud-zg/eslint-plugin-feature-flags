import type { Rule } from "eslint";
import type { JSONSchema4 } from "json-schema";

import type { FlagDefinitions } from "./flags";
import { EXPIRY_DATE } from "./flags";

/** What the rules know about the project's flags. */
export interface FlagOptions {
  featureFlags: FlagDefinitions;
  /** The functions that read a flag, such as `isEnabled` in `isEnabled("new-checkout")`. */
  identifiers: string[];
}

const DEFAULT_IDENTIFIERS = ["getFeatureFlag"];

/** Where the flags are declared once for every rule: `settings: { "feature-flags": { … } }`. */
export const SETTINGS_KEY = "feature-flags";

/** The schema of the options every rule shares. */
export const flagOptionsSchema = {
  featureFlags: {
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        expires: { type: "string", pattern: EXPIRY_DATE.source },
        description: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  identifiers: { type: "array", items: { type: "string" }, minItems: 1 },
} satisfies Record<keyof FlagOptions, JSONSchema4>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** A rule's options. ESLint checked them against the rule's schema before the rule runs. */
export const ruleOptions = <Options extends object>(
  context: Rule.RuleContext,
): Partial<Options> => {
  const options: unknown = context.options[0];
  return isRecord(options) ? (options as Partial<Options>) : {};
};

const invalidSettings = (path: string, expected: string) =>
  new Error(`settings["${SETTINGS_KEY}"].${path} must be ${expected}.`);

/** Settings reach no schema, so they are checked here, with an error that names the key. */
const parseSettings = (settings: unknown): Partial<FlagOptions> => {
  if (settings === undefined) return {};
  if (!isRecord(settings)) throw invalidSettings("", "an object");
  const { featureFlags, identifiers } = settings;
  if (featureFlags !== undefined && !isRecord(featureFlags)) {
    throw invalidSettings("featureFlags", "an object of flags");
  }
  const definitions: FlagDefinitions = {};
  for (const [name, definition] of Object.entries(featureFlags ?? {})) {
    if (!isRecord(definition)) throw invalidSettings(`featureFlags["${name}"]`, "an object");
    const { expires, description } = definition;
    if (expires !== undefined && (typeof expires !== "string" || !EXPIRY_DATE.test(expires))) {
      throw invalidSettings(`featureFlags["${name}"].expires`, "a YYYY-MM-DD date");
    }
    definitions[name] = {
      expires,
      description: typeof description === "string" ? description : undefined,
    };
  }
  if (identifiers !== undefined && !isStringList(identifiers)) {
    throw invalidSettings("identifiers", "a list of function names");
  }
  return { featureFlags: featureFlags === undefined ? undefined : definitions, identifiers };
};

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string");

/** The flags and flag readers a rule works with: its own options, then the shared settings. */
export const readFlagOptions = (context: Rule.RuleContext): FlagOptions => {
  const options = ruleOptions<FlagOptions>(context);
  const settings = parseSettings(context.settings[SETTINGS_KEY]);
  return {
    featureFlags: options.featureFlags ?? settings.featureFlags ?? {},
    identifiers: options.identifiers ?? settings.identifiers ?? DEFAULT_IDENTIFIERS,
  };
};
