/** ESLint rule to detect usage of undefined feature flags */
import { FeatureFlagsConfig } from '@eslint-plugin-feature-flags/types';
import { Rule } from 'eslint';


const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Detect usage of undefined feature flags',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: 'code', // This rule provides automated fixes
    schema: [
      {
        type: 'object',
        properties: {
          // Configuration of feature flags (shared with expired-feature-flag rule)
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
      undefinedFeatureFlag:
        'Feature flag "{{name}}" is not defined in the ESLint configuration.',
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
     * Create a set of defined flag names for quick lookup
     */
    const definedFlags = new Set(Object.keys(featureFlags));
    
  
    /**
     * Reports a violation when an undefined flag is found
     */
    const reportUndefinedFlag = (node: Rule.Node, flagName: string) => {      
      // Skip if the flag is defined
      if (definedFlags.has(flagName)) return;

      // Base report data
      const report: Rule.ReportDescriptor = {
        node,
        messageId: 'undefinedFeatureFlag',
        data: {
          name: flagName,
        }
      };

      // Report the error
      context.report(report);
    };

    return {
      /**
       * Checks feature flag access functions
       * Example: getFeatureFlag('undefined-flag')
       */
      CallExpression(node) {
        // Check for feature flag function calls with string literal arguments
        if (
          node.callee.type === 'Identifier' &&
          identifiers.includes(node.callee.name) &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'Literal' &&
          typeof node.arguments[0].value === 'string'
        ) {
          reportUndefinedFlag(node, node.arguments[0].value);
        }
      },
    };
  },
};

/**
 * Export the rule so it can be used by ESLint
 */
export default rule;
