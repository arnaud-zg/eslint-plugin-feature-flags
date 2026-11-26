// ESLint plugin for feature flag management
import { configs } from "./configs";
import cleanupFeatureFlagRule from "./rules/cleanup-feature-flag";
import expiredFeatureFlagRule from "./rules/expired-feature-flag";
import noUndefinedFeatureFlagsRule from "./rules/no-undefined-feature-flags";

export default {
  rules: {
    "expired-feature-flag": expiredFeatureFlagRule,
    "no-undefined-feature-flags": noUndefinedFeatureFlagsRule,
    "cleanup-feature-flag": cleanupFeatureFlagRule,
  },
  configs,
};
