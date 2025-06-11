import { FeatureFlag } from '@eslint-plugin-feature-flags/types';

/** Checks if a feature flag has expired */
export const isExpired = (flag: FeatureFlag): boolean => {
  const expiryDate = new Date(flag.expiresOn);
  const today = new Date();

  return expiryDate < today;
};

/** Formats a date string into a human-readable format */
export const formatExpirationDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
