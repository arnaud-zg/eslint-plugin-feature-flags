# ESLint Plugin Feature Flags Example

This folder contains examples demonstrating the usage of the `eslint-plugin-feature-flags` plugin.

## Files

- `feature-flags.ts` - TypeScript helper functions for accessing feature flags
- `success-example.ts` - TypeScript example with non-expired feature flags (no ESLint errors)
- `error-example.ts` - TypeScript example with expired feature flags (ESLint should report errors)
- `mixed-example.js` - JavaScript example with mixed valid and expired feature flags
- `eslint.config.js` - ESLint configuration for testing the plugin
- `package.json` - Project configuration

## Feature Flags Configuration

The ESLint configuration includes the following feature flags:

| Flag Name | Expiration Date | Current Status |
|-----------|----------------|---------------|
| new-homepage | 2106-12-31 | Active ✅ |
| dark-mode | 2106-06-30 | Active ✅ |  
| legacy-feature | 2023-01-01 | Expired ❌ |
| experimental-search | 2106-01-01 | Active ✅ |

## Running the Example

First, ensure the plugin is built:

```bash
cd ../..
pnpm build
```

Then run ESLint on the example files:

```bash
cd examples/test-project
npx eslint .
```

## Example Output

When running ESLint on the example files, you should see output similar to this:

```sh
/eslint-plugin-feature-flags/examples/test-project/error-example.ts
  12:26  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  12:41  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  15:7   error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  15:24  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  21:5   error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  25:22  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  25:29  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag

/eslint-plugin-feature-flags/examples/test-project/mixed-example.js
  9:3   error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  14:23  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag

/eslint-plugin-feature-flags/examples/test-project/eslint.config.js
  31:13  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag

/eslint-plugin-feature-flags/examples/test-project/feature-flags.ts
  13:3  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag

✖ 11 problems (11 errors, 0 warnings)
```

Notice that ESLint correctly identifies all instances of the expired `legacy-feature` flag, including:
- Usage in function calls in `error-example.ts` and `mixed-example.js`
- Object property definitions and accesses
- The flag definition in `feature-flags.ts`
- Even the flag configuration in `eslint.config.js`

However, no errors are reported for the non-expired flags in `success-example.ts`, demonstrating that the plugin correctly distinguishes between expired and active feature flags in both TypeScript and JavaScript files.
