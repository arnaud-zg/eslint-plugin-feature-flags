import { getFeatureFlag, isFeatureEnabled } from './helpers';

// This file contains multiple expired feature flag usages
export function multipleViolations(): void {
  // First violation - function call
  const flag1: boolean = getFeatureFlag('expired-flag');

  // Second violation - object property
  const flags: Record<string, boolean> = {
    'expired-flag': true,
  };

  // Third violation - different function call
  const flag2: boolean = isFeatureEnabled('expired-flag');

  // Fourth violation - bracket notation
  const value: boolean = flags['expired-flag'];

  console.log(flag1, flag2, value);
}
