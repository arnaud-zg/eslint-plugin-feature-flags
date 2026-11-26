import type { Rule } from "eslint";
import type { Node } from "estree";

import { stringValue } from "../flag-calls";
import { isExpired } from "../flags";
import { flagOptionsSchema, readFlagOptions } from "../options";

/** Reports every mention of a flag past its `expires` date: strings, keys and property reads. */
const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: { description: "Report feature flags used after their expiry date" },
    schema: [{ type: "object", properties: flagOptionsSchema, additionalProperties: false }],
    messages: {
      expiredFeatureFlag: 'Feature flag "{{name}}" expired on {{expires}}. Remove it.',
    },
  },
  create(context) {
    const { featureFlags } = readFlagOptions(context);
    const today = new Date();

    const check = (node: Node, name: string | undefined) => {
      const definition = name === undefined ? undefined : featureFlags[name];
      if (definition === undefined || !isExpired(definition, today)) return;
      context.report({
        node,
        messageId: "expiredFeatureFlag",
        data: { name, expires: definition.expires },
      });
    };

    return {
      Literal: (node) => check(node, stringValue(node)),
      TemplateLiteral: (node) => check(node, stringValue(node)),
      MemberExpression: (node) => {
        if (!node.computed && node.property.type === "Identifier") {
          check(node.property, node.property.name);
        }
      },
      Property: (node) => {
        if (!node.computed && node.key.type === "Identifier") check(node.key, node.key.name);
      },
    };
  },
};

export default rule;
