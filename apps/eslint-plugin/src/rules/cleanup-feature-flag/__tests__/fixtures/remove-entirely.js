// Examples of feature flags that should be completely removed
import { getFeatureFlag, isFeatureEnabled } from './helpers';

// Simple if statement
function simpleIf() {
  if (getFeatureFlag('enable-dark-mode')) {
    console.log('This entire if statement should be removed');
  }
}

// Nested if statements
function nestedIf() {
  if (getFeatureFlag('enable-dark-mode')) {
    if (someOtherCondition) {
      doSomething();
    } else {
      doSomethingElse();
    }
  }
}

// Ternary expressions
const result1 = isFeatureEnabled('enable-dark-mode') ? 'enabled' : 'disabled';
const result2 = getFeatureFlag('enable-dark-mode')
  ? complexFunction()
  : fallbackFunction();

// Logical expressions
getFeatureFlag('enable-dark-mode') && doSomething();
getFeatureFlag('enable-dark-mode') || useFallback();

// Multiple occurrences
function multipleUsages() {
  if (getFeatureFlag('enable-dark-mode')) {
    enableFeature();
  }
}

// Object property
const config = {
  enabled: getFeatureFlag('enable-dark-mode'),
  type: isFeatureEnabled('enable-dark-mode') ? 'new' : 'legacy'
};
