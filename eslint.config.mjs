import base from "@arnaud-zg/configs/eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Test fixtures are sample code the rules read, not code this repo runs.
  // shiplane.config.ts sits outside every tsconfig.
  {
    ignores: [
      "shiplane.config.ts",
      "examples/**",
      "**/__tests__/fixtures/**",
      ".claude/worktrees/**",
    ],
  },
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/dist/**"],
    languageOptions: {
      parserOptions: {
        project: ["packages/*/tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
