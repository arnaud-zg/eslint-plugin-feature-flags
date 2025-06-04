import { describe, it, expect } from 'vitest';
import rule from '..';

describe('expired-feature-flag rule configuration', () => {
  describe('schema validation', () => {
    it('should have correct schema definition', () => {
      expect(rule.meta?.schema).toEqual([
        {
          type: 'object',
          properties: {
            featureFlags: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  expires: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['expires'],
                additionalProperties: false,
              },
            },
            identifiers: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          required: ['featureFlags'],
          additionalProperties: false,
        },
      ]);
    });

    it('should have the correct meta information', () => {
      expect(rule?.meta?.type).toBe('problem');
      expect(rule?.meta?.docs).toEqual({
        description: 'Detect usage of expired feature flags',
        category: 'Possible Errors',
        recommended: true,
      });
    });

    it('should define the correct error message', () => {
      expect(rule?.meta?.messages).toEqual({
        expiredFeatureFlag:
          'Feature flag "{{name}}" has expired on {{expirationDate}}. It should be removed.',
      });
    });
  });
});
