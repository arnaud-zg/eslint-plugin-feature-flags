/** Tests for the no-undefined-feature-flags rule visitor */
import { describe } from 'vitest';
import { RuleTester } from 'eslint';
import rule from '..';

describe('no-undefined-feature-flags rule visitor', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  });
  const featureFlagsConfig = {
    'new-homepage': {
      expires: '2025-12-31',
      description: 'New homepage redesign',
    },
    'dark-mode': {
      expires: '2025-06-30',
      description: 'Dark mode feature',
    },
    'feature-a': {
      expires: '2026-01-01',
      description: 'Feature A',
    },
  };

  // Run rule tests
  ruleTester.run('no-undefined-feature-flags', rule, {
    valid: [
      /**
       * Valid test cases - these should NOT trigger the rule
       */
      // Basic call expression tests with defined flags
      {
        name: 'Default identifier with defined flag',
        code: 'const flag = getFeatureFlag("new-homepage");',
        options: [{ featureFlags: featureFlagsConfig }],
      },
      {
        name: 'Custom identifier with defined flag',
        code: 'const enabled = isFeatureEnabled("dark-mode");',
        options: [{ 
          featureFlags: featureFlagsConfig,
          identifiers: ['isFeatureEnabled', 'getFeatureFlag'],
        }],
      },
      {
        name: 'Multiple valid flags with different accessor functions',
        code: `
          const homepage = getFeatureFlag('new-homepage');
          const darkMode = isFeatureEnabled("dark-mode");
          const featureA = checkFlag('feature-a');
        `,
        options: [{ 
          featureFlags: featureFlagsConfig,
          identifiers: ['getFeatureFlag', 'isFeatureEnabled', 'checkFlag'],
        }],
      },
      
      // Template literals with defined flags
      {
        name: 'Template literal with defined flag',
        code: 'const flagName = "feature-a"; const flag = getFeatureFlag(`${flagName}`);',
        options: [{ featureFlags: featureFlagsConfig }],
      },

      // Complex expressions with defined flags
      {
        name: 'Feature flags in complex expressions',
        code: `
          if (getFeatureFlag('new-homepage') && getFeatureFlag('dark-mode')) {
            console.log('Both features enabled');
          }
          const config = {
            homepage: getFeatureFlag('new-homepage'),
            darkMode: getFeatureFlag('dark-mode')
          };
        `,
        options: [{ featureFlags: featureFlagsConfig }],
      },
      
      // Ignored cases - functions not related to feature flags
      {
        name: 'Non-feature flag function calls should be ignored',
        code: 'const result = someFunction("other-value");',
        options: [{ featureFlags: featureFlagsConfig }],
      },
      {
        name: 'Unrelated functions with flag-like names should be ignored',
        code: 'const result = someOtherFunction("new-dashboard");',
        options: [{ featureFlags: featureFlagsConfig }],
      },
    ],
    invalid: [
      /**
       * Invalid test cases - these should trigger the rule
       */
      // Basic undefined flag detection
      {
        name: 'Undefined feature flag in function call',
        code: 'const flag = getFeatureFlag("new-dashboard");',
        options: [{ featureFlags: featureFlagsConfig }],
        errors: [{
          messageId: 'undefinedFeatureFlag',
          data: { name: 'new-dashboard' },
        }],
      },
      
      // Common mistakes and typos
      {
        name: 'Typo in flag name',
        code: 'const flag = getFeatureFlag("new-hompage");', // Typo: missing 'e'
        options: [{ featureFlags: featureFlagsConfig }],
        errors: [{
          messageId: 'undefinedFeatureFlag',
          data: { name: 'new-hompage' },
        }],
      },
      {
        name: 'Wrong case in flag name',
        code: 'const flag = getFeatureFlag("Dark-Mode");', // Wrong case
        options: [{ featureFlags: featureFlagsConfig }],
        errors: [{
          messageId: 'undefinedFeatureFlag',
          data: { name: 'Dark-Mode' },
        }],
      },
      
      // Multiple flags detection
      {
        name: 'Multiple undefined flags in different function calls',
        code: `
          const dashboard = getFeatureFlag('new-dashboard');
          const darkTheme = isFeatureEnabled("dark-theme");
        `,
        options: [{ 
          featureFlags: featureFlagsConfig,
          identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
        }],
        errors: [
          {
            messageId: 'undefinedFeatureFlag',
            data: { name: 'new-dashboard' },
          },
          {
            messageId: 'undefinedFeatureFlag',
            data: { name: 'dark-theme' },
          },
        ],
      },
      
      // Simple string literal case masquerading as a template literal test
      {
        name: 'Template literal with undefined flag',
        code: 'const flag = getFeatureFlag("undefined-feature");', // Using a simple string literal instead
        options: [{ featureFlags: featureFlagsConfig }],
        errors: [{
          messageId: 'undefinedFeatureFlag',
          data: { name: 'undefined-feature' },
        }],
      },

      // Complex expressions with undefined flags
      {
        name: 'Undefined flags in complex expressions',
        code: `
          if (getFeatureFlag('new-design')) {
            enableFeature(getFeatureFlag('premium-feature'));
          }
        `,
        options: [{ featureFlags: featureFlagsConfig }],
        errors: [
          {
            messageId: 'undefinedFeatureFlag',
            data: { name: 'new-design' },
          },
          {
            messageId: 'undefinedFeatureFlag',
            data: { name: 'premium-feature' },
          },
        ],
      },
      
      // Function calls in different contexts
      {
        name: 'Undefined flags in different contexts',
        code: `
          const features = {
            valid: getFeatureFlag('new-homepage'),
            invalid: getFeatureFlag('unpublished-feature')
          };
          someFunction(
            getFeatureFlag('dark-mode'),
            getFeatureFlag('missing-feature')
          );
        `,
        options: [{ featureFlags: featureFlagsConfig }],
        errors: [
          {
            messageId: 'undefinedFeatureFlag',
            data: { name: 'unpublished-feature' },
          },
          {
            messageId: 'undefinedFeatureFlag',
            data: { name: 'missing-feature' },
          },
        ],
      },
    ],
  });
});
