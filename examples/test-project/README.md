# Try It Out: Example Project

Want to see the plugin in action? This demo shows how the ESLint rules catch real issues in code.

## What's Inside

Here's what each file demonstrates:

- `feature-flags.helpers.ts` - Simple helper functions to access feature flags
- `feature-flags.init.ts` - How to define and organize your flags
- `success-example.ts` - Clean code with properly used flags (no errors)
- `error-example.ts` - Code using expired flags (you'll see ESLint errors)
- `undefined-flags-example.ts` - Code with typos in flag names (ESLint catches these)
- `mixed-example.js` - Shows how the plugin works in JavaScript files
- `eslint.config.js` - How to configure the plugin
- `package.json` - Project dependencies

## Feature Flags Used

Here are the flags defined in this demo:

| Flag | Expires | Status | Purpose |
|------|---------|--------|---------|
| new-homepage | 2106-12-31 | Active ✅ | New homepage design |
| dark-mode | 2106-06-30 | Active ✅ | Dark theme support | 
| legacy-feature | 2023-01-01 | Expired ❌ | Should be removed! |
| experimental-search | 2106-01-01 | Active ✅ | New search algorithm |

## Run It Yourself

First, make sure the plugin is built:

```bash
cd ../..
pnpm build
```

Now, let's run ESLint to check our example files:

```bash
cd examples/test-project
npx eslint .
```

## What You'll See

The magic happens! You'll get helpful errors like:

```
error-example.ts:12:26
  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed
  12:41  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  15:7   error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  15:24  error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
  21:5   error  Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed  feature-flags/expired-feature-flag
```

### Undefined Feature Flags Errors

```sh
/eslint-plugin-feature-flags/examples/test-project/undefined-flags-example.ts
  11:26  error  Feature flag "new-hompage" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
  14:26  error  Feature flag "beta-feature" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
  17:24  error  Feature flag "dark-mod" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
  20:36  error  Feature flag "Experimental-Search" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
  39:47  error  Feature flag "new-homepage-v2" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
  42:24  error  Feature flag "dark-mode-beta" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
  47:29  error  Feature flag "experimental-searching" is not defined in the ESLint configuration  feature-flags/no-undefined-feature-flags
```
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
