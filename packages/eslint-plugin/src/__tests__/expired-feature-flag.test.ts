import { RuleTester } from 'eslint';
import rule from '../rules/expired-feature-flag.js';
import { describe, it, vi, beforeAll, afterAll } from 'vitest';

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

  describe('non-expired feature flags', () => {
    it('should allow usage of feature flags that have not expired yet', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('new-feature')`,
            options: [{
              featureFlags: {
                'new-feature': {
                  expires: '2025-12-31',
                  description: 'A feature that has not expired yet'
                }
              },
              identifiers: ['getFeatureFlag']
            }]
          }
        ],
        invalid: []
      });
    });

    it('should allow flags that have no expiration date defined', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('permanent-feature')`,
            options: [{
              featureFlags: {
                'permanent-feature': {
                  description: 'A feature with no expiration'
                }
              },
              identifiers: ['getFeatureFlag']
            }]
          }
        ],
        invalid: []
      });
    });

    it('should allow unknown feature flags when not defined in options', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('unknown-flag')`,
            options: [{
              featureFlags: {},
              identifiers: ['getFeatureFlag']
            }]
          }
        ],
        invalid: []
      });
    });

    it('should handle custom accessor functions correctly', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `isFeatureEnabled('new-feature')`,
            options: [{
              featureFlags: {
                'new-feature': {
                  expires: '2025-12-31'
                }
              },
              identifiers: ['isFeatureEnabled']
            }]
          }
        ],
        invalid: []
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
            options: [{
              featureFlags: {
                'legacy-feature': {
                  expires: '2025-01-01', // Expired as of June 4, 2025
                  description: 'A feature that has expired'
                }
              },
              identifiers: ['getFeatureFlag']
            }],
            errors: [{ messageId: 'expiredFeatureFlag' }]
          }
        ]
      });
    });

    it('should report using an expired flag as an object property', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `const flags = { 'legacy-feature': true }`,
            options: [{
              featureFlags: {
                'legacy-feature': {
                  expires: '2025-01-01',
                  description: 'A feature that has expired'
                }
              }
            }],
            errors: [{ messageId: 'expiredFeatureFlag' }]
          }
        ]
      });
    });

    it('should report using an expired flag with bracket notation', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [],
        invalid: [
          {
            code: `const value = flags['legacy-feature']`,
            options: [{
              featureFlags: {
                'legacy-feature': {
                  expires: '2025-01-01',
                  description: 'A feature that has expired'
                }
              }
            }],
            errors: [{ messageId: 'expiredFeatureFlag' }]
          }
        ]
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
            options: [{
              featureFlags: {
                'legacy-feature': {
                  expires: '2024-12-31',
                  description: 'First expired feature'
                },
                'another-legacy': {
                  expires: '2024-11-15',
                  description: 'Second expired feature'
                }
              },
              identifiers: ['getFeatureFlag', 'isFeatureEnabled']
            }],
            errors: [
              { messageId: 'expiredFeatureFlag' },
              { messageId: 'expiredFeatureFlag' },
              { messageId: 'expiredFeatureFlag' },
              { messageId: 'expiredFeatureFlag' }
            ]
          }
        ]
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
            options: [{
              featureFlags: {
                'expires-today': {
                  expires: '2025-06-04', // Same as our mocked current date
                  description: 'A feature expiring today'
                }
              },
              identifiers: ['getFeatureFlag']
            }]
          }
        ],
        invalid: []
      });
    });
    
    it('should work with double quotes for string literals', () => {
      // Testing with double quotes instead of single quotes
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag("expires-today")`,
            options: [{
              featureFlags: {
                'expires-today': {
                  expires: '2025-06-04', // Same as our mocked current date
                  description: 'A feature expiring today'
                }
              },
              identifiers: ['getFeatureFlag']
            }]
          }
        ],
        invalid: []
      });
    });
    
    it('should handle invalid date formats gracefully', () => {
      ruleTester.run('expired-feature-flag', rule, {
        valid: [
          {
            code: `getFeatureFlag('invalid-date-format')`,
            options: [{
              featureFlags: {
                'invalid-date-format': {
                  expires: 'not-a-date',
                  description: 'A feature with invalid date format'
                }
              },
              identifiers: ['getFeatureFlag']
            }]
          }
        ],
        invalid: []
      });
    });
  });
});
