// The flags are declared once, in settings; the recommended config reads them.
import featureFlags from "eslint-plugin-feature-flags";

export default [
  featureFlags.configs.recommended,
  {
    settings: {
      "feature-flags": {
        featureFlags: {
          "new-checkout": { expires: "2026-01-31", description: "Checkout redesign" },
          "new-search": { expires: "2099-12-31", description: "Search rewrite" },
          "kill-switch-payments": { description: "Permanent: no expires" },
        },
        identifiers: ["isEnabled"],
      },
    },
  },
];
