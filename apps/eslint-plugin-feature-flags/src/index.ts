/**
 * ESLint Plugin for Feature Flag Management
 *
 * @see https://github.com/your-username/eslint-plugin-feature-flags
 */
import expiredFeatureFlagRule from './rules/expired-feature-flag';
import { configs } from './configs';

/**
 * Export the plugin with all available rules and configs
 */
export default {
  rules: {
    'expired-feature-flag': expiredFeatureFlagRule,
  },
  configs,
};
