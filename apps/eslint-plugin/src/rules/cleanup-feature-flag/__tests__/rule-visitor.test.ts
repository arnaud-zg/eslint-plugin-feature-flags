/** Tests for the cleanup-feature-flag rule visitor */
import { describe, it } from 'vitest';
import { RuleTester } from 'eslint';
import * as parser from '@typescript-eslint/parser';
import rule from '..';

describe('cleanup-feature-flag rule visitor', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  });

  const testOptions = [{
    identifiers: ['getFeatureFlag', 'isFeatureEnabled'],
    flagsToCleanup: {
      'enable-ui-v1': 'preserve-enabled-path',
      'enable-ui-v2': 'preserve-disabled-path',
      'enable-dark-mode': 'remove-entirely',
      'enable-analytics': 'preserve-enabled-path',
    },
  }];

  describe('rule implementation', () => {
    it('handles valid cases', () => {
      ruleTester.run('valid-cases', rule, {
        valid: [
          {
            name: 'active flag',
            code: `const activeFlag = getFeatureFlag('active-feature');`,
            options: testOptions,
          },
          {
            name: 'current flag',
            code: `if (isFeatureEnabled('current-feature')) { doSomething(); }`,
            options: testOptions,
          },
        ],
        invalid: [],
      });
    });

    describe('preserve-enabled-path strategy', () => {
      ruleTester.run('preserve-enabled-path', rule, {
        valid: [],
        invalid: [
          {
            name: 'If-else statement',
            code: `if (getFeatureFlag('enable-ui-v1')) { doSomething(); } else { doSomethingElse(); }`,
            output: `doSomething();`,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
          {
            name: 'Ternary expression',
            code: `const result = isFeatureEnabled('enable-ui-v1') ? 'enabled' : 'disabled';`,
            output: `const result = 'enabled';`,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
          {
            name: 'Logical AND expression',
            code: `getFeatureFlag('enable-ui-v1') && doSomething();`,
            output: `doSomething();`,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
        ],
      });
    });

    describe('preserve-disabled-path strategy', () => {
      ruleTester.run('preserve-disabled-path', rule, {
        valid: [],
        invalid: [
          {
            name: 'If-else statement',
            code: `if (getFeatureFlag('enable-ui-v2')) { doSomething(); } else { doSomethingElse(); }`,
            output: `doSomethingElse();`,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
          {
            name: 'Ternary expression',
            code: `const result = isFeatureEnabled('enable-ui-v2') ? 'enabled' : 'disabled';`,
            output: `const result = 'disabled';`,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
          {
            name: 'Logical OR expression',
            code: `isFeatureEnabled('enable-ui-v2') || doSomethingElse();`,
            output: `doSomethingElse();`,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
        ],
      });
    });

    describe('remove-entirely strategy', () => {
      ruleTester.run('remove-entirely', rule, {
        valid: [],
        invalid: [
          {
            name: 'If statement',
            code: `if (getFeatureFlag('enable-dark-mode')) { doSomething(); }`,
            output: ``,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
          {
            name: 'Logical AND expression',
            code: `getFeatureFlag('enable-dark-mode') && doSomething();`,
            output: ``,
            options: testOptions,
            errors: [{ messageId: 'cleanupFeatureFlag' }],
          },
        ],
      });
    });
  });
});
