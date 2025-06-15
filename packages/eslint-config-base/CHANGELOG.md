# @eslint-plugin-feature-flags/eslint-config-base

## 0.0.3

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
