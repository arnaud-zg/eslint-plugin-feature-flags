[🏠 Home](../../README.md) · [📚 Docs](../README.md) · Contributing: [🛠️ How-to](./how-to.md) ·
[📖 Reference](./reference.md) · **💡 Explanation**

# 💡 Explanation: Contributing

## The repo holds one published package

`packages/eslint-plugin-feature-flags` is the only thing published. The workspace layout stays, so
the toolchain matches the other `arnaud-zg` repos (`@arnaud-zg/configs`, shiplane, Changesets), and
a second package could join without moving files. `src/flags.ts` holds what a flag is with no ESLint
or AST code, so the rules stay thin and the flag logic stays testable on its own.

## Versioning policy

The package versions through [Changesets](https://github.com/changesets/changesets). Below `1.0.0`,
a minor version means "new" or "breaking", and the changelog says which; a patch only ever means
"fixed". Changesets never picks the bump, so the one who writes the changeset applies this rule. Pin
a `0.x` version and read the changelog before you upgrade.

## The package is written to be found

Nobody promotes this plugin: people find it through npm search, web search or an AI assistant.

- **npm search** ranks on the name, `description` and `keywords`, then the README.
- **Web search** matches what people type, often the problem in their own words.
- **AI assistants** recommend what they can describe and quote: a plain description and a first
  example that works when pasted.
- **npm shows the published `package.json` and README**, so a change to either needs a release to
  show. That is why it needs a patch changeset.

## Examples are run, not pasted

A snippet pasted into a page goes stale silently. The docs link files in `examples/` instead, and
`src/examples.test.ts` lints them against the source on every `pnpm test`, so a page cannot show an
example that no longer works.
