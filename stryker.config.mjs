// Mutation testing, shared by every package: run from a package folder with
// `stryker run ../../stryker.config.mjs`. Fails when under 70% of mutants are killed.
/** @type {import("@stryker-mutator/api/core").PartialStrykerOptions} */
export default {
  testRunner: "vitest",
  // Forks, not threads: some tests call process.chdir, which workers refuse.
  vitest: { pool: "forks" },
  // Resolved from the root, so packages need no Stryker dependency of their own.
  plugins: [import.meta.resolve("@stryker-mutator/vitest-runner")],
  mutate: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/testing/**",
  ],
  incremental: true,
  incrementalFile: ".cache/stryker-incremental.json",
  // In place: a sandbox copy would break the packages' relative ../../ tsconfig paths.
  inPlace: true,
  tempDirName: ".cache/stryker-tmp",
  reporters: ["clear-text", "progress"],
  thresholds: { high: 80, low: 70, break: 70 },
};
