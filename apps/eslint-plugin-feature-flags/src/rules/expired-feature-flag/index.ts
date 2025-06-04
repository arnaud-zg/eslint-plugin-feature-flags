/**
 * ESLint rule to detect and report usage of expired feature flags
 *
 * This rule helps teams maintain clean code by identifying and removing
 * code related to feature flags that have passed their expiration date.
 */
import { FeatureFlagsConfig, FeatureFlag } from '@eslint-plugin-feature-flags/types';
import { formatExpirationDate, isExpired } from '@eslint-plugin-feature-flags/expiration-utils';
import { Rule } from 'eslint';

/**
 * The ESLint rule definition
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect usage of expired feature flags',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [
      {
        type: 'object',
        properties: {
          // Configuration of feature flags with their expiration dates
          featureFlags: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                expires: { type: 'string' }, // Date in YYYY-MM-DD format
                description: { type: 'string' },
              },
              required: ['expires'],
              additionalProperties: false,
            },
          },
          // Names of functions that access feature flags (e.g., getFeatureFlag)
          identifiers: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        required: ['featureFlags'],
        additionalProperties: false,
      },
    ],
    messages: {
      expiredFeatureFlag:
        'Feature flag "{{name}}" has expired on {{expirationDate}}. It should be removed.',
    },
  },
  create(context) {
    /**
     * Extract and normalize rule options
     */
    const options = context.options[0] || {};
    const featureFlags: FeatureFlagsConfig = options.featureFlags || {};

    // Functions that are used to access feature flags (e.g., getFeatureFlag, isFeatureEnabled)
    const identifiers: string[] = options.identifiers || ['getFeatureFlag'];

    /**
     * Create a map of expired flags for quick lookup
     * Key: flag name, Value: expiration date string
     */
    const expiredFlags = Object.entries(featureFlags).reduce<Record<string, string>>(
      (acc, [flagName, flagConfig]) => {
        const flag: FeatureFlag = {
          name: flagName,
          description: flagConfig.description || '',
          defaultValue: false,
          expiresOn: flagConfig.expires,
        };

        // Only add flags that have expired
        if (isExpired(flag)) {
          acc[flagName] = flagConfig.expires;
        }
        return acc;
      },
      {}
    );

    /**
     * Reports a violation when an expired flag is found
     */
    const reportExpiredFlag = (node: Rule.Node, flagName: string) => {
      if (!expiredFlags[flagName]) return;

      context.report({
        node,
        messageId: 'expiredFeatureFlag',
        data: {
          name: flagName,
          expirationDate: formatExpirationDate(expiredFlags[flagName]),
        },
      });
    };

    return {
      /**
       * Checks string literals that might directly reference feature flags
       * Example: 'legacy-ui' in const flag = 'legacy-ui';
       */
      Literal(node) {
        if (typeof node.value === 'string') {
          reportExpiredFlag(node, node.value);
        }
      },

      /**
       * Checks feature flag access functions
       * Example: getFeatureFlag('legacy-ui')
       */
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          identifiers.includes(node.callee.name) &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          typeof node.arguments[0].value === 'string'
        ) {
          reportExpiredFlag(node, node.arguments[0].value);
        }
      },

      /**
       * Checks object property access that might reference feature flags
       * Examples:
       * - flags.legacyUI (dot notation)
       * - flags['legacy-ui'] (bracket notation)
       */
      MemberExpression(node) {
        // Check property access with dot notation (obj.prop)
        if (node.property.type === 'Identifier') {
          reportExpiredFlag(node, node.property.name);
        }
        // Check property access with bracket notation (obj['prop'])
        else if (node.property.type === 'Literal' && typeof node.property.value === 'string') {
          reportExpiredFlag(node, node.property.value);
        }
      },
    };
  },
};

/**
 * Export the rule so it can be used by ESLint
 */
export default rule;
