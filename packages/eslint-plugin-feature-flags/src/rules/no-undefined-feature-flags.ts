import type { Rule } from "eslint";

import { flagReadBy } from "../flag-calls";
import { isDefined } from "../flags";
import { flagOptionsSchema, readFlagOptions } from "../options";

/** Reports a flag read, such as `isEnabled("new-chekout")`, that the config does not declare. */
const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Report feature flags that the config does not declare" },
    schema: [{ type: "object", properties: flagOptionsSchema, additionalProperties: false }],
    messages: {
      undefinedFeatureFlag: 'Feature flag "{{name}}" is not declared in the ESLint config.',
    },
  },
  create(context) {
    const { featureFlags, identifiers } = readFlagOptions(context);
    return {
      CallExpression(node) {
        const name = flagReadBy(node, identifiers);
        if (name === undefined || isDefined(featureFlags, name)) return;
        context.report({ node, messageId: "undefinedFeatureFlag", data: { name } });
      },
    };
  },
};

export default rule;
