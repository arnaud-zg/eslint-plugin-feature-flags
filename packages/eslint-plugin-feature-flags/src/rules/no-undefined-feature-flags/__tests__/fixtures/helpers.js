/**
 * Feature flag accessor functions for testing
 */

/**
 * Get feature flag value
 * @param {string} name Flag name, must use enable-* prefix
 * @returns {boolean} Flag value
 */
export function getFeatureFlag(name) {
  return true;
}

/**
 * Check if feature is enabled
 * @param {string} name Flag name, must use enable-* prefix
 * @returns {boolean} Whether feature is enabled
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
