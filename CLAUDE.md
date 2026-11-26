# CLAUDE.md

- One published package: `packages/eslint-plugin-feature-flags`. Its rules read flags through
  `src/flags.ts`; keep ESLint and AST code out of it.
- Any change to the plugin's `src` adds a changeset (see [CONTRIBUTING.md](./CONTRIBUTING.md)).
- `pnpm verify` must pass before a pull request; no CI runs it.
- When the `package.json` `description`/`keywords` or the README opening changes, add a patch
  changeset: npm only shows metadata after a release.
