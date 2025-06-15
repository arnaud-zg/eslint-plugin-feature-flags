import { FeatureFlags, FLAGS } from "./feature-flags.init";

export function getFeatureFlag(flagName: keyof FeatureFlags): boolean {
  return FLAGS[flagName] || false;
}

export function isFeatureEnabled(flagName: keyof FeatureFlags): boolean {
  return getFeatureFlag(flagName);
}
