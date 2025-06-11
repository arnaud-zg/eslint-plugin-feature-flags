/** Utility functions for accessing feature flags */
import { FeatureFlags, FLAGS } from "./feature-flags.init";

/** Get the value of a feature flag */
export function getFeatureFlag<T extends keyof FeatureFlags>(name: T): boolean {
  return FLAGS[name] || false;
}

/** Check if a feature is enabled */
export function isFeatureEnabled<T extends keyof FeatureFlags>(name: T): boolean {
  return getFeatureFlag(name) === true;
}

/** Alternative method to check if a flag is enabled */
export function checkFlag<T extends keyof FeatureFlags>(name: T): boolean {
  return getFeatureFlag(name);
}
