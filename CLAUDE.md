# CLAUDE.md

- One published package: `packages/eslint-plugin-feature-flags`. Its rules read flags through
  `src/flags.ts`; keep ESLint and AST code out of it.
- Any change to the plugin's `src` adds a changeset: see
  [Changeset rules](docs/contributing/reference.md#changeset-rules).
- `pnpm verify` must pass before a pull request; no CI runs it.
- When the plugin README or its `package.json` `description`/`keywords` changes, follow
  [Findability rules](docs/contributing/reference.md#findability-rules) and add a patch changeset:
  npm only shows them after a release.
- A change users see updates `docs/eslint-plugin-feature-flags/`; examples the docs show live in the
  package's `examples/`, run by `src/examples.test.ts`.
