// Edge cases and complex scenarios for expired feature flags
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction } from './helpers.js';

// Dynamic flag selection
function dynamicFlagSelection() {
  const flagNames = [
    'active-flag',
    'legacy-feature',
    'expired-flag'
  ];
  
  flagNames.forEach(name => {
    console.log(`Flag ${name}: ${getFeatureFlag(name)}`);
  });
  
  // Variable references
  const activeFlagName = 'active-flag';
  const expiredFlagName = 'legacy-feature';
  
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
const result1 = withFeatureFlag('active-flag', () => 'Valid flag');
const result2 = withFeatureFlag('legacy-feature', () => 'Expired flag');

// Complex data structures
function complexDataStructures() {
  // Nested config object
  const config = {
    features: {
      ui: {
        enabled: getFeatureFlag('active-flag'),
        legacy: getFeatureFlag('legacy-feature')
      },
      api: {
        useNewEndpoint: isFeatureEnabled('current-feature'),
        fallbackToOld: isFeatureEnabled('expired-flag')
      }
    }
  };
  
  // Array of configurations
  const featuresList = [
    { name: 'Active Feature', enabled: getFeatureFlag('active-flag') },
    { name: 'Legacy Feature', enabled: getFeatureFlag('legacy-feature') },
    { name: 'New Feature', enabled: checkFlag('current-feature') },
    { name: 'Old Feature', enabled: checkFlag('deprecated-feature') }
  ];
  
  return { config, featuresList };
}

// Programmatic flag names
function programmaticFlagNames() {
  const prefix = 'feature-';
  
  // Dynamic flag names
  const validFlag = getFeatureFlag(prefix + 'new');
  const expiredFlag = getFeatureFlag(prefix + 'legacy');
  
  // Static flag names
  const definitelyValid = isFeatureEnabled('active-flag');
  const definitelyExpired = isFeatureEnabled('expired-flag');
  
  return { validFlag, expiredFlag, definitelyValid, definitelyExpired };
}

// Export for reuse in tests
export {
  dynamicFlagSelection,
  withFeatureFlag,
  complexDataStructures,
  programmaticFlagNames
};
