/**
 * Tests undefined feature flag detection
 * 
 * Valid flags:
 * - enable-homepage
 * - enable-dark-mode
 * - enable-feature-a
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag, getFeatureConfig } from './helpers.js';

// Check mixed valid and invalid flag usage
function mixedFlagUsage() {
  // Valid flags 
  const validFlags = [
    getFeatureFlag('enable-homepage'),
    getFeatureFlag('enable-dark-mode'),
    getFeatureFlag('enable-feature-a'),
  ];

  // Invalid flags
  const invalidFlags = [
    getFeatureFlag('enable-test'),     // undefined
    getFeatureFlag('enable-search'),   // undefined
    getFeatureFlag('enable-checkout'), // undefined
  ];

  return { validFlags, invalidFlags };
}

// Check nested and complex expressions
function complexExpressions() {
  const result = compute(getFeatureFlag('enable-premium')); // undefined
  
  const display = getFeatureFlag('enable-new-ui')    // undefined
    ? 'new' 
    : getFeatureFlag('enable-legacy-ui')  // undefined
      ? 'legacy' 
      : 'default';
  
  return { result, display };
}

function compute(value) {
  return value ? 'enabled' : 'disabled';
}
