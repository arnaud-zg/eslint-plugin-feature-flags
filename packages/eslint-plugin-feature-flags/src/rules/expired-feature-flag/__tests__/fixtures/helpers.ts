// Helper functions for feature flag test fixtures

export function getFeatureFlag(flagName: string): boolean {
  return Boolean(flagName); // Just to satisfy type checking, not real implementation
}

export function isFeatureEnabled(flagName: string): boolean {
  return getFeatureFlag(flagName);
}

export function customFlagFunction(flagName: string): boolean {
  return getFeatureFlag(flagName);
}

export function checkFlag(flagName: string): boolean {
  return getFeatureFlag(flagName);
}
export function getFeatureConfig(flagName: string): {
  enabled: boolean;
  name: string;
} {
  return {
    enabled: getFeatureFlag(flagName),
    name: flagName
  };
}
