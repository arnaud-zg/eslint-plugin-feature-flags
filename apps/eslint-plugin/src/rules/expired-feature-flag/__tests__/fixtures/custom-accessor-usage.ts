// Expired feature flags with custom accessor functions
import { customFlagFunction, checkFlag } from './helpers';

// Custom function usage
export function customFunctionUsage(): void {
  const enabled = customFlagFunction('expired-flag');

  if (enabled) {
    console.log('Feature is enabled!');
  } else {
    console.log('Feature is disabled!');
  }
  
  // Another custom function that should be configured
  if (checkFlag('legacy-feature')) {
    console.log('Legacy feature is still enabled');
  }
}

// Multiple custom functions
export function multipleCustomFunctions(): void {
  // Custom functions with expired flags
  const flag1 = customFlagFunction('expired-flag');
  const flag2 = checkFlag('expired-flag');
  
  // Different expired flags
  const legacy1 = customFlagFunction('legacy-feature');
  const legacy2 = customFlagFunction('deprecated-feature');
  
  console.log(flag1, flag2, legacy1, legacy2);
}

// Export for reuse in tests
export { customFunctionUsage, multipleCustomFunctions };
