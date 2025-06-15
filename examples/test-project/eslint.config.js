// Import dependencies
import { fileURLToPath } from 'node:url';

// Import ESLint plugins
import featureFlagsPlugin from '../../apps/eslint-plugin/dist/index.esm.js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// Define feature flags configuration once and reuse across rules
const featureFlagsConfig = {
  'enable-ui-v1': {
    expires: '2025-01-01',
    description: 'Legacy UI components',
  },
  'enable-beta-feature': {
    expires: '2025-12-31',
    description: 'Beta features under testing',
  },
  'enable-dark-mode': {
    expires: '2026-06-30',
    description: 'Dark mode support',
  },
  'enable-analytics': {
    expires: '2026-01-15',
    description: 'Analytics tracking',
  },
};

// Common rule options
const ruleOptions = {
  featureFlags: featureFlagsConfig,
  identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
};

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        project: "./tsconfig.json"
      },
      globals: {
        console: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      'feature-flags': featureFlagsPlugin,
    },
    rules: {
      'feature-flags/expired-feature-flag': ['error', ruleOptions],
      'feature-flags/no-undefined-feature-flags': ['error', ruleOptions],
      'feature-flags/cleanup-feature-flag': ['warn', {
        ...ruleOptions,
        flagsToCleanup: {
          'enable-ui-v1': 'preserve-enabled-path',
          'enable-beta-feature': 'preserve-disabled-path',
        }
      }],
    },
  },
];
