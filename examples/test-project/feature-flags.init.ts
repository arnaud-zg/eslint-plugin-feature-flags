/** Type definition for feature flags */
export type FeatureFlags = {
  'new-homepage': boolean;
  'dark-mode': boolean;
  'legacy-feature': boolean;
  'experimental-search': boolean;
};

/** Map of feature flags and their status */
export const FLAGS: FeatureFlags = {
  'new-homepage': true,
  'dark-mode': false, 
  'legacy-feature': false,
  'experimental-search': true
};
