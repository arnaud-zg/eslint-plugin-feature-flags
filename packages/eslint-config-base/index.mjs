import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export const baseConfig = [
  js.configs.recommended,
  prettierConfig,
  // Base configuration for all files
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        node: true
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**']
  },
];
