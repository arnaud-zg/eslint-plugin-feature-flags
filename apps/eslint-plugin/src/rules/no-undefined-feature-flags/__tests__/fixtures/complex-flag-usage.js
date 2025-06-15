/**
 * Tests complex feature flag scenarios
 * 
 * Valid flags:
 * - enable-homepage (expires: 2025-12-31)
 * - enable-dark-mode (expires: 2025-06-30)
 * - enable-feature-a (expires: 2026-01-01)
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag } from './helpers.js';

// Dynamic flag selection
function dynamicFlagSelection() {
  const flagNames = [
    'enable-homepage',    // valid
    'enable-dark-mode',   // valid
    'enable-test'         // undefined
  ];
  
  flagNames.forEach(name => {
    console.log(`Flag ${name}: ${getFeatureFlag(name)}`);
  });
}

// Usage in different contexts
function differentContexts() {
  const [validFeature, invalidFeature] = [
    getFeatureFlag('enable-feature-a'),     // valid
    getFeatureFlag('enable-test-feature'),  // undefined
  ];
  
  const features = {
    homepage: getFeatureFlag('enable-homepage'),    // valid
    beta: getFeatureFlag('enable-beta')            // undefined
  };
  
  someFunction(
    getFeatureFlag('enable-dark-mode'),    // valid
    getFeatureFlag('enable-preview'),      // undefined
    'static-value'
  );
}

// Feature flag wrapper
function withFeatureFlag(name, callback) {
  if (getFeatureFlag(name)) {
    return callback();
  }
  return null;
}

// Wrapper usage
const result1 = withFeatureFlag('enable-homepage', () => 'valid');   
const result2 = withFeatureFlag('enable-beta', () => 'invalid'); 

function someFunction(...args) {
  console.log('Args:', args);
}

// Export for reuse in tests
export {
  dynamicFlagSelection,
  differentContexts,
  withFeatureFlag
};
