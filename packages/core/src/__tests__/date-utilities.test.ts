/** Tests for date utility functions using fixed date (June 10, 2025) */
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { isExpired, formatExpirationDate } from '../index.js';
import type { FeatureFlag } from '@eslint-plugin-feature-flags/types';

describe('Date Utilities', () => {
  const fixedDate = new Date(2025, 5, 10);
  
  const TEST_FLAGS: Record<string, FeatureFlag> = {
    EXPIRED: {
      name: 'legacy-feature',
      description: 'A legacy feature that has expired',
      defaultValue: false,
      expiresOn: '2025-01-01',
    },
    CURRENT: {
      name: 'current-feature',
      description: 'A feature expiring today',
      defaultValue: true,
      expiresOn: '2025-06-10',
    },
    FUTURE: {
      name: 'new-feature',
      description: 'A new feature that has not expired',
      defaultValue: true,
      expiresOn: '2025-12-31',
    }
  };

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterAll(() => {
    vi.useRealTimers();
  });
  describe('isExpired', () => {
    it('should return true for a flag with a past expiration date', () => {
      expect(isExpired(TEST_FLAGS.EXPIRED)).toBe(true);
    });

    it('should return false for a flag with a future expiration date', () => {
      expect(isExpired(TEST_FLAGS.FUTURE)).toBe(false);
    });

    it('should return false for a flag expiring exactly today', () => {
      expect(isExpired(TEST_FLAGS.CURRENT)).toBe(false);
    });
  });

  describe('formatExpirationDate', () => {
    it('should format dates in a human-readable format', () => {
      expect(formatExpirationDate(TEST_FLAGS.EXPIRED.expiresOn)).toBe('January 1, 2025');
      expect(formatExpirationDate(TEST_FLAGS.CURRENT.expiresOn)).toBe('June 10, 2025');
      expect(formatExpirationDate(TEST_FLAGS.FUTURE.expiresOn)).toBe('December 31, 2025');
    });
    it('should handle all month names correctly', () => {
      const months = [
        { iso: '2025-01-15', expected: 'January 15, 2025' },
        { iso: '2025-02-15', expected: 'February 15, 2025' },
        { iso: '2025-03-15', expected: 'March 15, 2025' },
        { iso: '2025-04-15', expected: 'April 15, 2025' },
        { iso: '2025-05-15', expected: 'May 15, 2025' },
        { iso: '2025-06-15', expected: 'June 15, 2025' },
        { iso: '2025-07-15', expected: 'July 15, 2025' },
        { iso: '2025-08-15', expected: 'August 15, 2025' },
        { iso: '2025-09-15', expected: 'September 15, 2025' },
        { iso: '2025-10-15', expected: 'October 15, 2025' },
        { iso: '2025-11-15', expected: 'November 15, 2025' },
        { iso: '2025-12-15', expected: 'December 15, 2025' }
      ];

      months.forEach(({ iso, expected }) => {
        expect(formatExpirationDate(iso)).toBe(expected);
      });
    });
  });
});
