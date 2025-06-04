import { getFeatureFlag } from './helpers.js';

// This file contains a legacy/expired feature flag to test ESLint rule
export function someFunction() {
  // This should trigger an error since 'legacy-feature' has expired
  const enabled = getFeatureFlag('legacy-feature');
  
  if (enabled) {
    console.log('Feature is enabled!');
  } else {
    console.log('Feature is disabled!');
  }
}

someFunction()