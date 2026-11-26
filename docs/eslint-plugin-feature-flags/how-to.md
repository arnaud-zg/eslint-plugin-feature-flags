[🏠 Home](../../README.md) · [📚 Docs](../README.md) · `eslint-plugin-feature-flags`:
[🚀 Tutorial](./tutorial.md) · **🛠️ How-to** · [📖 Reference](./reference.md) ·
[💡 Explanation](./explanation.md)

# 🛠️ How-to guides: `eslint-plugin-feature-flags`

Short recipes, one task each. Every setting they use is in the [Reference](./reference.md).

- [Read flags through your own function](#read-flags-through-your-own-function)
- [Lint TypeScript files](#lint-typescript-files)
- [Keep a flag with no end date](#keep-a-flag-with-no-end-date)
- [Give one rule its own flag list](#give-one-rule-its-own-flag-list)
- [Report expired flags as warnings](#report-expired-flags-as-warnings)
- [Remove a settled flag](#remove-a-settled-flag)

## Read flags through your own function

List every function your code reads a flag with in `identifiers`:

```js
settings: {
  "feature-flags": {
    featureFlags: { "new-checkout": { expires: "2026-12-31" } },
    identifiers: ["isEnabled", "useFlag"],
  },
},
```

A call reads a flag when it names one of them, directly or as a method: `isEnabled("x")`,
`flags.useFlag("x")`. Without `identifiers`, the rules read `getFeatureFlag("x")`.

## Lint TypeScript files

Give the files typescript-eslint's parser; the rules need nothing else:

```js
import tsParser from "@typescript-eslint/parser";
import featureFlags from "eslint-plugin-feature-flags";

export default [
  featureFlags.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: { parser: tsParser },
    settings: { "feature-flags": { featureFlags: {}, identifiers: ["isEnabled"] } },
  },
];
```

`src/plugin.test.ts` ("reads TypeScript through typescript-eslint's parser") runs this setup.

## Keep a flag with no end date

Leave `expires` out. A kill switch or an operations toggle stays declared, so
`no-undefined-feature-flags` still checks its name, and `expired-feature-flag` never reports it:

```js
featureFlags: {
  "kill-switch-payments": { description: "Permanent: no expires" },
},
```

## Give one rule its own flag list

Pass `featureFlags` or `identifiers` as the rule's options. They win over `settings` for that rule
only:

```js
rules: {
  "feature-flags/no-undefined-feature-flags": [
    "error",
    { featureFlags: { "dark-mode": {} }, identifiers: ["isEnabled"] },
  ],
},
```

## Report expired flags as warnings

Lower the rule's severity after `configs.recommended`, so the build passes while you plan the
removal:

```js
export default [
  featureFlags.configs.recommended,
  { rules: { "feature-flags/expired-feature-flag": "warn" } },
];
```

## Remove a settled flag

1. Say which way the flag settled, as
   [examples/cleanup.config.js](../../packages/eslint-plugin-feature-flags/examples/cleanup.config.js)
   does: `preserve-enabled-path` when it shipped, `preserve-disabled-path` when it was dropped.
2. Run `npx eslint -c cleanup.config.js --fix .`.
3. Delete the imports the removed branch used, if your other rules report them unused.
4. Delete the flag from `featureFlags`, from `flagsToCleanup`, and from your flag provider.

[examples/app.cleaned.js](../../packages/eslint-plugin-feature-flags/examples/app.cleaned.js) is
what step 2 makes of [examples/app.js](../../packages/eslint-plugin-feature-flags/examples/app.js).
