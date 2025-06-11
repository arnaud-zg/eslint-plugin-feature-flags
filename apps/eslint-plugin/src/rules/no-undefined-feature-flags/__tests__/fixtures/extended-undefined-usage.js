/**
 * This file demonstrates complex/advanced scenarios for feature flag usage
 * that should be detected by the no-undefined-feature-flags rule.
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag, getFeatureConfig } from './helpers.js';

// Function with mixed valid and invalid flags
function mixedFlagUsage() {
  // Valid flags
  const validFlags = [
    getFeatureFlag('new-homepage'),  // Valid
    getFeatureFlag('dark-mode'),     // Valid
    getFeatureFlag('feature-a'),     // Valid
  ];

  // Invalid flags
  const invalidFlags = [
    getFeatureFlag('experimental'),    // Error: undefined flag
    getFeatureFlag('advanced-search'), // Error: undefined flag
    getFeatureFlag('new-checkout'),    // Error: undefined flag
  ];

  return { validFlags, invalidFlags };
}

// Usage in complex expressions
function complexExpressions() {
  // Nested function calls with undefined flags
  const result = compute(getFeatureFlag('premium-feature')); // Error: undefined flag
  
  // Conditional (ternary) expressions
  const display = getFeatureFlag('new-design')  // Error: undefined flag
    ? 'new' 
    : getFeatureFlag('legacy-mode')  // Error: undefined flag
      ? 'legacy' 
      : 'default';
  
  return { result, display };
}

// Helper function
function compute(value) {
  return value ? 'enabled' : 'disabled';
}
