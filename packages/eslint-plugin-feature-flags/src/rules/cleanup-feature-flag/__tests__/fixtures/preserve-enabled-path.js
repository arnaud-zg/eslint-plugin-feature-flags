/**
 * Tests cleanup with preserve-enabled-path strategy
 * Keep code in enabled branch, remove disabled branch
 */
import { getFeatureFlag, isFeatureEnabled } from './helpers';

// Basic if statement
function simpleIf() {
  if (getFeatureFlag('enable-ui-v1')) {
    console.log('Keep this branch');
  } else {
    console.log('Remove this branch');
  }
}

// Nested conditions
function nestedIf() {
  if (getFeatureFlag('enable-ui-v1')) {
    // Keep this block
    if (someOtherCondition) {
      doSomething();
    } else {
      doSomethingElse();
    }
  } else {
    // Remove this block
    fallback();
  }
}

// Ternary expressions
const result1 = isFeatureEnabled('enable-ui-v1') ? 'keep' : 'remove';
const result2 = getFeatureFlag('enable-ui-v1')
  ? complexFunction()  // keep
  : fallbackFunction(); // remove

// Logical expressions
getFeatureFlag('enable-ui-v1') && doSomething(); // keep right side
getFeatureFlag('enable-ui-v1') || useFallback(); // remove all

// Multiple occurrences
function multipleUsages() {
  if (getFeatureFlag('enable-ui-v1')) {
    enableFeature(); // keep
  } else {
    disableFeature(); // remove
  }
  
  const config = {
    enabled: getFeatureFlag('enable-ui-v1'),
    type: isFeatureEnabled('enable-ui-v1') ? 'keep' : 'remove'
  };
}

// Helper functions
function enableFeature() { console.log('Enabled'); }
function disableFeature() { console.log('Disabled'); }
function useFallback() { console.log('Fallback'); }
function doSomething() { console.log('Doing something'); }
function doSomethingElse() { console.log('Doing something else'); }
function complexFunction() { return 'complex'; }
function fallbackFunction() { return 'fallback'; }
