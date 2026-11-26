// ESLint plugin for feature flag management
import expiredFeatureFlagRule from './rules/expired-feature-flag';
import noUndefinedFeatureFlagsRule from './rules/no-undefined-feature-flags';
import cleanupFeatureFlagRule from './rules/cleanup-feature-flag';
import { configs } from './configs';

export default {
  rules: {
    'expired-feature-flag': expiredFeatureFlagRule,
    'no-undefined-feature-flags': noUndefinedFeatureFlagsRule,
    'cleanup-feature-flag': cleanupFeatureFlagRule,
  },
  configs,
};
