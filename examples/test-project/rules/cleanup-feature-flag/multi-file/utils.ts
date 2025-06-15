// Feature flag utils
import { getFeatureFlag } from '../../../shared/feature-flags';

export function shouldShowLegacyUI(): boolean {
  return getFeatureFlag('enable-ui-v1');
}
