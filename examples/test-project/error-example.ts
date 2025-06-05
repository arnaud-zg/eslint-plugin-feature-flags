/**
 * Error example - ESLint errors expected
 * This file demonstrates usage of expired feature flags that should be detected
 */
import { getFeatureFlag, isFeatureEnabled } from './feature-flags.helpers';

interface Configuration {
  checkout: string;
  hasLegacyFeature: boolean;
}

/**
 * Component demonstrating invalid feature flag usage
 */
export function ErrorComponent(): Configuration {
  // This should trigger an error since 'legacy-feature' has expired
  const useOldCheckout: boolean = getFeatureFlag('legacy-feature');
  
  // Multiple usages of the same expired flag
  if (isFeatureEnabled('legacy-feature')) {
    console.log('Using legacy feature');
  }
  
  // Usage in object property
  const config: Record<string, boolean> = {
    'legacy-feature': true
  };
  
  // Access with bracket notation
  const oldFeature: boolean = config['legacy-feature'];
  
  return {
    checkout: useOldCheckout ? 'legacy' : 'new',
    hasLegacyFeature: oldFeature
  };
}

// Example usage
console.log('Configuration with deprecated features:', ErrorComponent());
