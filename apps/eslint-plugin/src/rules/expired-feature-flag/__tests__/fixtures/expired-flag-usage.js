/**
 * Tests expired feature flag detection
 * Current date: June 15, 2025
 * 
 * Flags:
 * - enable-ui-v1 (expired Jan 1, 2025)
 * - enable-ui-v2 (active)
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction, getFeatureConfig } from './helpers.js';

// Basic usage
const uiV1 = getFeatureFlag('enable-ui-v1'); // expired
const oldUi = isFeatureEnabled('enable-ui-v1'); // expired
const legacyConfig = getFeatureConfig('enable-ui-v1'); // expired

// Status checks
const expiredStatus = {
  enabled: isFeatureEnabled('enable-ui-v1'), // expired
  config: getFeatureConfig('enable-ui-v1') // expired
};

// Conditional logic
function conditionalFeatureUsage() {
  if (getFeatureFlag('enable-ui-v1')) { // expired
    console.log('Using UI v1');
  } else if (isFeatureEnabled('enable-ui-v1')) { // expired
    console.log('Using UI v1');
  }

  if (isFeatureEnabled('enable-ui-v1')) { // expired
    if (checkFlag('enable-ui-v1')) { // expired
      console.log('Using UI v1');
    }
  }
}

// Different contexts
function differentContexts() {
  const [feature1, feature2] = [
    getFeatureFlag('enable-ui-v1'), // expired
    getFeatureFlag('enable-ui-v2'), // active
  ];
  
  const features = {
    legacy: getFeatureFlag('enable-ui-v1'), // expired
    current: isFeatureEnabled('enable-ui-v2'), // active
    dark: isFeatureEnabled('enable-dark-mode') // active
  };
}

// Export for reuse in tests
export {
  conditionalFeatureUsage,
  differentContexts
};