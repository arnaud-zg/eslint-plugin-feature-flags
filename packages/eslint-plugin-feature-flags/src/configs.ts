/** Pre-configured ESLint settings */
export const configs = {
  recommended: {
    plugins: ['feature-flags'],
    rules: {
      'feature-flags/expired-feature-flag': 'error',
      'feature-flags/no-undefined-feature-flags': 'error',
    },
  },

  strict: {
    plugins: ['feature-flags'],
    rules: {
      'feature-flags/expired-feature-flag': 'error',
      'feature-flags/no-undefined-feature-flags': 'error',
    },
  },

  base: {
    plugins: ['feature-flags'],
    rules: {
      'feature-flags/expired-feature-flag': 'warn',
      'feature-flags/no-undefined-feature-flags': 'warn',
    },
  },
};
