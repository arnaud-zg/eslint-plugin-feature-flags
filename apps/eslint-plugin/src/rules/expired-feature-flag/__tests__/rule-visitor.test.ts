/** Tests for the expired-feature-flag rule visitor without mocks */
import { RuleTester } from 'eslint';
import rule from '../index';
import { describe, it, beforeAll, afterAll, vi } from 'vitest';

describe('expired-feature-flag rule (no mocks)', () => {
  // Fixed current date for consistent tests (June 10, 2025)
  const fixedDate = new Date(2025, 5, 10);

  beforeAll(() => {
    // Mock Date constructor and Date.now() for deterministic test results
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterAll(() => {
    // Restore original Date implementation
    vi.useRealTimers();
  });

  // Setup ESLint rule tester with ESLint 9's flat config format
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });

  describe('rule implementation', () => {
    it('should handle empty options and not flag anything', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `const anyFeature = 'any-feature';`,
            options: [],
          },
          {
            code: `getFeatureFlag('any-feature');`,
            options: [],
          }
        ],
        invalid: []
      });
    });

    it('should handle missing feature flags and not flag anything', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `const anyFeature = 'any-feature';`,
            options: [{ featureFlags: {} }],
          },
          {
            code: `getFeatureFlag('any-feature');`,
            options: [{ featureFlags: {} }],
          }
        ],
        invalid: []
      });
    });

    // Testing the different AST node types
    describe('should support all relevant AST node types', () => {
      // Common options for these tests
      const testOptions = [
        {
          featureFlags: {
            'legacy-feature': {
              expires: '2025-01-01',  // Expired feature
              description: 'A feature that has expired'
            },
            'active-feature': {
              expires: '2026-01-01',  // Active feature
              description: 'A feature that has not expired yet'
            }
          },
          identifiers: ['getFeatureFlag']
        }
      ];

      it('should detect string literals correctly', () => {
        ruleTester.run('expired-feature-flag', rule, {
          valid: [
            {
              code: `const activeFeature = 'active-feature';`,
              options: testOptions
            },
            {
              code: `const nonFeature = 123;`, // Non-string literal
              options: testOptions
            }
          ],
          invalid: [
            {
              code: `const legacyFeature = 'legacy-feature';`,
              options: testOptions,
              errors: [{ messageId: 'expiredFeatureFlag' }]
            }
          ]
        });
      });

      it('should detect call expressions correctly', () => {
        ruleTester.run('expired-feature-flag', rule, {
          valid: [
            {
              code: `getFeatureFlag('active-feature');`,
              options: testOptions
            },
            {
              code: `otherFunction('legacy-feature');`, // Different function name
              options: testOptions
            }
          ],
          invalid: [
            {
              code: `getFeatureFlag('legacy-feature');`,
              options: testOptions,
              errors: [{ messageId: 'expiredFeatureFlag' }]
            }
          ]
        });
      });

      it('should detect member expressions correctly', () => {
        ruleTester.run('expired-feature-flag', rule, {
          valid: [
            {
              code: `const flags = {'active-feature': true}; const value = flags['active-feature'];`,
              options: testOptions
            },
            {
              code: `const flags = {activeFeature: true}; const value = flags.activeFeature;`,
              options: testOptions
            }
          ],
          invalid: [
            {
              code: `const flags = {'legacy-feature': true}; const value = flags['legacy-feature'];`,
              options: testOptions,
              errors: [
                { messageId: 'expiredFeatureFlag' }, 
                { messageId: 'expiredFeatureFlag' }
              ]
            },
            {
              code: `const flags = {legacyFeature: true}; const value = flags.legacyFeature;`,
              options: testOptions,
              errors: [
                { messageId: 'expiredFeatureFlag' }, 
                { messageId: 'expiredFeatureFlag' }
              ]
            }
          ]
        });
      });
    });
  });

  describe('non-expired feature flags', () => {
    it('should allow usage of feature flags that have not expired yet', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('new-feature')`,
            options: [
              {
                featureFlags: {
                  'new-feature': {
                    expires: '2025-12-31',
                    description: 'A feature that has not expired yet',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
          },
        ],
        invalid: [],
      });
    });

    it('should allow flags that have no expiration date defined', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('permanent-feature')`,
            options: [
              {
                featureFlags: {
                  'permanent-feature': {
                    description: 'A feature with no expiration',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
          },
        ],
        invalid: [],
      });
    });

    it('should allow unknown feature flags when not defined in options', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('unknown-flag')`,
            options: [
              {
                featureFlags: {},
                identifiers: ['getFeatureFlag'],
              },
            ],
          },
        ],
        invalid: [],
      });
    });

    it('should handle custom accessor functions correctly', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `isFeatureEnabled('new-feature')`,
            options: [
              {
                featureFlags: {
                  'new-feature': {
                    expires: '2025-12-31',
                  },
                },
                identifiers: ['isFeatureEnabled'],
              },
            ],
          },
        ],
        invalid: [],
      });
    });
  });

  describe('expired feature flags', () => {
    it('should report calling accessor function with an expired flag', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `getFeatureFlag('legacy-feature')`,
            options: [
              {
                featureFlags: {
                  'legacy-feature': {
                    expires: '2025-01-01', // Expired as of June 10, 2025
                    description: 'A feature that has expired',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
            errors: [{ messageId: 'expiredFeatureFlag' }],
          },
        ],
      });
    });

    it('should report multiple expired flags in the same file', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `
              const flags = { 
                'legacy-feature': true,
                'another-legacy': false 
              };
              getFeatureFlag('legacy-feature');
              isFeatureEnabled('another-legacy');
            `,
            options: [
              {
                featureFlags: {
                  'legacy-feature': {
                    expires: '2024-12-31',
                    description: 'First expired feature',
                  },
                  'another-legacy': {
                    expires: '2024-11-15',
                    description: 'Second expired feature',
                  },
                },
                identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
              },
            ],
            errors: [
              { messageId: 'expiredFeatureFlag' },
              { messageId: 'expiredFeatureFlag' },
              { messageId: 'expiredFeatureFlag' },
              { messageId: 'expiredFeatureFlag' },
            ],
          },
        ],
      });
    });
  });

  describe('edge cases', () => {
    it('should handle template literals', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: '`test-${getFeatureFlag("active-flag")}`',
            options: [
              {
                featureFlags: {
                  'active-flag': {
                    expires: '2026-01-01',
                    description: 'A feature that has not expired yet',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
          },
        ],
        invalid: [
          {
            code: '`test-${getFeatureFlag("legacy-feature")}`',
            options: [
              {
                featureFlags: {
                  'legacy-feature': {
                    expires: '2025-01-01',
                    description: 'An expired feature',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
            errors: [{ messageId: 'expiredFeatureFlag' }],
          },
        ],
      });
    });

    it('should handle variable string identifiers', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `
              const flagName = 'active-flag';
              getFeatureFlag(flagName);
            `,
            options: [
              {
                featureFlags: {
                  'active-flag': {
                    expires: '2026-01-01',
                    description: 'A feature that has not expired yet',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
          },
        ],
        invalid: [],
      });
    });
  });
});
