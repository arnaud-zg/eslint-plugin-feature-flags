import type { Rule } from "eslint";

import { flagReadBy } from "../flag-calls";
import { foldFlag } from "../fold-flag";
import { flagOptionsSchema, readFlagOptions, ruleOptions } from "../options";

/** What each settled flag becomes. `remove-entirely` is the old name for turning it off. */
const VALUE_OF = {
  "preserve-enabled-path": true,
  "preserve-disabled-path": false,
  "remove-entirely": false,
} as const satisfies Record<string, boolean>;

type Strategy = keyof typeof VALUE_OF;

interface CleanupOptions {
  flagsToCleanup: Record<string, Strategy>;
}

/** Removes a settled flag: its reads become `true` or `false`, and the dead branch goes. */
const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: { description: "Remove a settled feature flag, keeping the code its final value runs" },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          ...flagOptionsSchema,
          flagsToCleanup: {
            type: "object",
            additionalProperties: { enum: Object.keys(VALUE_OF) },
          },
        },
        required: ["flagsToCleanup"],
        additionalProperties: false,
      },
    ],
    messages: {
      cleanupFeatureFlag: 'Feature flag "{{name}}" is settled ({{strategy}}): remove it.',
    },
  },
  create(context) {
    const { identifiers } = readFlagOptions(context);
    const { flagsToCleanup = {} } = ruleOptions<CleanupOptions>(context);
    return {
      CallExpression(node) {
        const name = flagReadBy(node, identifiers);
        const strategy = name === undefined ? undefined : flagsToCleanup[name];
        if (strategy === undefined) return;
        context.report({
          node,
          messageId: "cleanupFeatureFlag",
          data: { name, strategy },
          fix: (fixer) =>
            foldFlag({ sourceCode: context.sourceCode, fixer }, node, VALUE_OF[strategy]),
        });
      },
    };
  },
};

export default rule;
