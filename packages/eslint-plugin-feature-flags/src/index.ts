import type { ESLint, Linter } from "eslint";

import pkg from "../package.json" with { type: "json" };
import cleanupFeatureFlag from "./rules/cleanup-feature-flag";
import expiredFeatureFlag from "./rules/expired-feature-flag";
import noUndefinedFeatureFlags from "./rules/no-undefined-feature-flags";

const plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules: {
    "expired-feature-flag": expiredFeatureFlag,
    "no-undefined-feature-flags": noUndefinedFeatureFlags,
    "cleanup-feature-flag": cleanupFeatureFlag,
  },
} satisfies ESLint.Plugin;

/** The two checks that need only the flag list. Declare the flags once, in `settings`. */
const recommended: Linter.Config = {
  name: "feature-flags/recommended",
  plugins: { "feature-flags": plugin },
  rules: {
    "feature-flags/expired-feature-flag": "error",
    "feature-flags/no-undefined-feature-flags": "error",
  },
};

const featureFlags: ESLint.Plugin & { configs: { recommended: Linter.Config } } = {
  ...plugin,
  configs: { recommended },
};

export default featureFlags;
