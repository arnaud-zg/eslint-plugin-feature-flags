// Examples of feature flags that should be cleaned up with preserve-disabled-path strategy
import { getFeatureFlag, isFeatureEnabled } from './helpers';

// Simple if statement
function simpleIf() {
  if (getFeatureFlag('enable-experimental-search')) {
    console.log('This code should be removed');
  } else {
    console.log('This code should be kept');
  }
}

// Nested if statements
function nestedIf() {
  if (getFeatureFlag('enable-experimental-search')) {
    doExperimental();
  } else {
    if (someOtherCondition) {
      doStandard();
    } else {
      doBasic();
    }
  }
}

// Ternary expressions
const result1 = isFeatureEnabled('enable-experimental-search') ? 'experimental' : 'standard';
const result2 = getFeatureFlag('enable-experimental-search')
  ? experimentalFunction()
  : standardFunction();

// Logical expressions
getFeatureFlag('enable-experimental-search') && doExperimental();
getFeatureFlag('enable-experimental-search') || useStandard();

// Multiple occurrences
function multipleUsages() {
  if (getFeatureFlag('enable-experimental-search')) {
    useExperimentalSearch();
  } else {
    useStandardSearch();
  }
  
  const config = {
    experimental: getFeatureFlag('enable-experimental-search'),
    type: isFeatureEnabled('enable-experimental-search') ? 'experimental' : 'standard'
  };
}
