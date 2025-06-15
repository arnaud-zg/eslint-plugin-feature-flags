/** Type definition for feature flags */
export type FeatureFlags = {
  /**
   * @deprecated UI v1 is deprecated in favor of UI v2 - Use enable-ui-v2 instead
   * @owner @team-ui
   * @expires 2025-01-01
   * @context Gradual rollout of new UI components to measure performance impact
   */
  'enable-ui-v1': boolean;

  /**
   * @owner @team-ui
   * @expires 2025-12-31
   * @context New UI version with improved performance and accessibility
   */
  'enable-ui-v2': boolean;

  /**
   * @owner @team-features
   * @expires 2025-12-31
   * @context A/B testing of new beta features for power users
   */
  'enable-beta-feature': boolean;

  /**
   * @owner @team-ui
   * @expires 2026-06-30
   * @context Dark mode support based on user preferences
   */
  'enable-dark-mode': boolean;

  /**
   * @owner @team-analytics
   * @expires 2026-01-15
   * @context Gradual rollout of enhanced analytics tracking
   */
  'enable-analytics': boolean;
};

/** Map of feature flags and their status */
export const FLAGS: FeatureFlags = {
  'enable-ui-v1': true,     // Deprecated: Will be removed after 2025-01-01
  'enable-ui-v2': false,    // New UI: Gradual rollout until 2025-12-31
  'enable-beta-feature': false,
  'enable-dark-mode': false,
  'enable-analytics': false,
};
