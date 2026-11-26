import { defineLibraryConfig as defineSharedConfig } from "@arnaud-zg/configs/tsdown";

/**
 * The shared library build, minified for what npm ships. Tree shaking still works: the output stays
 * ES modules with `sideEffects: false`, pure annotations are kept, and functions and classes keep
 * their names, so stack traces and `error.name` read as written. Source maps map back to the source.
 *
 * @param {Parameters<typeof defineSharedConfig>[0]} options
 */
export const defineLibraryConfig = (options) =>
  defineSharedConfig({
    minify: {
      compress: { keepNames: { function: true, class: true } },
      mangle: { keepNames: true },
      codegen: true,
    },
    outputOptions: { comments: { annotation: true, legal: true, jsdoc: false } },
    ...options,
  });
