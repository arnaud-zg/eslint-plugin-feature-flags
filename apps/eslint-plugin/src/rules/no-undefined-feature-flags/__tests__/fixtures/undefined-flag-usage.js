/**
 * This file demonstrates cases where undefined feature flags are used in function calls,
 * which should be detected by the no-undefined-feature-flags rule.
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag } from './helpers.js';

// Basic cases - direct function calls with string literals
const newDashboard = getFeatureFlag('new-dashboard');  // Error: undefined flag
const darkTheme = isFeatureEnabled('dark-theme');      // Error: undefined flag
const betaFeature = checkFlag('enable-beta-feature');         // Error: undefined flag

// Common typos/mistakes
const typo = getFeatureFlag('new-hompage');            // Error: typo in flag name (missing 'e')
const wrongCase = getFeatureFlag('enable-dark-mode');         // Error: wrong case (should be 'enable-dark-mode')
const extraSpaces = getFeatureFlag(' new-homepage ');  // Error: extra spaces

// Template literals
const flagName = 'undefined-flag';
const templateLiteral = getFeatureFlag(`${flagName}`); // Error: undefined flag in template literal

// Variable passed to function
function checkFeatureWithVariable(flagName) {
  return getFeatureFlag(flagName);  // Cannot be statically analyzed
}
checkFeatureWithVariable('use-another-undefined-flag');   // Runtime error, but not detected by ESLint

// Multiple flags in different contexts
function multipleFlags() {
  if (getFeatureFlag('feature-a')) {                  // Valid: defined flag
    console.log(getFeatureFlag('use-undefined-feature')); // Error: undefined flag
  }
}
