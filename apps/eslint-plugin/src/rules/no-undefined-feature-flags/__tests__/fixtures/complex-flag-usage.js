/**
 * This file demonstrates complex scenarios and edge cases for feature flag usage
 * with mixed valid and invalid flags.
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag } from './helpers.js';

// Dynamic flag selection - flags selected at runtime won't be detected by static analysis
function dynamicFlagSelection() {
  const flagNames = ['new-homepage', 'dark-mode', 'unknown-flag'];
  
  flagNames.forEach(name => {
    // Only 'unknown-flag' should trigger an error, but dynamic detection is limited
    console.log(`Flag ${name}: ${getFeatureFlag(name)}`);
  });
}

// Different contexts for flag usage
function differentContexts() {
  // In array destructuring
  const [feature1, feature2] = [
    getFeatureFlag('feature-a'),       // Valid
    getFeatureFlag('nonexistent'),     // Error: undefined flag
  ];
  
  // In object properties
  const features = {
    valid: getFeatureFlag('new-homepage'),        // Valid
    invalid: getFeatureFlag('unpublished-feature') // Error: undefined flag
  };
  
  // In function arguments
  someFunction(
    getFeatureFlag('dark-mode'),        // Valid
    getFeatureFlag('missing-feature'),  // Error: undefined flag
    'static-value'
  );
}

// Custom function wrapper that calls feature flag functions
function withFeatureFlag(name, callback) {
  if (getFeatureFlag(name)) {    // This line is checked by the rule
    return callback();
  }
  return null;
}

// Using the wrapper function
const result1 = withFeatureFlag('new-homepage', () => 'Valid flag');   // Valid
const result2 = withFeatureFlag('beta-feature', () => 'Invalid flag'); // Error: undefined flag

// Helper function (not implemented)
function someFunction(arg1, arg2, arg3) {
  console.log(arg1, arg2, arg3);
}

// Export for reuse in tests
export {
  dynamicFlagSelection,
  differentContexts,
  withFeatureFlag
};
