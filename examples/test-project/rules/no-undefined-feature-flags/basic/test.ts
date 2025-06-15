// Basic tests for undefined feature flags
import { getFeatureFlag, isFeatureEnabled } from '../../../shared/feature-flags';

// VALID FLAGS - Should NOT trigger the rule
if (isFeatureEnabled('enable-ui-v1')) {
  console.log('Legacy UI enabled');
}

// UNDEFINED FLAGS - Should trigger the rule
if (getFeatureFlag('enable-non-existent-feature')) {
  console.log('This flag does not exist in our configuration');
}

const invalidFlag = isFeatureEnabled('enable-unknown-feature');

// TERNARY WITH UNDEFINED FLAG
const result = getFeatureFlag('enable-another-undefined-feature') ? 'A' : 'B';

// LOGICAL EXPRESSIONS WITH UNDEFINED FLAGS
getFeatureFlag('enable-missing-feature') && doSomething();
isFeatureEnabled('enable-not-defined-feature') || useFallback();

function doSomething() {
  console.log('Doing something');
}

function useFallback() {
  console.log('Using fallback');
}
