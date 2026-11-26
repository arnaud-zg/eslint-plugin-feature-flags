// Active (non-expired) feature flags in TypeScript
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction, getFeatureConfig } from './helpers';

// Direct function calls with string literals
export function standardFlagUsage(): void {
  
  const homepage: boolean = getFeatureFlag('active-flag');
  const darkMode: boolean = isFeatureEnabled('current-feature');
  const featureA: boolean = checkFlag('new-feature');
  const customFlag: boolean = customFlagFunction('supported-feature');

  // Using flags in conditional logic
  if (homepage) {
    console.log('Homepage feature is enabled!');
  } else if (darkMode) {
    console.log('Dark mode is enabled!');
  }

  // Multiple flag checks
  if (featureA && customFlag) {
    console.log('Both features are enabled!');
  }
}

// Different function calls and scenarios
export function advancedFlagUsage(): void {
  // With configuration objects
  const featureConfig = getFeatureConfig('active-flag');
  
  // With type annotations
  const features: Record<string, boolean> = {
    homepage: getFeatureFlag('active-flag'),
    darkMode: isFeatureEnabled('current-feature')
  };
  
  // With template literals (should still be detected as active)
  const flagName: string = 'new-feature';
  const dynamicFlag: boolean = getFeatureFlag(`${flagName}`);
  
  console.log(featureConfig, features, dynamicFlag);
}

// Complex type usage
export interface FeatureState {
  enabled: boolean;
  name: string;
  config?: Record<string, unknown>;
}

export function typedFeatureUsage(): FeatureState[] {
  return [
    {
      enabled: getFeatureFlag('active-flag'),
      name: 'Homepage'
    },
    {
      enabled: isFeatureEnabled('current-feature'),
      name: 'Dark Mode',
      config: {
        intensity: 0.8
      }
    }
  ];
}
