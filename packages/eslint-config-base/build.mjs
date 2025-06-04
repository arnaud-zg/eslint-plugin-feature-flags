export const buildConfig = [{
    files: ['**/tsup.config.ts', '**/vitest.config.ts', '**/eslint.config.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-console': 'off', // Allow all console usage in tsup config files
    },
  }]