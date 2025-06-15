// Examples of active (non-expired) feature flag usages
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction, getFeatureConfig } from './helpers.js';

// Direct function calls with string literals
const homepage = getFeatureFlag('enable-active-feature');
const darkMode = isFeatureEnabled('enable-current-feature');
const featureA = checkFlag('enable-new-feature');
const customFlag = customFlagFunction('enable-supported-feature');

// Various function calls with the same active flags
const featureConfig = getFeatureConfig('enable-active-feature');
const darkModeStatus = {
  enabled: isFeatureEnabled('enable-current-feature'),
  config: getFeatureConfig('enable-current-feature')
};

// Template literals with active flags
const flagName = 'enable-new-feature';
const templateLiteral = getFeatureFlag(`${flagName}`);

// Multiple flags in conditional logic
function conditionalFeatureUsage() {
  if (getFeatureFlag('enable-active-feature')) {
    console.log('Using active flag');
  } else if (isFeatureEnabled('enable-current-feature')) {
    console.log('Using current feature');
  }

  // Nested conditionals
  if (isFeatureEnabled('enable-new-feature')) {
    if (checkFlag('enable-supported-feature')) {
      console.log('Both features are active');
    }
  }

  return customFlagFunction('enable-active-feature');
}

// Active flags in various contexts
function differentContexts() {
  // Array destructuring
  const [feature1, feature2] = [
    getFeatureFlag('enable-active-feature'),
    getFeatureFlag('enable-current-feature'),
  ];
  
  // Object properties
  const features = {
    homepage: getFeatureFlag('enable-active-feature'),
    darkMode: isFeatureEnabled('enable-current-feature')
  };
  
  // Function arguments
  processFeatures(
    getFeatureFlag('enable-new-feature'),
    isFeatureEnabled('enable-active-feature'),
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
