import { RuleTester } from 'eslint';
import rule from '../index';
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';

describe('expired-feature-flag rule', () => {
  // Fixed current date for consistent tests (June 4, 2025)
  const fixedDate = new Date(2025, 5, 4);

  beforeAll(() => {
    // Mock Date constructor and Date.now()
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterAll(() => {
    // Restore original Date
    vi.useRealTimers();
  });

  // Use flat config format for ESLint 9
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });

  describe('rule implementation', () => {
    const reportSpy = vi.fn();

    afterEach(() => {
      reportSpy.mockReset();
    });

    it('should handle empty options', () => {
      const emptyContext = {
        options: [],
        report: reportSpy,
      };

      const listeners = rule.create(emptyContext);

      // Should still create valid listeners
      expect(listeners).toHaveProperty('Literal');
      expect(listeners).toHaveProperty('CallExpression');
      expect(listeners).toHaveProperty('MemberExpression');

      // Should not throw errors when processing nodes
      listeners.Literal({ value: 'any-feature', type: 'Literal' });
      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle missing feature flags', () => {
      const emptyFlagsContext = {
        options: [{ featureFlags: {} }],
        report: reportSpy,
      };

      const listeners = rule.create(emptyFlagsContext);

      // Should not report on any flag
      listeners.Literal({ value: 'any-feature', type: 'Literal' });
      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should support all AST node types correctly', () => {
      const context = {
        options: [
          {
            featureFlags: {
              'legacy-feature': {
                expires: '2025-01-01',
                description: 'A feature that has expired',
              },
              'active-feature': {
                expires: '2026-01-01',
                description: 'A feature that has not expired yet',
              },
              'no-expiration-feature': {
                description: 'A feature without expiration date',
              },
            },
            identifiers: ['getFeatureFlag'],
          },
        ],
        report: reportSpy,
      };

      const listeners = rule.create(context);

      // Test string literal detection
      listeners.Literal({ value: 'legacy-feature', type: 'Literal' });
      expect(reportSpy).toHaveBeenCalledTimes(1);
      reportSpy.mockReset();

      // Non-string literals should be ignored
      listeners.Literal({ value: 123, type: 'Literal' });
      expect(reportSpy).not.toHaveBeenCalled();

      // Test call expression handling
      listeners.CallExpression({
        callee: { type: 'Identifier', name: 'getFeatureFlag' },
        arguments: [{ type: 'Literal', value: 'legacy-feature' }],
      });
      expect(reportSpy).toHaveBeenCalledTimes(1);
      reportSpy.mockReset();

      // Test member expression handling
      listeners.MemberExpression({
        property: { type: 'Literal', value: 'legacy-feature' },
      });
      expect(reportSpy).toHaveBeenCalledTimes(1);
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
                    expires: '2025-01-01', // Expired as of June 4, 2025
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

    it('should report using an expired flag as an object property', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `const flags = { 'legacy-feature': true }`,
            options: [
              {
                featureFlags: {
                  'legacy-feature': {
                    expires: '2025-01-01',
                    description: 'A feature that has expired',
                  },
                },
              },
            ],
            errors: [{ messageId: 'expiredFeatureFlag' }],
          },
        ],
      });
    });

    it('should report using an expired flag with bracket notation', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `const value = flags['legacy-feature']`,
            options: [
              {
                featureFlags: {
                  'legacy-feature': {
                    expires: '2025-01-01',
                    description: 'A feature that has expired',
                  },
                },
              },
            ],
            errors: [{ messageId: 'expiredFeatureFlag' }],
          },
        ],
      });
    });

    it('should report using an expired flag with dot notation', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `const value = flags.legacyFeature`,
            options: [
              {
                featureFlags: {
                  legacyFeature: {
                    expires: '2025-01-01',
                    description: 'A feature that has expired',
                  },
                },
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
    it('should ignore feature flags that expire on the current date', () => {
      // June 4, 2025 is our test date
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('expires-today')`,
            options: [
              {
                featureFlags: {
                  'expires-today': {
                    expires: '2025-06-04', // Same as our mocked current date
                    description: 'A feature expiring today',
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

    it('should work with double quotes for string literals', () => {
      // Testing with double quotes instead of single quotes
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag("expires-today")`,
            options: [
              {
                featureFlags: {
                  'expires-today': {
                    expires: '2025-06-04', // Same as our mocked current date
                    description: 'A feature expiring today',
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

    it('should handle invalid date formats gracefully', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('invalid-date-format')`,
            options: [
              {
                featureFlags: {
                  'invalid-date-format': {
                    expires: 'not-a-date',
                    description: 'A feature with invalid date format',
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

    it('should handle case where no identifiers are specified in options', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('legacy-feature')`,
            options: [
              {
                featureFlags: {
                  'legacy-feature': {
                    expires: '2025-01-01',
                    description: 'A feature that has expired',
                  },
                },
                // No identifiers specified
              },
            ],
          },
        ],
        invalid: [],
      });
    });

    it('should handle empty options', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('any-feature')`,
            options: [],
          },
        ],
        invalid: [],
      });
    });
  });
});
