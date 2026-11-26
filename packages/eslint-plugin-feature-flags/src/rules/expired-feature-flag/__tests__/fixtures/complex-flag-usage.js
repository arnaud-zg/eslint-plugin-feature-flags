// Edge cases and complex scenarios for expired feature flags
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction } from './helpers.js';

// Dynamic flag selection
function dynamicFlagSelection() {
  const flagNames = [
    'enable-ui-v1',
    'enable-ui-v2',
    'enable-dark-mode',
    'enable-analytics'
  ];
  
  flagNames.forEach(name => {
    console.log(`Flag ${name}: ${getFeatureFlag(name)}`);
  });
  
  // Variable references
  const activeFlagName = 'enable-ui-v1';
  const expiredFlagName = 'enable-ui-v1';
  
  getFeatureFlag(activeFlagName);
  getFeatureFlag(expiredFlagName);
}

// Custom function wrapper
function withFeatureFlag(name, callback) {
  if (getFeatureFlag(name)) {
    return callback();
  }
  return null;
}

// Using the wrapper function
const result1 = withFeatureFlag('enable-ui-v1', () => 'Valid flag');
const result2 = withFeatureFlag('enable-ui-v1', () => 'Expired flag');

// Complex data structures
function complexDataStructures() {
  // Nested config object
  const config = {
    features: {
      ui: {
        enabled: getFeatureFlag('enable-ui-v1'),
        legacy: getFeatureFlag('enable-ui-v1')
      },
      api: {
        useNewEndpoint: isFeatureEnabled('current-feature'),
        fallbackToOld: isFeatureEnabled('enable-dashboard-v1')
      }
    }
  };
  
  // Array of configurations
  const featuresList = [
    { name: 'UI v1', enabled: getFeatureFlag('enable-ui-v1') },
    { name: 'UI v2', enabled: getFeatureFlag('enable-ui-v2') },
    { name: 'Dark Mode', enabled: getFeatureFlag('enable-dark-mode') },
    { name: 'Analytics', enabled: getFeatureFlag('enable-analytics') }
  ];
  
  return { config, featuresList };
}

// Programmatic flag names
function programmaticFlagNames() {
  const prefix = 'enable-';
  
  // Dynamic flag names
  const validFlag = getFeatureFlag(prefix + 'ui-v2');  // Active flag
  const expiredFlag = getFeatureFlag(prefix + 'ui-v1'); // Expired flag
  
  // Static flag names
  const definitelyValid = isFeatureEnabled('enable-ui-v2');
  const definitelyExpired = isFeatureEnabled('enable-ui-v1');
}

// Export for reuse in tests
export {
  dynamicFlagSelection,
  withFeatureFlag,
  complexDataStructures,
  programmaticFlagNames
};
