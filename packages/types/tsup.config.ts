import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'es2022',
  platform: 'node',
  clean: true,
  dts: true,
  sourcemap: false,
  outExtension: ({ format }) => ({ js: `.${format}.js` }),
});
