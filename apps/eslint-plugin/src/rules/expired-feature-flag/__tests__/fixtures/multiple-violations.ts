// Multiple violations of expired feature flags in a single file
import { getFeatureFlag, isFeatureEnabled, checkFlag, customFlagFunction } from './helpers';
export function multipleViolations(): void {
  // Various function calls with expired flags
  const flag1: boolean = getFeatureFlag('enable-dashboard-v1');

  // Object property
  const flags: Record<string, boolean> = {
    'enable-dashboard-v1': true,
  };

  // Different accessor functions
  const flag2: boolean = isFeatureEnabled('enable-dashboard-v1');
  const flag3: boolean = checkFlag('enable-ui-v1');
  const flag4: boolean = customFlagFunction('deprecated-feature');

  // Bracket notation
  const value: boolean = flags['enable-dashboard-v1'];

  console.log(flag1, flag2, value, flag3, flag4);
}

// Expired flags in different contexts
export function violationsInDifferentContexts(): void {
  // Conditional statements
  if (getFeatureFlag('enable-dashboard-v1')) {
    console.log('This should be flagged');
  }
  
  // Ternary expressions
  const result = isFeatureEnabled('enable-ui-v1') 
    ? 'Using UI v1' 
    : 'Not using UI v1';
    
  // Function parameters
  processFeatures(getFeatureFlag('enable-ui-v1'), true);
  
  // Nested object structure
  const config = {
    features: {
      legacy: getFeatureFlag('enable-dashboard-v1'),
      deprecated: {
        enabled: checkFlag('enable-ui-v1')
      }
    }
  };
  
  console.log(result, config);
}

// Helper function (not implemented)
function processFeatures(enabled: boolean, fallback: boolean): void {
  console.log(enabled, fallback);
}
