// Helper functions for feature flag test fixtures
export function getFeatureFlag(flagName) {
  return Boolean(flagName); // Just to satisfy type checking, not real implementation
}


export function isFeatureEnabled(flagName) {
  return getFeatureFlag(flagName);
}

/**
 * Custom function to check feature flags
 * @param {string} flagName - The name of the feature flag to check
 * @returns {boolean} Whether the feature is enabled
 */
export function customFlagFunction(flagName) {
  return getFeatureFlag(flagName);
}

/**
 * Alternative check function for feature flags
 * @param {string} flagName - The name of the feature flag to check
 * @returns {boolean} Whether the feature is enabled
 */
export function checkFlag(flagName) {
  return getFeatureFlag(flagName);
}

/**
 * Get the configuration for a feature flag
 * @param {string} flagName - The name of the feature flag
 * @returns {object} The feature flag configuration
 */
export function getFeatureConfig(flagName) {
  return {
    enabled: getFeatureFlag(flagName),
    name: flagName
  };
}
