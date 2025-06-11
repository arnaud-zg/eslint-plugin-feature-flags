/** ESLint Plugin for Feature Flag Management */
import expiredFeatureFlagRule from './rules/expired-feature-flag';
import noUndefinedFeatureFlagsRule from './rules/no-undefined-feature-flags';
import { configs } from './configs';


export default {
  rules: {
    'expired-feature-flag': expiredFeatureFlagRule,
    'no-undefined-feature-flags': noUndefinedFeatureFlagsRule,
  },
  configs,
};
