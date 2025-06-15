# Expired Feature Flag Example

This example demonstrates the `expired-feature-flag` rule which detects usage of feature flags that have passed their expiration date.

## Current Date Context

The examples assume the current date is **June 15, 2025**.

## Flag Configuration

- `enable-ui-v1`: Expired on January 1, 2025 (should trigger error)
- `enable-beta-feature`: Expires on December 31, 2025 (should not trigger error)
- `enable-dark-mode`: Expires on June 30, 2026 (should not trigger error)
- `enable-analytics`: Expires on January 15, 2026 (should not trigger error)

## Code Patterns Tested

The example includes various ways of using feature flags:
- If statements
- Variable assignments
- Ternary expressions
- Logical expressions (&&, ||)

## Running the Example

```bash
# Run ESLint to see errors for expired flags
npx eslint test.ts
```

## Expected Results

All references to the expired flag `enable-ui-v1` should be flagged as errors with a message indicating the expiration date, while references to non-expired flags should pass validation.
