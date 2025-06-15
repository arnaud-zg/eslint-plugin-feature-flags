/**
 * Test fixtures for expired feature flags
 * Current date: June 15, 2025
 * 
 * Test scenarios:
 * 1. Expired flag detection (enable-ui-v1 expired on Jan 1, 2025)
 * 2. Active flag validation (enable-beta-feature expires Dec 31, 2025)
 * 3. Multiple accessor functions (getFeatureFlag, isFeatureEnabled)
 */
import { getFeatureFlag, isFeatureEnabled } from '../../../shared/feature-flags';

// SECTION: EXPIRED FLAGS (Should trigger rule)

// Scenario 1: Basic if statement with expired flag
if (getFeatureFlag('enable-ui-v1')) { // Error: expired Jan 1, 2025
  console.log('Using deprecated UI v1');
}

// Scenario 2: Alternative accessor function
const isV1Enabled = isFeatureEnabled('enable-ui-v1'); // Error: expired Jan 1, 2025
console.log(`V1 enabled: ${isV1Enabled}`);

// Scenario 3: Ternary operator
const theme = getFeatureFlag('enable-ui-v1') ? 'v1' : 'v2'; // Error: expired Jan 1, 2025

// Scenario 4: Logical expressions
getFeatureFlag('enable-ui-v1') && enableV1Features(); // Error: expired Jan 1, 2025
isFeatureEnabled('enable-ui-v1') || fallbackToV2(); // Error: expired Jan 1, 2025

// SECTION: ACTIVE FLAGS (Should NOT trigger rule)

// Scenario 5: Valid flag in if statement
if (isFeatureEnabled('enable-beta-feature')) { // Valid: expires Dec 31, 2025
  enableBetaFeatures();
}


// Scenario 6: Multiple valid flag accessors
const darkMode = isFeatureEnabled('enable-dark-mode'); // Valid: expires June 30, 2026
const analytics = getFeatureFlag('enable-analytics'); // Valid: expires Jan 15, 2026

// Helper functions
function enableV1Features() {
  console.log('Using UI v1');
}

function fallbackToV2() {
  console.log('Using UI v2');
}

function enableBetaFeatures() {
  console.log('Beta features enabled');
}
