import { baseConfig } from '../../packages/eslint-config-base/index.mjs';
import { typescriptConfig } from '../../packages/eslint-config-base/typescript.mjs';
import { testConfig } from '../../packages/eslint-config-base/test.mjs';
import { buildConfig } from '../../packages/eslint-config-base/build.mjs';

export default [
  ...baseConfig,
  ...typescriptConfig,
  ...testConfig,
  ...buildConfig,
  {
    ignores: ['dist/', 'node_modules/', '**/coverage/**', '**/__tests__/**']
  }
];
