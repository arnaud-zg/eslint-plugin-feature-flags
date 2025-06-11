// Examples of expired feature flag usages that should trigger ESLint errors
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction, getFeatureConfig } from './helpers.js';

// Direct function calls with string literals
const legacyFeature = getFeatureFlag('legacy-feature');
const oldUi = isFeatureEnabled('expired-flag');
const deprecatedFeature = checkFlag('deprecated-feature');
const oldFlag = customFlagFunction('old-flag');

// Various function calls with the same expired flags
const legacyConfig = getFeatureConfig('legacy-feature');
const expiredStatus = {
  enabled: isFeatureEnabled('expired-flag'),
  config: getFeatureConfig('expired-flag')
};

// Template literals with expired flags
const flagName = 'legacy-feature';
const templateLiteral = getFeatureFlag(`${flagName}`);

// Expired flags in conditional logic
function conditionalFeatureUsage() {
  if (getFeatureFlag('legacy-feature')) {
    console.log('Using legacy feature');
  } else if (isFeatureEnabled('expired-flag')) {
    console.log('Using expired flag');
  }

  // Nested conditions with expired flags
  if (isFeatureEnabled('deprecated-feature')) {
    if (checkFlag('old-flag')) {
      console.log('Both features are expired');
    }
  }

  return customFlagFunction('legacy-feature');             // Error: expired flag
}

// Expired flags in various contexts
function differentContexts() {
  // Array destructuring
  const [feature1, feature2] = [
    getFeatureFlag('legacy-feature'),
    getFeatureFlag('deprecated-feature'),
  ];
  
  // Object properties
  const features = {
    legacy: getFeatureFlag('legacy-feature'),
    deprecated: isFeatureEnabled('expired-flag')
  };
  
  // Function arguments
  processFeatures(
    getFeatureFlag('deprecated-feature'),
    isFeatureEnabled('old-flag'),
    'static-value'
  );
}

// Helper function (not implemented)
function processFeatures(arg1, arg2, arg3) {
  console.log(arg1, arg2, arg3);
}

// Export for reuse in tests
export {
  conditionalFeatureUsage,
  differentContexts
};