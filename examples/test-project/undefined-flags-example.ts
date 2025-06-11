/**
 * Undefined Feature Flags Example - ESLint errors expected
 * This file demonstrates usage of undefined feature flags that should be detected
 * by the no-undefined-feature-flags rule
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag } from './feature-flags.helpers';

/**
 * Component demonstrating undefined feature flag usage
 * This showcases various ways that undefined feature flags might be used,
 * which ESLint should detect.
 * 
 * Note: TypeScript might catch some of these at compile time due to the
 * strong typing in our example, but the ESLint rule works for JavaScript
 * files where typing isn't enforced.
 */
export function UndefinedFlagsComponent() {
  // ESLint will flag these cases when the no-undefined-feature-flags rule is enabled
  
  // Should report undefined flag due to typo
  const newHompage = getFeatureFlag('new-hompage');
  
  // Should report completely undefined flag
  const betaFeature = getFeatureFlag('beta-feature');
  
  // Should report undefined flag with similar name
  const darkMode = isFeatureEnabled('dark-mod');
  
  // Should report undefined flag for wrong case usage
  const experimentalSearch = getFeatureFlag('Experimental-Search');
  
  // These are valid flags - no errors expected from ESLint
  // Valid flag that exists
  const validHomepage = getFeatureFlag('new-homepage');
  
  // Valid flag that exists
  const validDarkMode = isFeatureEnabled('dark-mode');
  
  // Valid flag that exists
  const validSearch = checkFlag('experimental-search');
  
  return {
    // Undefined flags
    typoFlag: newHompage,
    undefinedFlag: betaFeature,
    similarFlag: darkMode,
    wrongCaseFlag: experimentalSearch,
    
    // Valid flags
    validHomepage,
    validDarkMode,
    validSearch,
  };
}

/**
 * Function with mixed valid and invalid flag usage in different contexts
 */
export function MixedFlagUsageExample() {
  // Complex expression with valid and invalid flags
  const features = {
    // Valid flags
    // getFeatureFlag - valid flag that exists
    homepage: getFeatureFlag('new-homepage'),
    // isFeatureEnabled - valid flag that exists
    darkMode: isFeatureEnabled('dark-mode'),
    
    // Invalid flags (TypeScript would catch these, but ESLint should too)
    // getFeatureFlag - should report completely undefined flag
    beta: getFeatureFlag('beta-feature'),
    // checkFlag - should report undefined flag
    premium: checkFlag('premium-features'),
  };
  
  // Function arguments with valid and invalid flags
  function enableFeatures(f1: boolean, f2: boolean) {
    return f1 || f2;
  }
  
  // Valid and invalid flags as function arguments
  const enabled = enableFeatures(
    // Valid flag that exists
    getFeatureFlag('new-homepage'),
    // Should report undefined flag
    getFeatureFlag('analytics-tracking')
  );
  
  return { features, enabled };
}

// Example usage
console.log('Using undefined flags:', UndefinedFlagsComponent());
