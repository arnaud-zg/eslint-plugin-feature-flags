// Multiple violations of expired feature flags in a single file
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction } from './helpers';
export function multipleViolations(): void {
  // Various function calls with expired flags
  const flag1: boolean = getFeatureFlag('expired-flag');

  // Object property
  const flags: Record<string, boolean> = {
    'expired-flag': true,
  };

  // Different accessor functions
  const flag2: boolean = isFeatureEnabled('expired-flag');
  const flag3: boolean = checkFlag('legacy-feature');
  const flag4: boolean = customFlagFunction('deprecated-feature');

  // Bracket notation
  const value: boolean = flags['expired-flag'];

  console.log(flag1, flag2, value, flag3, flag4);
}

// Expired flags in different contexts
export function violationsInDifferentContexts(): void {
  // Conditional statements
  if (getFeatureFlag('expired-flag')) {
    console.log('This should be flagged');
  }
  
  // Ternary expressions
  const result = isFeatureEnabled('legacy-feature') 
    ? 'Using legacy feature' 
    : 'Not using legacy feature';
    
  // Function parameters
  processFeatures(getFeatureFlag('deprecated-feature'), true);
  
  // Nested object structure
  const config = {
    features: {
      legacy: getFeatureFlag('expired-flag'),
      deprecated: {
        enabled: checkFlag('legacy-feature')
      }
    }
  };
  
  console.log(result, config);
}

// Helper function (not implemented)
function processFeatures(enabled: boolean, fallback: boolean): void {
  console.log(enabled, fallback);
}
