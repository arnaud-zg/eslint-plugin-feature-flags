export const testConfig = [
  // Test files configuration
  {
    files: ['**/__tests__/**/*.{js,ts}', '**/*.test.{js,ts}', '**/fixtures/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        console: true
      }
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off'
    }
  },
];