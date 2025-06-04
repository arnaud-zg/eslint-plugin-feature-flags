import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/rules/**/__tests__/**/*.test.ts', 'src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Include all source files for coverage reports
      include: ['src/index.ts', 'src/rules/*.ts'],
      // Skip coverage checks for test files and fixtures
      exclude: ['src/**/__tests__/**/*', 'src/__tests__/**/*'],
      // Require 100% coverage
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
});
