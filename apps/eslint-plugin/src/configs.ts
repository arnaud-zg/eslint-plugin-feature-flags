/**
 * Pre-configured ESLint settings for different use cases
 */
export const configs = {
  // Recommended configuration - catches the most important issues
  recommended: {
    plugins: ['feature-flags'],
    rules: {
      'feature-flags/expired-feature-flag': 'error',
    },
  },

  // Strict configuration - enforces all best practices
  strict: {
    plugins: ['feature-flags'],
    rules: {
      'feature-flags/expired-feature-flag': 'error',
    },
  },

  // Base configuration with warnings instead of errors
  base: {
    plugins: ['feature-flags'],
    rules: {
      'feature-flags/expired-feature-flag': 'warn',
    },
  },
};
