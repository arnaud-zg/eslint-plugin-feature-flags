# 🚀 ESLint Plugin Feature Flags

<p align="center">
  <img src="../../assets/icon.svg" width="128" height="128" alt="ESLint Plugin Feature Flags Logo" />
</p>

<div align="center">
  <b>ESLint plugin for feature flag hygiene and prevent technical debt by automatically detecting expired flags.</b>
</div>

---

<div align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/ESM-Ready-green" alt="ESM Ready">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-v18+-green.svg" alt="Node"></a>
</div>

---

## ✨ Overview

`eslint-plugin-feature-flags` provides rules to enforce feature flag hygiene in your codebase by:

- 🔍 **Detecting expired feature flags** that should be removed
- 📅 **Tracking expiration dates** for all feature flags
- 📝 **Documenting feature flags** with descriptions
- 🚨 **Warning about technical debt** before it piles up

---

## 📦 Installation

### npm

```bash
npm install --save-dev eslint-plugin-feature-flags
```

### yarn

```bash
yarn add --dev eslint-plugin-feature-flags
```

### pnpm

```bash
pnpm add --save-dev eslint-plugin-feature-flags
```

---

## ⚙️ Configuration

### ESLint Flat Config (ESLint v9+)

```js
// eslint.config.js
import featureFlags from 'eslint-plugin-feature-flags';

export default [
  // Use one of the pre-configured configs
  featureFlags.configs.recommended,

  // Or configure manually
  {
    plugins: {
      'feature-flags': featureFlags,
    },
    rules: {
      'feature-flags/expired-feature-flag': [
        'error',
        {
          featureFlags: {
            'new-homepage': {
              expires: '2025-12-31',
              description: 'New homepage redesign',
            },
            'dark-mode': {
              expires: '2025-06-30',
              description: 'Dark mode feature',
            },
            'legacy-feature': {
              expires: '2023-01-01',
              description: 'Legacy feature that should be removed',
            },
          },
          identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
        },
      ],
    },
  },
];
```

### Traditional ESLint Config (ESLint v8 and earlier)

```js
// .eslintrc.js
module.exports = {
  plugins: ['feature-flags'],
  extends: [
    // You can use the recommended configuration
    'plugin:feature-flags/recommended',
  ],
  rules: {
    // Or configure the rule manually
    'feature-flags/expired-feature-flag': [
      'error',
      {
        featureFlags: {
          'new-homepage': {
            expires: '2025-12-31',
            description: 'New homepage redesign',
          },
          'dark-mode': {
            expires: '2025-06-30',
            description: 'Dark mode feature',
          },
          'legacy-feature': {
            expires: '2023-01-01',
            description: 'Legacy feature that should be removed',
          },
        },
        identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
      },
    ],
  },
};
```

---

## 🔍 Rules

### `expired-feature-flag`

Detects usage of feature flags that have passed their expiration date.

#### Options

- `featureFlags` (required): An object mapping flag names to their configuration.
  - `expires`: Date in YYYY-MM-DD format when the flag should be removed.
  - `description`: Optional description of what the flag controls.
- `identifiers` (optional): Array of function names that are used to access feature flags. Defaults to `['getFeatureFlag']`.

#### Message

When a flag has expired, you'll see an error like:

```
Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed.
```

---

## 📚 Pre-configured Configs

### `recommended`

Enables the `expired-feature-flag` rule with 'error' severity.

```js
{
  plugins: ['feature-flags'],
  rules: {
    'feature-flags/expired-feature-flag': 'error',
  },
}
```

### `strict`

Same as recommended for now, may include additional rules in the future.

### `base`

Enables the `expired-feature-flag` rule with 'warn' severity.

```js
{
  plugins: ['feature-flags'],
  rules: {
    'feature-flags/expired-feature-flag': 'warn',
  },
}
```

---

## 🌟 Examples

### Feature Flags Implementation

```typescript
// src/utils/feature-flags.ts
type FeatureFlags = {
  'new-homepage': boolean;
  'dark-mode': boolean;
  'legacy-feature': boolean;
};

const FLAGS: FeatureFlags = {
  'new-homepage': true,
  'dark-mode': false,
  'legacy-feature': false,
};

export function getFeatureFlag<T extends keyof FeatureFlags>(name: T): FeatureFlags[T] {
  return FLAGS[name];
}

export function isFeatureEnabled<T extends keyof FeatureFlags>(name: T): boolean {
  return !!FLAGS[name];
}
```

### Usage in Components

```typescript
// src/components/Homepage.tsx
import { getFeatureFlag } from '../utils/feature-flags';

export function Homepage() {
  // ESLint will warn if 'legacy-feature' is expired based on your config
  if (getFeatureFlag('legacy-feature')) {
    return <LegacyHomepage />;
  }

  // ESLint won't warn if 'new-homepage' hasn't expired yet
  if (getFeatureFlag('new-homepage')) {
    return <NewHomepage />;
  }

  return <DefaultHomepage />;
}
```

### React Example

```jsx
// src/components/App.jsx
import React from 'react';
import { getFeatureFlag } from '../utils/feature-flags';

function App() {
  const showNewUI = getFeatureFlag('new-homepage');
  const enableDarkMode = getFeatureFlag('dark-mode');
  const useOldCheckout = getFeatureFlag('legacy-feature'); // ESLint error here

  return (
    <div className={enableDarkMode ? 'dark-theme' : 'light-theme'}>
      <Header />
      {showNewUI ? <NewContent /> : <LegacyContent />}
      {useOldCheckout && <OldCheckoutProcess />}
    </div>
  );
}
```

---

## 🔧 Integration with CI/CD

Add the ESLint check to your CI pipeline to prevent merging code with expired feature flags:

```yaml
# .github/workflows/lint.yml
name: Lint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
```

---

## 📋 Best Practices

1. **Set realistic expiration dates**: Give your team enough time to clean up code properly.
2. **Document your feature flags**: Use the `description` field to help future developers understand the purpose.
3. **Regular cleanup**: Run linting regularly to identify and remove expired feature flags.
4. **CI integration**: Add ESLint to your CI pipeline to prevent merging code with expired feature flags.
5. **Centralize flag management**: Keep all feature flags in one place for easy management.

---

## 💡 Troubleshooting

### Rule not working?

1. Make sure you've correctly installed and configured the plugin.
2. Check that your feature flag function names match those in the `identifiers` option.
3. Ensure expiration dates are in the correct format (YYYY-MM-DD).
4. Verify that your ESLint configuration is actually being used.
