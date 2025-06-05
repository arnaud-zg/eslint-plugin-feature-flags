import { baseConfig } from '../../packages/eslint-config-base/index.mjs';
import { typescriptConfig } from '../../packages/eslint-config-base/typescript.mjs';

import featureFlagsPlugin from '../../apps/eslint-plugin/dist/index.esm.js';


export default [
  ...baseConfig,
  ...typescriptConfig,
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
      }
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
      'feature-flags/expired-feature-flag': [
        'error',
        {
          featureFlags: {
            'new-homepage': {
              expires: '2106-12-31',
              description: 'New homepage redesign',
            },
            'dark-mode': {
              expires: '2106-06-30',
              description: 'Dark mode feature',
            },
            'legacy-feature': {
              expires: '2023-01-01',
              description: 'Legacy feature that should be removed',
            },
            'experimental-search': {
              expires: '2106-01-01',
              description: 'Experimental search functionality',
            },
          },
          identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
        },
      ],
    },
  },
];
