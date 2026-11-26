import type { Rule } from "eslint";
import type { JSONSchema4 } from "json-schema";

import type { FlagDefinitions } from "./flags";

/** What the rules know about the project's flags. */
export interface FlagOptions {
  featureFlags: FlagDefinitions;
  /** The functions that read a flag, such as `isEnabled` in `isEnabled("new-checkout")`. */
  identifiers: string[];
}

const DEFAULT_IDENTIFIERS = ["getFeatureFlag"];

/** The schema of the options every rule shares. */
export const flagOptionsSchema = {
  featureFlags: {
    type: "object",
    additionalProperties: {
      type: "object",
      properties: {
        expires: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
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
export const ruleOptions = (context: Rule.RuleContext): Partial<FlagOptions> => {
  const options: unknown = context.options[0];
  return isRecord(options) ? options : {};
};

/** The flags and flag readers a rule works with, defaults filled in. */
export const readFlagOptions = (context: Rule.RuleContext): FlagOptions => {
  const options = ruleOptions(context);
  return {
    featureFlags: options.featureFlags ?? {},
    identifiers: options.identifiers ?? DEFAULT_IDENTIFIERS,
  };
};
