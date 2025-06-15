# Cleanup Feature Flag Tests

Simple test cases for the `cleanup-feature-flag` ESLint rule.

## Test Cases

- **Basic**: Simple test cases covering all cleanup strategies
- **Multi-File**: Tests for flag cleanup across multiple files

## Running Tests

```bash
# Run ESLint to see which flags should be cleaned up
npx eslint rules/cleanup-feature-flag/**/*.ts

# Apply automated fixes
npx eslint rules/cleanup-feature-flag/**/*.ts --fix
```
