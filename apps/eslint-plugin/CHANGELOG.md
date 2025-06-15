# eslint-plugin-feature-flags

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
