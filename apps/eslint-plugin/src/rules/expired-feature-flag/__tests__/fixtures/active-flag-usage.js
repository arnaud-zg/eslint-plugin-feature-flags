// Examples of active (non-expired) feature flag usages
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction, getFeatureConfig } from './helpers.js';

// Direct function calls with string literals
const homepage = getFeatureFlag('active-flag');
const darkMode = isFeatureEnabled('current-feature');
const featureA = checkFlag('new-feature');
const customFlag = customFlagFunction('supported-feature');

// Various function calls with the same active flags
const featureConfig = getFeatureConfig('active-flag');
const darkModeStatus = {
  enabled: isFeatureEnabled('current-feature'),
  config: getFeatureConfig('current-feature')
};

// Template literals with active flags
const flagName = 'new-feature';
const templateLiteral = getFeatureFlag(`${flagName}`);

// Multiple flags in conditional logic
function conditionalFeatureUsage() {
  if (getFeatureFlag('active-flag')) {
    console.log('Using active flag');
  } else if (isFeatureEnabled('current-feature')) {
    console.log('Using current feature');
  }

  // Nested conditionals
  if (isFeatureEnabled('new-feature')) {
    if (checkFlag('supported-feature')) {
      console.log('Both features are active');
    }
  }

  return customFlagFunction('active-flag');
}

// Active flags in various contexts
function differentContexts() {
  // Array destructuring
  const [feature1, feature2] = [
    getFeatureFlag('active-flag'),
    getFeatureFlag('current-feature'),
  ];
  
  // Object properties
  const features = {
    homepage: getFeatureFlag('active-flag'),
    darkMode: isFeatureEnabled('current-feature')
  };
  
  // Function arguments
  processFeatures(
    getFeatureFlag('new-feature'),
    isFeatureEnabled('active-flag'),
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
