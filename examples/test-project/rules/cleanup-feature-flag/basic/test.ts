// Test cases for feature flag cleanup strategies:
// 1. preserve-enabled-path: Keep "then" branch (enable-ui-v1)
// 2. preserve-disabled-path: Keep "else" branch (enable-beta-feature)
// 3. remove-entirely: Remove flag-related code (enable-dark-mode)
import { getFeatureFlag, isFeatureEnabled } from '../../../shared/feature-flags';

// Strategy: preserve-enabled-path (enable-ui-v1)
// Before cleanup:
if (isFeatureEnabled('enable-ui-v1')) {
  console.log('Using UI v1');
} else {
  console.log('Using old UI');
}

// Before cleanup:
const uiVersion = getFeatureFlag('enable-ui-v1') ? 'v1' : 'legacy';

// Before cleanup:
isFeatureEnabled('enable-ui-v1') && showV1Features();
!isFeatureEnabled('enable-ui-v1') || hideV1Features();

// Strategy: preserve-disabled-path (enable-beta-feature)
// Before cleanup:
if (getFeatureFlag('enable-beta-feature')) {
  enableV2Features();
} else {
  useDefaultFeatures();
}

// Before cleanup:
const featureSet = isFeatureEnabled('enable-beta-feature') ? 'enhanced' : 'standard';

// Strategy: remove-entirely (enable-dark-mode)
// Before cleanup:
if (getFeatureFlag('enable-dark-mode')) {
  applyDarkTheme();
}

// Before cleanup:
const theme = isFeatureEnabled('enable-dark-mode') ? 'dark' : 'light';

// Helper functions
function showV1Features() {
  console.log('Showing V1 features');
}

function hideV1Features() {
  console.log('Hiding V1 features');
}

function enableV2Features() {
  console.log('V2 features enabled');
}

function useDefaultFeatures() {
  console.log('Using default features');
}

function applyDarkTheme() {
  console.log('Dark theme applied');
}
