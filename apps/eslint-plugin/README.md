# 🚀 ESLint Plugin Feature Flags

<p align="center">
  <img src="../../assets/icon.svg" width="128" height="128" alt="ESLint Plugin Feature Flags Logo" />
</p>

<div align="center">
  <b>ESLint plugin for feature flag hygiene and prevent technical debt</b>
</div>

---

<div align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/ESM-Ready-green" alt="ESM Ready">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-v18+-green.svg" alt="Node"></a>
</div>

---

## What This Plugin Does

`eslint-plugin-feature-flags` provides rules to enforce feature flag hygiene in your codebase by:

- 🔍 **Detecting expired feature flags** that should be removed
- ⚠️ **Preventing undefined feature flags** to avoid typos and mistakes
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

## ⚙️ Setting Up Your Configuration

### Using ESLint Flat Config (ESLint v9+)

```js
// eslint.config.js
import featureFlags from 'eslint-plugin-feature-flags';

// List all your feature flags here with their expiration dates
const featureFlagsConfig = {
  'new-homepage': {
    expires: '2025-12-31',
    description: 'New homepage redesign with improved UX',
  },
  'dark-mode': {
    expires: '2025-06-30',
    description: 'Dark mode theme toggle for all pages',
  },
  'legacy-feature': {
    expires: '2023-01-01', // This one has expired!
    description: 'Old checkout flow that should be removed',
  },
};

// Tell the plugin which functions you use to access your flags
const ruleOptions = {
  featureFlags: featureFlagsConfig,
  identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
};

export default [
  // Quick setup: use the recommended config
  featureFlags.configs.recommended,

  // Or customize it yourself
  {
    plugins: {
      'feature-flags': featureFlags,
    },
    rules: {
      'feature-flags/expired-feature-flag': ['error', ruleOptions],
      'feature-flags/no-undefined-feature-flags': ['error', ruleOptions],
    },
  },
];
```

### Using Traditional ESLint Config (ESLint v8 and earlier)

```js
// .eslintrc.js

// List all your feature flags here with their expiration dates
const featureFlagsConfig = {
  'new-homepage': {
    expires: '2025-12-31',
    description: 'New homepage redesign with improved UX',
  },
  'dark-mode': {
    expires: '2025-06-30',
    description: 'Dark mode theme toggle for all pages',
  },
  'legacy-feature': {
    expires: '2023-01-01', // This one has expired!
    description: 'Old checkout flow that should be removed',
  },
};

// Tell the plugin which functions you use to access your flags
const ruleOptions = {
  featureFlags: featureFlagsConfig,
  identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
};

module.exports = {
  plugins: ['feature-flags'],
  extends: [
    // Quick setup: use the recommended configuration
    'plugin:feature-flags/recommended',
  ],
  rules: {
    // Or customize the rules yourself
    'feature-flags/expired-feature-flag': ['error', ruleOptions],
    'feature-flags/no-undefined-feature-flags': ['error', ruleOptions],
  },
};
```

---

## 🔍 Rules to Keep Your Codebase Clean

### `expired-feature-flag`

Detects usage of feature flags that have passed their expiration date.

#### What you need to configure:

- `featureFlags` (required): An object with all your flags and their details:
  - `expires`: When should this flag be removed? Use YYYY-MM-DD format (e.g., "2023-12-31")
  - `description`: What does this flag do? Help your future self and teammates understand
- `identifiers`: What function names do you use to access flags? Defaults to just `['getFeatureFlag']` but you can add more.

#### What you'll see when there's a problem:
When a flag has expired, you'll see an error like:

```
Feature flag "legacy-feature" has expired on January 1, 2023. It should be removed.
```

### `no-undefined-feature-flags`

Detects usage of feature flags and references to flags don't exist.

#### What you need to configure:

- `featureFlags` (required): Same object as above with all your flags defined
- `identifiers`: Same as above - all the functions you use to get flag values

#### What you'll see when there's a problem:

```
Feature flag "new-hompage" is not defined in the ESLint configuration.
```

---

## 📚 Pre-configured Configs

### `recommended`

Enables both rules with 'error' severity.

```js
{
  plugins: ['feature-flags'],
  rules: {
    'feature-flags/expired-feature-flag': 'error',
    'feature-flags/no-undefined-feature-flags': 'error',
  },
}
```

### `strict`

Same as recommended for now, may include additional rules in the future.

### `base`

Enables both rules with 'warn' severity.

```js
{
  plugins: ['feature-flags'],
  rules: {
    'feature-flags/expired-feature-flag': 'warn',
    'feature-flags/no-undefined-feature-flags': 'warn',
  },
}
```

---

## 🌟 Examples

### Set Up Your Feature Flag System

Here's a simple TypeScript implementation to get you started:

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

### Using Flags in Your Components

Let's see what happens in a typical component:

```typescript
// src/components/Homepage.tsx
import { getFeatureFlag } from '../utils/feature-flags';

export function Homepage() {
  // If 'legacy-feature' has expired, ESLint will warn you to clean this up
  if (getFeatureFlag('legacy-feature')) {
    return <LegacyHomepage />;
  }

  // No warning here if 'new-homepage' is still active
  if (getFeatureFlag('new-homepage')) {
    return <NewHomepage />;
  }

  return <DefaultHomepage />;
}
```

### React Example with Multiple Flags

Here's how you'd use multiple flags in a React component:

```jsx
// src/components/App.jsx
import React from 'react';
import { getFeatureFlag } from '../utils/feature-flags';

function App() {
  const showNewUI = getFeatureFlag('new-homepage');
  const enableDarkMode = getFeatureFlag('dark-mode');
  // This will trigger an ESLint error if the flag has expired
  const useOldCheckout = getFeatureFlag('legacy-feature');

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

## 🔧 Adding to Your CI/CD Pipeline

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

## 📋 Best Practices for Feature Flag Success

1. **Be realistic with expiration dates** - Don't set a date next week if you know it'll take a month. Give your team enough time to properly clean up the code.

2. **Explain what your flags do** - Future you will thank you for using the `description` field to document what each flag controls.

3. **Schedule regular clean-up days** - Make it a habit to run linting and remove expired flags. "Flag Friday" anyone?

4. **Let your CI/CD help you** - Add the ESLint plugin to your CI pipeline so you catch expired flags before they make it to production.

5. **Keep your flags in one place** - Centralizing your feature flag management makes them much easier to track and update.

6. **Define every flag you use** - Adding all flags to your ESLint config helps catch typos and prevents those "why isn't my flag working?" debugging sessions.

---

## 💡 Troubleshooting

### Rule not working as expected?

If you're not seeing the linting results you expect:

1. Double-check your plugin installation and config a simple typo can break things.

2. Make sure your feature flag function names match what you put in the `identifiers` option.

3. Check your date formats - they must be YYYY-MM-DD (e.g., 2023-12-31).

4. Verify that ESLint is actually using your configuration file.
