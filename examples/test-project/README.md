# ESLint Feature Flags Test Project

This project demonstrates how to use the `eslint-plugin-feature-flags` rules with practical examples that you can run and modify.

## Example Rules

1. **cleanup-feature-flag**
   - Demonstrates automatic cleanup of feature flags with different strategies
   - Shows before/after code transformations
   - Supports if/else, ternary, and logical expressions

2. **expired-feature-flag**
   - Detects feature flags that have passed their expiration date
   - Uses current date (June 15, 2025) for validation
   - Shows errors for expired flags in various contexts

3. **no-undefined-feature-flags**
   - Prevents typos and references to undefined feature flags
   - Validates all feature flag references against configuration
   - Shows errors for missing or misspelled flags

## Project Structure

```
rules/
  ├── cleanup-feature-flag/       # Cleanup strategy examples
  │   └── basic/                  # Basic examples with all strategies
  ├── expired-feature-flag/       # Expired flag detection examples
  │   └── basic/                  # Examples of expired and valid flags
  └── no-undefined-feature-flags/ # Undefined flag detection examples
      └── basic/                  # Examples of defined and undefined flags
      
shared/
  ├── feature-flags.ts           # Feature flag accessor functions
  └── feature-flags.init.ts      # Feature flag definitions and configuration
```

## Running the Examples

```bash
# Run a specific rule example
npx eslint rules/cleanup-feature-flag/basic/test.ts

# Run all rule examples
npx eslint rules/**/*.ts

# Apply automatic fixes (especially useful for cleanup rule)
npx eslint rules/cleanup-feature-flag/basic/test.ts --fix
```

## Feature Flags Configuration

| Flag Name | Expiration | Status | Cleanup Strategy |
|-----------|------------|--------|-----------------|
| enable-ui-v1 | 2025-01-01 | Expired | preserve-enabled-path |
| enable-beta-feature | 2025-12-31 | Active | preserve-disabled-path |
| enable-dark-mode | 2026-06-30 | Active | remove-entirely |
| enable-analytics | 2026-01-15 | Active | - |

