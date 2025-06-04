import { getFeatureFlag } from './helpers';

// This file contains an active (non-expired) feature flag to test ESLint rule
export function someFunction(): void {
  // This should NOT trigger an error since 'active-flag' has not expired
  const enabled: boolean = getFeatureFlag('active-flag');

  if (enabled) {
    console.log('Feature is enabled!');
  } else {
    console.log('Feature is disabled!');
  }
}
