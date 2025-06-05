/**
 * Success example - No ESLint errors expected
 * This file demonstrates valid usage of non-expired feature flags
 */
import { getFeatureFlag, isFeatureEnabled } from './feature-flags.helpers';

/**
 * Component demonstrating valid feature flag usage
 */
export function SuccessComponent(): {
  ui: string;
  theme: string;
  search: string;
} {
  // This should NOT trigger an error since 'new-homepage' hasn't expired
  const showNewUI: boolean = getFeatureFlag('new-homepage');
  
  // This should NOT trigger an error since 'dark-mode' hasn't expired
  const enableDarkMode: boolean = isFeatureEnabled('dark-mode');
  
  // This should NOT trigger an error since 'experimental-search' hasn't expired
  const useNewSearch: boolean = getFeatureFlag('experimental-search');
  
  return {
    ui: showNewUI ? 'new' : 'classic',
    theme: enableDarkMode ? 'dark' : 'light',
    search: useNewSearch ? 'experimental' : 'standard'
  };
}

// Example usage
console.log('UI Configuration:', SuccessComponent());
