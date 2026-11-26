// Expired feature flags with custom accessor functions
import { customFlagFunction, checkFlag } from './helpers';

// Custom function usage
export function customFunctionUsage(): void {
  const enabled = customFlagFunction('enable-dashboard-v1');

  if (enabled) {
    console.log('Feature is enabled!');
  } else {
    console.log('Feature is disabled!');
  }
  
  // Another custom function that should be configured
  if (checkFlag('enable-ui-v1')) {
    console.log('UI v1 is still enabled');
  }
}

// Multiple custom functions
export function multipleCustomFunctions(): void {
  // Custom functions with expired flags
  const flag1 = customFlagFunction('enable-dashboard-v1');
  const flag2 = checkFlag('enable-dashboard-v1');
  
  // Different expired flags
  const legacy1 = customFlagFunction('enable-ui-v1');
  const legacy2 = customFlagFunction('enable-ui-v1');
  
  console.log(flag1, flag2, legacy1, legacy2);
}

// Export for reuse in tests
export { customFunctionUsage, multipleCustomFunctions };
