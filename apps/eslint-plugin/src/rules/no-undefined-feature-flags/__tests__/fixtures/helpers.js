/**
 * Helper functions for feature flag testing
 * 
 * These functions simulate feature flag access mechanisms commonly used in applications.
 * In a real application, these would check against a configuration or external service.
 */

/**
 * Get the value of a feature flag
 * @param {string} name The name of the feature flag
 * @returns {boolean} The value of the feature flag
 */
export function getFeatureFlag(name) {
  console.log(`Checking feature flag: ${name}`);
  return true;
}

/**
 * Check if a feature is enabled
 * @param {string} name The name of the feature flag
 * @returns {boolean} Whether the feature is enabled
 */
export function isFeatureEnabled(name) {
  return getFeatureFlag(name);
}

/**
 * Alternative check for feature flags
 * @param {string} name The name of the feature flag
 * @returns {boolean} The value of the feature flag
 */
export function checkFlag(name) {
  return getFeatureFlag(name);
}

/**
 * Get a feature flag configuration
 * @param {string} name The name of the feature flag
 * @returns {Object} The feature flag configuration
 */
export function getFeatureConfig(name) {
  return {
    name,
    enabled: getFeatureFlag(name),
    description: `Description for ${name}`,
  };
}
