# 🚀 ESLint Plugin Feature Flags

<p align="center">
  <img src="../../assets/icon.svg" width="128" height="128" alt="ESLint Plugin Feature Flags Logo" />
</p>

<div align="center">
  ESLint plugin to manage feature flags and prevent technical debt
</div>

<div align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/ESM-Ready-green" alt="ESM Ready">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-v18+-green.svg" alt="Node"></a>
</div>

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Available Rules](#available-rules)
  - [1. expired-feature-flag](#1-expired-feature-flag)
  - [2. no-undefined-feature-flags](#2-no-undefined-feature-flags)
  - [3. cleanup-feature-flag](#3-cleanup-feature-flag)
- [Configuration Examples](#configuration-examples)
- [Common Setup Pattern](#common-setup-pattern)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

This ESLint plugin helps you:

- 🔍 Detect expired feature flags
- ⚠️ Prevent undefined feature flag usage
- 🚨 Clean up technical debt

## Quick Start

### Install

```bash
npm install --save-dev eslint-plugin-feature-flags
```

### Configure

```js
// eslint.config.js (ESLint v9+)
import featureFlags from 'eslint-plugin-feature-flags';

const config = {
  'new-feature': {
    expires: '2025-12-31',
    description: 'New feature rollout',
  }
};

export default [
  featureFlags.configs.recommended,
  {
    plugins: { 'feature-flags': featureFlags },
    rules: {
      'feature-flags/expired-feature-flag': ['error', {
        featureFlags: config,
        identifiers: ['isFeatureEnabled']
      }]
    }
  }
];
```

### Use in Your Code

```typescript
// Define your feature flags
type Features = {
  'new-feature': boolean;
};

const FLAGS: Features = {
  'new-feature': false
};

function isFeatureEnabled(flag: keyof Features): boolean {
  return FLAGS[flag];
}

// ESLint will check this usage
if (isFeatureEnabled('new-feature')) {
  // New code
} else {
  // Old code
}
```

## Available Rules

This plugin provides three powerful rules to help manage feature flags throughout their lifecycle.

### 1. expired-feature-flag

**Purpose**: Detects usage of feature flags that have passed their expiration date.

```js
// Configuration
{
  'feature-flags/expired-feature-flag': ['error', {
    featureFlags: {
      'old-feature': {
        expires: '2025-01-01',
        description: 'Deprecated feature'
      }
    },
    identifiers: ['isFeatureEnabled']
  }]
}
```

**Examples**:
```js
// ❌ Error: Feature flag "old-feature" expired on 2025-01-01
if (isFeatureEnabled('old-feature')) {
  doSomething();
}

// ✅ OK: Feature not expired
if (isFeatureEnabled('new-feature')) {
  doSomething();
}
```

### 2. no-undefined-feature-flags

**Purpose**: Prevents typos and references to flags not defined in your configuration.

```js
// Configuration
{
  'feature-flags/no-undefined-feature-flags': ['error', {
    featureFlags: {
      'enable-dark-mode': {
        expires: '2025-12-31'
      }
    },
    identifiers: ['isFeatureEnabled']
  }]
}
```

**Examples**:
```js
// ❌ Error: Feature flag "unknown-flag" is not defined
if (isFeatureEnabled('unknown-flag')) {
  doSomething();
}

// ✅ OK: Feature is defined in config
if (isFeatureEnabled('enable-dark-mode')) {
  doSomething();
}
```

### 3. cleanup-feature-flag

**Purpose**: Automates the removal of feature flag code with three strategies.

```js
// Configuration
{
  'feature-flags/cleanup-feature-flag': ['warn', {
    identifiers: ['isFeatureEnabled'],
    flagsToCleanup: {
      'legacy-ui': 'preserve-enabled-path',      // Keep the "if" branch
      'enable-beta-feature': 'preserve-disabled-path',  // Keep the "else" branch
      'temp-flag': 'remove-entirely'             // Remove the entire statement
    }
  }]
}
```

**Cleanup Strategies**:

1. **preserve-enabled-path**: Keeps only the code inside the "if" condition
   ```js
   // Before:
   if (isFeatureEnabled('legacy-ui')) {
     showNewUI();
   } else {
     showOldUI();
   }

   // After:
   showNewUI();
   ```

2. **preserve-disabled-path**: Keeps only the code inside the "else" condition
   ```js
   // Before:
   if (isFeatureEnabled('enable-beta-feature')) {
     enableBeta();
   } else {
     useStable();
   }

   // After:
   useStable();
   ```

3. **remove-entirely**: Removes the entire statement
   ```js
   // Before:
   if (isFeatureEnabled('temp-flag')) {
     doTemporaryThing();
   }

   // After:
   // (code removed)
   ```

## Configuration Examples

### ESLint v9+ (Flat Config)

```js
// eslint.config.js
import featureFlags from 'eslint-plugin-feature-flags';

// Define your feature flags
const flags = {
  'ui-v1': {
    expires: '2025-01-01',
    description: 'Legacy UI (deprecated)',
  },
  'ui-v2': {
    expires: '2025-12-31',
    description: 'Current UI version',
  }
};

// Shared options for rules
const options = {
  featureFlags: flags,
  identifiers: ['isFeatureEnabled', 'getFlag'],
};

export default [
  featureFlags.configs.recommended,
  {
    plugins: { 'feature-flags': featureFlags },
    rules: {
      // Detect expired flags
      'feature-flags/expired-feature-flag': ['error', options],
      
      // Prevent undefined flags
      'feature-flags/no-undefined-feature-flags': ['error', options],
      
      // Clean up old flags
      'feature-flags/cleanup-feature-flag': ['warn', {
        ...options,
        flagsToCleanup: {
          'ui-v1': 'preserve-enabled-path'
        }
      }]
    },
  },
];
```

### ESLint v8 and Earlier

```js
// .eslintrc.js
const flags = {
  'ui-v1': {
    expires: '2025-01-01',
    description: 'Legacy UI (deprecated)',
  },
  'ui-v2': {
    expires: '2025-12-31',
    description: 'Current UI version',
  }
};

module.exports = {
  plugins: ['feature-flags'],
  extends: ['plugin:feature-flags/recommended'],
  rules: {
    'feature-flags/expired-feature-flag': ['error', {
      featureFlags: flags,
      identifiers: ['isFeatureEnabled']
    }],
    'feature-flags/no-undefined-feature-flags': ['error', {
      featureFlags: flags,
      identifiers: ['isFeatureEnabled']
    }],
  },
};
```

## Common Setup Pattern

A typical setup follows these steps:

1. **Define your feature flags in a central file**

```ts
// feature-flags.ts
export const FLAGS = {
  'enable-dark-mode': false,
  'experimental-ui': false,
  'enable-beta-feature': false
};

export type FeatureFlag = keyof typeof FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FLAGS[flag];
}
```

2. **Configure the ESLint plugin**

```js
// eslint.config.js
import featureFlags from 'eslint-plugin-feature-flags';

const flagDefinitions = {
  'enable-dark-mode': {
    expires: null, // permanent flag
    description: 'Dark mode theme option'
  },
  'experimental-ui': {
    expires: '2025-12-31',
    description: 'New UI components being tested'
  },
  'enable-beta-feature': {
    expires: '2025-06-30',
    description: 'Beta feature for select users'
  }
};

export default [
  featureFlags.configs.recommended,
  {
    plugins: { 'feature-flags': featureFlags },
    rules: {
      'feature-flags/expired-feature-flag': ['error', {
        featureFlags: flagDefinitions,
        identifiers: ['isFeatureEnabled']
      }],
      'feature-flags/no-undefined-feature-flags': ['error', {
        featureFlags: flagDefinitions,
        identifiers: ['isFeatureEnabled']
      }]
    }
  }
];
```

3. **Use the flags in your code**

```ts
import { isFeatureEnabled } from './feature-flags';

function renderButton() {
  if (isFeatureEnabled('experimental-ui')) {
    return <NewButton />;
  }
  return <Button />;
}
```

## Best Practices

- **Set realistic expiration dates** - Plan your feature deprecation timeline
- **Document all flags** - Add meaningful descriptions for each flag
- **Schedule regular cleanups** - Remove flags after they're no longer needed
- **Add to CI pipeline** - Catch issues before they reach production
- **Centralize flag management** - Keep definitions in one place
- **Use typed flags** - Get TypeScript autocomplete and validation

## Troubleshooting

- **Plugin not working?** - Check that it's correctly installed
- **Rules not triggering?** - Ensure function names match your `identifiers` config
- **Date issues?** - Use `YYYY-MM-DD` format for all dates
- **Config not found?** - Check that ESLint is finding your config file
