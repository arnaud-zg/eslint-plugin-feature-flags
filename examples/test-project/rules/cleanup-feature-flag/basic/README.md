# Feature Flag Cleanup Example

This example demonstrates the three cleanup strategies provided by the `cleanup-feature-flag` rule:

## Cleanup Strategies

1. **preserve-enabled-path**: Keeps only the code inside the "if" branch (when flag is true)
   - Applied to `enable-ui-v1` flag

2. **preserve-disabled-path**: Keeps only the code inside the "else" branch (when flag is false)
   - Applied to `enable-beta-feature` flag

3. **remove-entirely**: Removes the entire statement
   - Applied to `enable-dark-mode` flag

## Code Patterns Tested

- If/else statements
- Ternary expressions
- Logical expressions (&&, ||)

## Before & After Examples

The `test.ts` file shows the code before cleanup. To see the after state:

```bash
# Apply the cleanup rules
npx eslint test.ts --fix
```

After running the fix command:
- `enable-ui-v1` checks will be replaced with just the "if" branch code
- `enable-beta-feature` checks will be replaced with just the "else" branch code
- `enable-dark-mode` checks will be removed entirely
