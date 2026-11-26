/**
 * This file demonstrates cases where defined feature flags are used in function calls,
 * which should NOT trigger errors from the no-undefined-feature-flags rule.
 */
import { getFeatureFlag, isFeatureEnabled, checkFlag, getFeatureConfig } from './helpers.js';

// Basic cases - direct function calls with string literals
const homepage = getFeatureFlag('new-homepage');      // Valid: defined flag
const darkMode = isFeatureEnabled('enable-dark-mode');       // Valid: defined flag
const featureA = checkFlag('feature-a');              // Valid: defined flag

// Different function calls with the same flags
const darkModeConfig = getFeatureConfig('enable-dark-mode'); // Valid: defined flag
const homepageStatus = {
  enabled: isFeatureEnabled('new-homepage'),          // Valid: defined flag
  config: getFeatureConfig('new-homepage')            // Valid: defined flag
};

// With template literals
const flagName = 'feature-a';
const templateLiteral = getFeatureFlag(`${flagName}`); // Valid: defined flag

// Multiple flags in conditional logic
function conditionalFeatureUsage() {
  if (getFeatureFlag('new-homepage')) {
    enableNewHomepage();
  } else if (isFeatureEnabled('enable-dark-mode')) {
    enableDarkMode();
  }
}

// Helper functions (not actually implemented)
function enableNewHomepage() {
  console.log('New homepage enabled');
}

function enableDarkMode() {
  console.log('Dark mode enabled');
}