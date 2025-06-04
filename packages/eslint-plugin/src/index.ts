/**
 * ESLint Plugin for Feature Flag Management
 * 
 * This plugin provides rules to help teams maintain clean code by:
 * - Detecting expired feature flags that should be removed
 * - Ensuring proper test coverage for feature flags
 * - Restricting feature flag usage to approved patterns
 * 
 * @see https://github.com/your-username/eslint-plugin-feature-flags
 */
import expiredFeatureFlagRule from './rules/expired-feature-flag.js';

/**
 * Export the plugin with all available rules and configs
 */
export default {
  // Individual rules that can be configured
  rules: {
    'expired-feature-flag': expiredFeatureFlagRule,
  },
  
  // Pre-configured settings for common use cases
  configs: {
    // Recommended configuration - catches the most important issues
    recommended: {
      plugins: ['feature-flags'],
      rules: {
        'feature-flags/expired-feature-flag': 'error',
      },
    },
    
    // Strict configuration - enforces all best practices
    strict: {
      plugins: ['feature-flags'],
      rules: {
        'feature-flags/expired-feature-flag': 'error',
        // Future rules would be included here with stricter settings
      },
    },
    
    // Base configuration with warnings instead of errors
    base: {
      plugins: ['feature-flags'],
      rules: {
        'feature-flags/expired-feature-flag': 'warn',
      },
    },
  },
};
