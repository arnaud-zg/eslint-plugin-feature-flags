/** Tests for the cleanup-feature-flag rule schema */
import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';
import rule from '..';

describe('cleanup-feature-flag rule configuration', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });

  describe('schema validation', () => {
    it('should have correct schema definition', () => {
      expect(rule.meta?.schema).toEqual([
        {
          type: 'object',
          properties: {
            // Configuration of feature flags (shared with other rules)
            featureFlags: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  expires: { type: 'string' }, // Date in YYYY-MM-DD format
                  description: { type: 'string' },
                },
                required: ['expires'],
                additionalProperties: false,
              },
            },
            // Names of functions that access feature flags (e.g., getFeatureFlag)
            identifiers: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            // Feature flags to clean up with their strategies
            flagsToCleanup: {
              type: 'object',
              additionalProperties: {
                type: 'string',
                enum: ['preserve-enabled-path', 'preserve-disabled-path', 'remove-entirely'],
              },
            },
          },
          required: ['flagsToCleanup'],
          additionalProperties: false,
        },
      ]);
    });

    it('should have the correct meta information', () => {
      expect(rule?.meta?.type).toBe('suggestion');
      expect(rule?.meta?.docs).toEqual({
        description: 'Clean up feature flags based on specified strategy',
      });
      expect(rule?.meta?.fixable).toBe('code');
    });

    it('should define the correct error message', () => {
      expect(rule?.meta?.messages).toEqual({
        cleanupFeatureFlag: 'Feature flag \"{{name}}\" should be cleaned up using strategy \"{{strategy}}\"',
      });
    });

    it('should accept valid configurations', () => {
      // Test with valid configurations
      const validConfigs = [
        {
          name: 'Basic configuration with flagsToCleanup',
          config: {
            flagsToCleanup: {
              'enable-ui-v1': 'preserve-enabled-path',
            },
          },
        },
        {
          name: 'Configuration with multiple strategies',
          config: {
            flagsToCleanup: {
              'enable-ui-v1': 'preserve-enabled-path',
              'enable-ui-v2': 'preserve-disabled-path',
              'enable-dark-mode': 'remove-entirely',
              'enable-analytics': 'preserve-enabled-path',
            },
            identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
          },
        },
      ];

      // Test valid configurations
      validConfigs.forEach((testCase) => {
        expect(() => {
          ruleTester.run('test-valid-config', rule, {
            valid: [
              {
                code: '// Empty file',
                options: [testCase.config],
              },
            ],
            invalid: [],
          });
        }).not.toThrow();
      });
    });
  });
});
