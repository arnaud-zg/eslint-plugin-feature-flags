import { BuildOptions, Plugin } from 'esbuild';
import { readFileSync } from 'fs';
import { defineConfig, Options } from 'tsup';

// Read package.json for metadata
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = pkg.version;

/**
 * Environment variables to be injected at build time
 */
const buildEnvironment = {
  CLI_VERSION: version,
  BUILD_TIMESTAMP: new Date().toISOString(),
};

/**
 * Footer text to append at the end of the bundle
 */
const currentYear = new Date().getFullYear();
const footerText = `
// 🚩 Eslint Plugin Feature Flags v${version}
// Lint rules to enforce feature flag hygiene.
// Copyright © ${currentYear} | Made with ❤️
`;

/**
 * Creates a build time logging plugin
 * @returns An esbuild plugin that logs build time
 */
function createBuildTimePlugin(): Plugin {
  return {
    name: 'log-build-time',
    setup(build) {
      const startTime = Date.now();
      build.onStart(() => {
        console.info('\n🚀 [eslint-plugin-feature-flags:core] Build started...');
      });
      build.onEnd(() => {
        const endTime = Date.now();
        console.info(`⏱️ Build completed in ${endTime - startTime}ms`);
      });
    },
  };
}

/**
 * Custom callback to run after successful build
 */
async function onBuildSuccess(): Promise<void> {
  console.info('✅ Build completed successfully!');
  console.info('📦 Logger bundle is ready for distribution.');
}

/**
 * Configure esbuild options
 * @param options The esbuild options object
 */
function configureEsbuild(options: BuildOptions): void {
  options.sourcesContent = true; // Keep source content in source maps
}

/**
 * Main tsup configuration
 */
export default defineConfig({
  // Entry points
  entry: ['src/index.ts'],

  // Output format
  format: ['esm'],
  target: 'es2022',

  // Bundle configuration
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  shims: true,

  // External dependencies
  noExternal: [
    '@eslint-plugin-feature-flags/core',
    '@eslint-plugin-feature-flags/types',
  ],

  // Optimization options
  minify: true,
  skipNodeModulesBundle: false,
  metafile: true,
  treeshake: true,
  circular: true,

  // Footer
  footer: {
    js: footerText,
  },

  // Environment and platform
  env: buildEnvironment,
  platform: 'node',

  // Custom functions
  onSuccess: onBuildSuccess,
  esbuildOptions: configureEsbuild,
  outExtension: ({ format }) => ({ js: `.${format}.js` }),

  // Plugins
  esbuildPlugins: [createBuildTimePlugin()],
} as Options);
