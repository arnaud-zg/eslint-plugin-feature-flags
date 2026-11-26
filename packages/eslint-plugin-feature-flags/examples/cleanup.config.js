// The checkout redesign shipped: remove the flag and keep the code it turned on.
import config from "./eslint.config.js";

export default [
  ...config,
  {
    rules: {
      "feature-flags/cleanup-feature-flag": [
        "error",
        { flagsToCleanup: { "new-checkout": "preserve-enabled-path" } },
      ],
    },
  },
];
