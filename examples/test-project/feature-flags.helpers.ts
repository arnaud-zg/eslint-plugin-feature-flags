/**
 * Utility functions for accessing feature flags
 */
import { FeatureFlags, FLAGS } from "./feature-flags.init";

/**
 * Get the value of a feature flag
 * @param name - The name of the feature flag
 * @returns The value of the feature flag
 */
export function getFeatureFlag<T extends keyof FeatureFlags>(name: T): boolean {
  return FLAGS[name] || false;
}

/**
 * Check if a feature is enabled
 * @param name - The name of the feature flag
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled<T extends keyof FeatureFlags>(name: T): boolean {
  return getFeatureFlag(name) === true;
}
