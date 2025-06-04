// Integration tests for the ESLint plugin
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import plugin from '../index';
import { RuleTester } from 'eslint';
import fs from 'fs';
import path from 'path';
import process from 'process';

describe('eslint-plugin-feature-flags integration', () => {
  // Fixed current date for consistent tests (June 4, 2025)
  const fixedDate = new Date(2025, 5, 4);

  beforeEach(() => {
    // Mock Date constructor and Date.now()
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    // Restore original Date
    vi.useRealTimers();
  });

  describe('plugin structure', () => {
    it('should export rules correctly', () => {
      expect(plugin).toHaveProperty('rules');
      expect(plugin.rules).toHaveProperty('expired-feature-flag');
      expect(typeof plugin.rules['expired-feature-flag']).toBe('object');
      expect(plugin.rules['expired-feature-flag']).toHaveProperty('meta');
      expect(plugin.rules['expired-feature-flag']).toHaveProperty('create');
    });

    it('should export configs correctly', () => {
      expect(plugin).toHaveProperty('configs');
      expect(plugin.configs).toHaveProperty('recommended');
      expect(plugin.configs).toHaveProperty('strict');
      expect(plugin.configs).toHaveProperty('base');

      // Check recommended config
      expect(plugin.configs.recommended.rules).toHaveProperty('feature-flags/expired-feature-flag');
      expect(plugin.configs.recommended.rules['feature-flags/expired-feature-flag']).toBe('error');

      // Check strict config
      expect(plugin.configs.strict.rules).toHaveProperty('feature-flags/expired-feature-flag');
      expect(plugin.configs.strict.rules['feature-flags/expired-feature-flag']).toBe('error');

      // Check base config
      expect(plugin.configs.base.rules).toHaveProperty('feature-flags/expired-feature-flag');
      expect(plugin.configs.base.rules['feature-flags/expired-feature-flag']).toBe('warn');
    });
  });

  describe('integration with eslint', () => {
    // Setup RuleTester with ESLint 9's flat config format
    const ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    });

    // Read fixture files
    const fixturesDir = path.join(
      process.cwd(),
      'src/rules/expired-feature-flag/__tests__/fixtures'
    );

    it('should work end-to-end with fixture files', () => {
      // Read sample fixture files
      const expiredFlagContent = fs.readFileSync(
        path.join(fixturesDir, 'expired-flag-usage.js'),
        'utf8'
      );

      const activeFlagContent = fs.readFileSync(
        path.join(fixturesDir, 'active-flag-usage.ts'),
        'utf8'
      );

      // Test the rule in a full end-to-end integration scenario
      ruleTester.run('expired-feature-flag', plugin.rules['expired-feature-flag'], {
        valid: [
          {
            code: activeFlagContent,
            options: [
              {
                featureFlags: {
                  'active-flag': {
                    expires: '2026-01-01',
                    description: 'This flag is still active',
                  },
                },
                identifiers: ['getFeatureFlag'],
              },
            ],
          },
        ],
        invalid: [
          {
            code: expiredFlagContent,
            options: [
              {
                featureFlags: {
                  'expired-flag': {
                    expires: '2024-12-31',
                    description: 'This flag has expired',
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
  });
});
