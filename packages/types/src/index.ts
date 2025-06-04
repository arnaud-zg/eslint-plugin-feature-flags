/**
 * Feature flag configuration from ESLint settings
 */
export interface FeatureFlagDefinition {
  /** When the flag should expire (YYYY-MM-DD format) */
  expires: string;
  /** Optional description of what the flag is for */
  description?: string;
}

/**
 * Internal representation of a feature flag with normalized fields
 */
export interface FeatureFlag {
  /** The name/key of the flag */
  name: string;
  /** Description of what the flag is for */
  description: string;
  /** Default value if not specified */
  defaultValue: boolean;
  /** When the flag should expire (YYYY-MM-DD format) */
  expiresOn: string;
}

/** Map of feature flag names to their definitions */
export type FeatureFlagsConfig = Record<string, FeatureFlagDefinition>;
