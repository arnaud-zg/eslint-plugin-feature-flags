import { FeatureFlag } from '@eslint-plugin-feature-flags/types';

/**
 * Determines if a feature flag has expired by comparing its expiration date to today
 */
export const isExpired = (flag: FeatureFlag): boolean => {
  const expiryDate = new Date(flag.expiresOn);
  const today = new Date();

  return expiryDate < today;
};

/**
 * Formats a date string into a human-readable format for error messages
 */
export const formatExpirationDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
