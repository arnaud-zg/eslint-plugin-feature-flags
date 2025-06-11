/** Integration tests for the ESLint plugin feature-flags */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import plugin from '../index';
import { RuleTester } from 'eslint';
import fs from 'fs';
import path from 'path';
import process from 'process';

const FIXTURES_BASE_PATH = 'src/rules';
const EXPIRED_FLAG_FIXTURES = path.join(process.cwd(), FIXTURES_BASE_PATH, 'expired-feature-flag/__tests__/fixtures');
const UNDEFINED_FLAG_FIXTURES = path.join(process.cwd(), FIXTURES_BASE_PATH, 'no-undefined-feature-flags/__tests__/fixtures');
const TEST_FLAGS = {
  // Active flags
  'new-homepage': {
    expires: '2026-01-01',
    description: 'New homepage redesign',
  },
  'dark-mode': {
    expires: '2026-01-01',
    description: 'Dark mode feature',
  },
  'active-flag': {
    expires: '2026-01-01',
    description: 'This flag is still active',
  },
  // Expired flags
  'expired-flag': {
    expires: '2024-12-31',
    description: 'This flag has expired',
  },
};

describe('eslint-plugin-feature-flags integration', () => {
  // Fixed current date for consistent tests (June 10, 2025)
  const fixedDate = new Date(2025, 5, 10);

  beforeEach(() => {
    // Mock Date constructor and Date.now()
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Plugin Structure', () => {
    describe('Exported Rules', () => {
      it('should export the expired-feature-flag rule correctly', () => {
        expect(plugin.rules).toHaveProperty('expired-feature-flag');
        expect(typeof plugin.rules['expired-feature-flag']).toBe('object');
        expect(plugin.rules['expired-feature-flag']).toHaveProperty('meta');
        expect(plugin.rules['expired-feature-flag']).toHaveProperty('create');
      });

      it('should export the no-undefined-feature-flags rule correctly', () => {
        expect(plugin.rules).toHaveProperty('no-undefined-feature-flags');
        expect(typeof plugin.rules['no-undefined-feature-flags']).toBe('object');
        expect(plugin.rules['no-undefined-feature-flags']).toHaveProperty('meta');
        expect(plugin.rules['no-undefined-feature-flags']).toHaveProperty('create');
      });
    });

    describe('Exported Configs', () => {
      it('should export all predefined configs', () => {
        expect(plugin).toHaveProperty('configs');
        expect(plugin.configs).toHaveProperty('recommended');
        expect(plugin.configs).toHaveProperty('strict');
        expect(plugin.configs).toHaveProperty('base');
      });

      it('should configure recommended config with error severity', () => {
        expect(plugin.configs.recommended.rules['feature-flags/expired-feature-flag']).toBe('error');
        expect(plugin.configs.recommended.rules['feature-flags/no-undefined-feature-flags']).toBe('error');
      });

      it('should configure strict config with error severity', () => {
        expect(plugin.configs.strict.rules['feature-flags/expired-feature-flag']).toBe('error');
        expect(plugin.configs.strict.rules['feature-flags/no-undefined-feature-flags']).toBe('error');
      });

      it('should configure base config with warn severity', () => {
        expect(plugin.configs.base.rules['feature-flags/expired-feature-flag']).toBe('warn');
        expect(plugin.configs.base.rules['feature-flags/no-undefined-feature-flags']).toBe('warn');
      });
    });
  });

  describe('Rule Integration Tests', () => {
    const ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    });

    describe('2.1 expired-feature-flag rule', () => {
      it('should detect expired feature flags and allow active ones', () => {
        // Read sample fixture files
        const expiredFlagContent = fs.readFileSync(
          path.join(EXPIRED_FLAG_FIXTURES, 'expired-flag-usage.js'),
          'utf8'
        );

        const activeFlagContent = fs.readFileSync(
          path.join(EXPIRED_FLAG_FIXTURES, 'active-flag-usage.ts'),
          'utf8'
        );

        // Test the rule with fixtures
        ruleTester.run('expired-feature-flag', plugin.rules['expired-feature-flag'], {
          valid: [
            {
              code: activeFlagContent,
              options: [{
                featureFlags: {
                  'active-flag': TEST_FLAGS['active-flag'],
                },
                identifiers: ['getFeatureFlag'],
              }],
            },
          ],
          invalid: [
            {
              code: expiredFlagContent,
              options: [{
                featureFlags: {
                  'expired-flag': TEST_FLAGS['expired-flag'],
                },
                identifiers: ['getFeatureFlag'],
              }],
              errors: [{ messageId: 'expiredFeatureFlag' }],
            },
          ],
        });
      });
    });

    describe('2.2 no-undefined-feature-flags rule', () => {
      it('should detect undefined feature flags and allow defined ones', () => {
        // Read sample fixture files
        const undefinedFlagContent = fs.readFileSync(
          path.join(UNDEFINED_FLAG_FIXTURES, 'undefined-flag-usage.js'),
          'utf8'
        );
        
        // Test the rule with fixtures
        ruleTester.run('no-undefined-feature-flags', plugin.rules['no-undefined-feature-flags'], {
          valid: [
            {
              code: 'const flag = getFeatureFlag("new-homepage");',
              options: [{
                featureFlags: {
                  'new-homepage': TEST_FLAGS['new-homepage'],
                },
              }],
            },
          ],
          invalid: [
            {
              code: undefinedFlagContent,
              options: [{
                featureFlags: {
                  'dark-mode': TEST_FLAGS['dark-mode'],
                },
                identifiers: ['getFeatureFlag'],
              }],
              errors: [
                { 
                  messageId: 'undefinedFeatureFlag',
                  data: { name: 'new-dashboard' },
                },
                { 
                  messageId: 'undefinedFeatureFlag',
                  data: { name: 'dark-theme' },
                },
              ],
            },
          ],
        });
      });
    });
  });
});
