# 🚩 eslint-plugin-feature-flags

ESLint rules for feature flag hygiene: flags past their expiry date, flags missing from your config,
and an autofix that removes a flag once it is settled.

```sh
npm install --save-dev eslint-plugin-feature-flags
```

Needs ESLint 9 or 10 and a flat config (`eslint.config.js`).

## Quick start

Declare your flags once, in `settings`, and turn on the recommended rules:

```js
// eslint.config.js
import featureFlags from "eslint-plugin-feature-flags";

export default [
  featureFlags.configs.recommended,
  {
    settings: {
      "feature-flags": {
        featureFlags: {
          "new-checkout": { expires: "2026-12-31", description: "Checkout redesign" },
          "kill-switch-payments": { description: "Permanent: no expires" },
        },
        // The functions your code reads a flag with.
        identifiers: ["isEnabled"],
      },
    },
  },
];
```

```js
if (isEnabled("new-checkout")) {
  // ❌ after 2026-12-31: Feature flag "new-checkout" expired on 2026-12-31. Remove it.
}

if (isEnabled("new-chekout")) {
  // ❌ Feature flag "new-chekout" is not declared in the ESLint config.
}
```

## Settings

| Key            | Type                                     | Default              |
| -------------- | ---------------------------------------- | -------------------- |
| `featureFlags` | `{ [name]: { expires?, description? } }` | `{}`                 |
| `identifiers`  | `string[]`                               | `["getFeatureFlag"]` |

- `expires` is the last day the flag may live, as `YYYY-MM-DD`. The flag is reported from the next
  day, in local time. Leave it out for a permanent flag.
- A flag is read by a call to one of `identifiers` with a string: `isEnabled("x")`,
  `flags.isEnabled("x")` or ``isEnabled(`x`)``.
- Every rule also takes `featureFlags` and `identifiers` as its own options, which win over the
  settings.

## Rules

`configs.recommended` turns on the first two as errors.

| Rule                         | Reports                                     | Fix |
| ---------------------------- | ------------------------------------------- | --- |
| `expired-feature-flag`       | every mention of a flag past `expires`      |     |
| `no-undefined-feature-flags` | a flag read that `featureFlags` lacks       |     |
| `cleanup-feature-flag`       | a read of a flag listed in `flagsToCleanup` | ✅  |

### expired-feature-flag

Reports each mention of an expired flag: a string such as `isEnabled("x")` or `track("x")`, an
object key, or a property read such as `flags.x`. Removing every mention removes the flag.

### no-undefined-feature-flags

Reports a call to one of `identifiers` whose flag is not in `featureFlags`. A name only known at
runtime, such as `isEnabled(name)`, is not checked.

### cleanup-feature-flag

Once a flag is settled, say which way, and run `eslint --fix`:

```js
{
  rules: {
    "feature-flags/cleanup-feature-flag": [
      "warn",
      {
        flagsToCleanup: {
          "new-checkout": "preserve-enabled-path", // shipped: the flag reads true
          "old-search": "preserve-disabled-path", // dropped: the flag reads false
        },
      },
    ],
  },
}
```

The flag's reads become `true` or `false`, and the code around them keeps only what that value runs:

| Before                                       | `preserve-enabled-path` | `preserve-disabled-path` |
| -------------------------------------------- | ----------------------- | ------------------------ |
| `if (isEnabled("x")) { a(); } else { b(); }` | `a();`                  | `b();`                   |
| `if (isEnabled("x")) { a(); }`               | `a();`                  | removed                  |
| `isEnabled("x") ? a : b`                     | `a`                     | `b`                      |
| `isEnabled("x") && a()` as a statement       | `a()`                   | removed                  |
| `const show = isEnabled("x") && canSee()`    | `canSee()`              | `false`                  |
| `const theme = isEnabled("x") \|\| "light"`  | `true`                  | `"light"`                |
| `!isEnabled("x")`, `track(isEnabled("x"))`   | `false`, `track(true)`  | `true`, `track(false)`   |

A kept block joins the code around it with its comments, unless it declares `let`, `const`, `class`
or `function`: then its braces stay. `remove-entirely` is another name for `preserve-disabled-path`.

Then delete the flag from `featureFlags` and from your flag provider.
