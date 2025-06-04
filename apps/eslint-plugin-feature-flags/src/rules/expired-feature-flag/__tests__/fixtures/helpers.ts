/**
 * Helper functions for feature flag test fixtures.
 * These are dummy implementations just to satisfy TypeScript type checking.
 * The actual ESLint rule will only check for usage patterns, not execution.
 */

/**
 * Get the state of a feature flag
 * @param flagName The name of the feature flag to check
 * @returns Whether the flag is enabled
 */
export function getFeatureFlag(flagName: string): boolean {
  return Boolean(flagName); // Use flagName to satisfy type checking
}

/**
 * Check if a feature is enabled
 * @param flagName The name of the feature flag to check
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(flagName: string): boolean {
  return getFeatureFlag(flagName);
}

/**
 * Custom function to check feature flags
 * @param flagName The name of the feature flag to check
 * @returns Whether the feature is enabled
 */
export function customFlagFunction(flagName: string): boolean {
  return getFeatureFlag(flagName);
}
