# No Undefined Feature Flags Example

This example demonstrates the `no-undefined-feature-flags` rule which ensures that all feature flags used in your code are defined in your configuration.

## What This Rule Checks

The rule will report an error when:
- A feature flag name is used that isn't defined in your configuration
- A typo is made in a feature flag name
- A feature flag is referenced that may have been removed from the configuration

## Code Patterns Tested

The example includes various code patterns that use undefined feature flags:
- If statements
- Variable assignments
- Ternary expressions
- Logical expressions (&&, ||)

## Running the Example

```bash
# Run ESLint to see errors for undefined flags
npx eslint test.ts
```

## Expected Results

All references to undefined feature flags (like `enable-non-existent-feature`, `enable-unknown-feature`, etc.) should be flagged as errors, while references to properly defined flags (like `enable-ui-v1`) should pass.
