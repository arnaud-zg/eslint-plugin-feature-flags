[🏠 Home](../../README.md) · [📚 Docs](../README.md) · Contributing: [🛠️ How-to](./how-to.md) · **📖
Reference** · [💡 Explanation](./explanation.md)

# 📖 Reference: Contributing

## Layout

```
packages/eslint-plugin-feature-flags/
  src/index.ts        the plugin and configs.recommended
  src/flags.ts        what a flag is and when it expires: no ESLint or AST code
  src/options.ts      settings and rule options, checked
  src/flag-calls.ts   which calls read a flag
  src/fold-flag.ts    the cleanup fix
  src/rules/          one file per rule, its test beside it
  examples/           configs and code the docs link; src/examples.test.ts lints them
docs/                 this documentation
.github/workflows/    ship.yml: releases through shiplane
```

The docs link the example files, such as
[examples/eslint.config.js](../../packages/eslint-plugin-feature-flags/examples/eslint.config.js),
instead of pasting them.

## Scripts

| Script (from repo root)        | Runs                                                                      |
| ------------------------------ | ------------------------------------------------------------------------- |
| `pnpm lint`                    | `eslint .`                                                                |
| `pnpm lint:md`                 | `remark . --frail --quiet`                                                |
| `pnpm format` / `format:check` | `prettier --write .` / `prettier --check .`                               |
| `pnpm typecheck`               | `tsc` in the package                                                      |
| `pnpm test`                    | `vitest run` in the package                                               |
| `pnpm test:mutate`             | Stryker mutation testing, by hand only                                    |
| `pnpm build`                   | builds the package with `tsdown`                                          |
| `pnpm verify`                  | typecheck, lint, lint:md, format:check, test, build                       |
| `pnpm changeset`               | records a pending version bump, see [Changeset rules](#changeset-rules)   |
| `pnpm release`                 | `pnpm build && shiplane`, see [How-to](./how-to.md#release-a-new-version) |
| `pnpm shiplane status`         | what would be released next                                               |

Source: the root `package.json`.

## Changeset rules

| The pull request changes                                                      | Changeset                                      |
| ----------------------------------------------------------------------------- | ---------------------------------------------- |
| the package's `src`: a fix, perf or refactor                                  | `--patch`                                      |
| the package's `src`: a feature, or a breaking change below 1.0.0              | `--minor`                                      |
| the package `README.md`, or `description` or `keywords` in its `package.json` | `--patch`: npm only shows them after a release |
| docs under `docs/`, tooling, CI                                               | none                                           |

```sh
pnpm changeset --patch eslint-plugin-feature-flags -m "What now works."
```

## Findability rules

For the published package. Why: see
[Explanation](./explanation.md#the-package-is-written-to-be-found).

| Where                      | Rule                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `description`              | One plain sentence, under 160 characters: what it does and the tool it works with            |
| `keywords`                 | 3 to 7 tags with a big community (`eslint`, `eslintplugin`, `feature-flags`...)              |
| `homepage`, `repository`   | The package's README on GitHub, and `directory: packages/eslint-plugin-feature-flags`        |
| README, top                | The problem in the reader's words, then one picture of the result (ESLint's output)          |
| README, first code example | Complete, `import` line included                                                             |
| Root README                | One line on what the package does, linking to its README. Details stay in the package README |

## Link rules

A reader goes from one page to the next without landing on a folder listing.

| Link                     | Rule                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| To a doc or the package  | A specific `.md` file, never its folder                                                                      |
| Package README to docs   | One link per page: 🚀 Tutorial, 🛠️ How-to, 📖 Reference, 💡 Explanation                                      |
| In the package README    | An absolute `https://github.com/arnaud-zg/eslint-plugin-feature-flags/blob/main/...` URL, so it works on npm |
| Top of every `docs` page | The nav bar: 🏠 Home, 📚 Docs, then every sibling page                                                       |
| To an example            | The file to read first, not the `examples/` folder                                                           |
