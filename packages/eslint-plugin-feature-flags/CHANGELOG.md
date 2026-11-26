# eslint-plugin-feature-flags

## 0.2.1

### Patch Changes

- [#21](https://github.com/arnaud-zg/eslint-plugin-feature-flags/pull/21) [`8a1d2ed`](https://github.com/arnaud-zg/eslint-plugin-feature-flags/commit/8a1d2ed0559f8865cb5b6953576c46fbd42ac60e) - The README opens with what ESLint reports and links the new tutorial, how-to, reference and
  explanation pages.

## 0.2.0

### Minor Changes

- [#14](https://github.com/arnaud-zg/eslint-plugin-feature-flags/pull/14) [`947ac89`](https://github.com/arnaud-zg/eslint-plugin-feature-flags/commit/947ac89abfa50f03ee481578de107ef579ebaccf) - `cleanup-feature-flag` treats a settled flag as the constant it became, and keeps only the code that
  value runs.
  
  - `preserve-enabled-path` reads the flag as `true`, `preserve-disabled-path` as `false`.
    `remove-entirely` is kept as another name for `preserve-disabled-path`: it used to delete the
    `else` branch too, which still runs once the flag is off.
  - `if`/`else`, `else if`, `? :`, `&&`, `||` and `!flag` are folded; any other read becomes `true` or
    `false`. It no longer guesses values from variable names (a `theme` variable became `'light'`).
  - A branch is spread into the enclosing code at the right indentation, with its comments, unless it
    declares block-scoped names; parentheses that keep precedence stay.
  - The rule reads `identifiers` from `settings["feature-flags"]` like the other rules.
  - The plugin has no runtime dependency anymore.

- [#13](https://github.com/arnaud-zg/eslint-plugin-feature-flags/pull/13) [`af9d185`](https://github.com/arnaud-zg/eslint-plugin-feature-flags/commit/af9d1853d8df2c38db905f674329f28b8c430f5c) - Declare your flags once and use `configs.recommended` as a flat config.
  
  ```js
  import featureFlags from "eslint-plugin-feature-flags";
  
  export default [
    featureFlags.configs.recommended,
    {
      settings: {
        "feature-flags": {
          featureFlags: { "new-checkout": { expires: "2026-12-31" } },
          identifiers: ["isEnabled"],
        },
      },
    },
  ];
  ```
  
  - `configs.recommended` loads in ESLint 9 and 10: it used to name its plugin as a string, which flat
    config rejects.
  - Every rule reads `settings["feature-flags"]`; a rule's own options still win. A setting ESLint
    cannot use, such as an `expires` that is not `YYYY-MM-DD`, fails with an error naming its key.
  - `cleanup-feature-flag` works on ESLint 10: it crashed on the removed `context.getSourceCode()`.
  - Breaking: the `strict` and `base` configs are gone (`strict` was `recommended`), and ESLint 8 is
    no longer supported. The plugin now sets `meta.name` and `meta.version`.

- [#12](https://github.com/arnaud-zg/eslint-plugin-feature-flags/pull/12) [`b0dc79c`](https://github.com/arnaud-zg/eslint-plugin-feature-flags/commit/b0dc79c7d065f34c778d1b6e2afda6a3d470e278) - `expired-feature-flag` and `no-undefined-feature-flags` read flags one way.
  
  - `expired-feature-flag` reports each mention of an expired flag once: `isEnabled("old")` was
    reported twice. The message shows the configured date.
  - A flag without `expires` is permanent: declared, never expired.
  - `expires` must be `YYYY-MM-DD`: a date ESLint cannot read used to silently never expire. A flag
    expires the day after its `expires` date, in local time.
  - Flag readers called as methods, such as `flags.isEnabled("x")`, and template literals such as
    ``isEnabled(`x`)`` are read too.
  - `no-undefined-feature-flags` no longer claims to be fixable: it never fixed anything.

### Patch Changes

- [#9](https://github.com/arnaud-zg/eslint-plugin-feature-flags/pull/9) [`e6a5a0a`](https://github.com/arnaud-zg/eslint-plugin-feature-flags/commit/e6a5a0a4fca33e7ba68c2e706d736d79cbd95936) - Ships as one package: the date and type helpers it used from `@eslint-plugin-feature-flags/core` and
  `@eslint-plugin-feature-flags/types` now live inside it, so installing the plugin pulls no extra
  package.

- [#15](https://github.com/arnaud-zg/eslint-plugin-feature-flags/pull/15) [`bd802a8`](https://github.com/arnaud-zg/eslint-plugin-feature-flags/commit/bd802a8208b5d57a6ff1a3584ffd9be3de32d072) - The README starts from the one config to write: flags declared once in `settings`,
  `configs.recommended`, and a table of what `cleanup-feature-flag` does to each shape of code.

## 0.1.1

### Patch Changes

- ### Business Impact

  - Reduces technical debt by automating the removal of outdated feature flag code.
  - Improves long-term code maintainability and clarity.
  - Provides a ready-to-use example project to accelerate adoption across teams.

  ### Technical Details

  - Added `cleanup-feature-flag` ESLint rule with three strategies:
    - `preserve-enabled-path`
    - `preserve-disabled-path`
    - `remove-entirely`
  - Updated helper functions, test fixtures, and utilities.
  - Created an example project with test cases to demonstrate real-world usage.
  - Refactored related logic for expired and undefined flags.

- Updated dependencies []:
  - @eslint-plugin-feature-flags/core@0.1.1
  - @eslint-plugin-feature-flags/types@0.1.1

## 0.1.0

### Minor Changes

- - Added new rule `no-undefined-feature-flags` to detect usage of feature flags not defined in ESLint configuration
  - Updated README examples to use a shared feature flag configuration
  - Added test cases for no-undefined-feature-flags rule in test project

### Patch Changes

- Updated dependencies []:
  - @eslint-plugin-feature-flags/core@0.1.0
  - @eslint-plugin-feature-flags/types@0.1.0

## 0.0.4

### Patch Changes

- Fix build configuration for ESLint plugin and core packages

- Updated dependencies []:
  - @eslint-plugin-feature-flags/core@0.0.4
  - @eslint-plugin-feature-flags/types@0.0.4

## 0.0.3

### Patch Changes

- Initial release with expired-feature-flag rule and proper ESLint v8-v9 compatibility

- Updated dependencies []:
  - @eslint-plugin-feature-flags/core@0.0.3
  - @eslint-plugin-feature-flags/types@0.0.3
