import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { isExpired, formatExpirationDate } from '../index.js';
import type { FeatureFlag } from '@eslint-plugin-feature-flags/types';

describe('expiration-utils', () => {
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

  describe('isExpired', () => {
    it('should return true for a flag with a past expiration date', () => {
      const flag: FeatureFlag = {
        name: 'legacy-feature',
        description: 'A legacy feature that has expired',
        defaultValue: false,
        expiresOn: '2025-01-01', // January 1, 2025 (in the past)
      };

      expect(isExpired(flag)).toBe(true);
    });

    it('should return false for a flag with a future expiration date', () => {
      const flag: FeatureFlag = {
        name: 'new-feature',
        description: 'A new feature that has not expired',
        defaultValue: true,
        expiresOn: '2025-12-31', // December 31, 2025 (in the future)
      };

      expect(isExpired(flag)).toBe(false);
    });

    it('should return false for a flag expiring exactly today', () => {
      const flag: FeatureFlag = {
        name: 'current-feature',
        description: 'A feature expiring today',
        defaultValue: true,
        expiresOn: '2025-06-04', // Today
      };

      // The feature expires at the end of the day, so it's not expired yet
      expect(isExpired(flag)).toBe(false);
    });
  });

  describe('formatExpirationDate', () => {
    it('should format dates in a human-readable format', () => {
      expect(formatExpirationDate('2025-01-01')).toBe('January 1, 2025');
      expect(formatExpirationDate('2025-12-31')).toBe('December 31, 2025');
      expect(formatExpirationDate('2025-06-04')).toBe('June 4, 2025');
    });

    it('should handle month names correctly', () => {
      expect(formatExpirationDate('2025-01-15')).toBe('January 15, 2025');
      expect(formatExpirationDate('2025-02-15')).toBe('February 15, 2025');
      expect(formatExpirationDate('2025-03-15')).toBe('March 15, 2025');
      expect(formatExpirationDate('2025-04-15')).toBe('April 15, 2025');
      expect(formatExpirationDate('2025-05-15')).toBe('May 15, 2025');
      expect(formatExpirationDate('2025-06-15')).toBe('June 15, 2025');
      expect(formatExpirationDate('2025-07-15')).toBe('July 15, 2025');
      expect(formatExpirationDate('2025-08-15')).toBe('August 15, 2025');
      expect(formatExpirationDate('2025-09-15')).toBe('September 15, 2025');
      expect(formatExpirationDate('2025-10-15')).toBe('October 15, 2025');
      expect(formatExpirationDate('2025-11-15')).toBe('November 15, 2025');
      expect(formatExpirationDate('2025-12-15')).toBe('December 15, 2025');
    });
  });
});
