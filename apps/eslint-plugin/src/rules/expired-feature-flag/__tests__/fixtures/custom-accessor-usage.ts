import { customFlagFunction } from './helpers.js';

// This file uses a custom accessor function for feature flags
export function demoFunction(): void {
  // This should trigger an error since 'expired-flag' has expired
  // and 'customFlagFunction' is configured as an identifier
  const enabled = customFlagFunction('expired-flag');

  if (enabled) {
    console.log('Feature is enabled!');
  } else {
    console.log('Feature is disabled!');
  }
}

demoFunction();
