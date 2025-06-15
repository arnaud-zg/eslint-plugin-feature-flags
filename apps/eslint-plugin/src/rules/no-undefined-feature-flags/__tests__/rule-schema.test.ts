/** Tests for the no-undefined-feature-flags rule schema */
import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';
import rule from '..';

describe('no-undefined-feature-flags rule schema', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  });

  it('should validate rule schema correctly', () => {
    // Valid configurations that should be accepted by the schema
    const validConfigs = [
      {
        name: 'Basic configuration with only featureFlags',
        config: {
          featureFlags: {
            'new-homepage': {
              expires: '2025-12-31',
              description: 'New homepage redesign',
            },
          },
        },
      },
      {
        name: 'Configuration with custom identifiers',
        config: {
          featureFlags: {
            'enable-dark-mode': {
              expires: '2025-06-30',
              description: 'Dark mode feature',
            },
          },
          identifiers: ['isFeatureEnabled', 'getFeature'],
        },
      },
      {
        name: 'Minimal configuration with only required properties',
        config: {
          featureFlags: {
            'feature-a': {
              expires: '2025-12-31',
            },
          },
        },
      },
      {
        name: 'Full configuration with multiple flags and options',
        config: {
          featureFlags: {
            'new-homepage': {
              expires: '2025-12-31',
              description: 'New homepage redesign',
            },
            'enable-dark-mode': {
              expires: '2025-06-30',
              description: 'Dark mode feature',
            },
          },
          identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
        },
      },
    ];     
    

    // Test valid configurations
    validConfigs.forEach((config) => {
      expect(() => {
        ruleTester.run('test-valid-config', rule, {
          valid: [
            {
              code: 'var x = 1;',
              options: [config],
            },
          ],
          invalid: [],
        });
      }).not.toThrow();
    });
  });
});
