/**
 * Mixed example - JavaScript file demonstrating both valid and expired feature flags
 * This file is intentionally kept as JavaScript to show the plugin works with both JS and TS
 */
import { getFeatureFlag, isFeatureEnabled } from './feature-flags.helpers';

/**
 * Function demonstrating mixed feature flag usage
 * @returns {Object} Configuration object with various feature settings
 */
export function MixedExample() {
  // Valid non-expired flags
  const enableNewHomepage = getFeatureFlag('new-homepage');
  const useDarkMode = isFeatureEnabled('dark-mode');
  
  // Expired flag that should trigger ESLint errors
  const useLegacyFeature = getFeatureFlag('legacy-feature');
  
  // Different patterns of feature flag usage
  const features = {
    // Valid flags
    newHome: enableNewHomepage,
    darkMode: useDarkMode,
    // Object property with expired flag - should trigger error
    legacy: useLegacyFeature
  };
  
  return {
    enabledFeatures: features,
    shouldShowLegacyUi: useLegacyFeature,
    preferredTheme: useDarkMode ? 'dark' : 'light'
  };
}

console.log('Mixed example configuration:', MixedExample());
