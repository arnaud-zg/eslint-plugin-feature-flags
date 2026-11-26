# 🚩 eslint-plugin-feature-flags

<p align="center">
  <img src="./assets/icon.svg" width="128" height="128" alt="eslint-plugin-feature-flags logo" />
</p>

<div align="center">
  ESLint rules that keep feature flags from turning into technical debt.
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/eslint-plugin-feature-flags"><img src="https://img.shields.io/npm/v/eslint-plugin-feature-flags" alt="npm version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
</div>

Feature flags ship code safely, then stay in the code long after the decision is made. This plugin
reads your flag list and:

- **reports flags past their expiry date**, so they get removed;
- **reports flags missing from the list**, so a typo never reads `false` in production;
- **removes a settled flag for you**, keeping only the code its final value runs.

👉 Install it and see every rule:
[packages/eslint-plugin-feature-flags](./packages/eslint-plugin-feature-flags/README.md).

## 📚 Documentation

Start at the **[documentation index](./docs/README.md)**: four pages, each for one need.

- 🚀 **[Tutorial](./docs/eslint-plugin-feature-flags/tutorial.md)**: catch an expired flag and a
  typo, then remove the flag.
- 🛠️ **[How-to](./docs/eslint-plugin-feature-flags/how-to.md)**: TypeScript, your own flag function,
  permanent flags.
- 📖 **[Reference](./docs/eslint-plugin-feature-flags/reference.md)**: every setting, rule, option
  and message.
- 💡 **[Explanation](./docs/eslint-plugin-feature-flags/explanation.md)**: why the rules read flags
  the way they do.

## Development

You need Node 22 and pnpm 10.

```sh
pnpm install
pnpm verify   # typecheck, lint, format, test, build
```

The repo holds one published package, `packages/eslint-plugin-feature-flags`. How to propose a
change and how releases work: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Learn more

- [Effective Feature Flag Management](https://arnaudzg.substack.com/p/effective-feature-flag-management),
  the article behind this plugin.

## Acknowledgments

Thanks to [Kevin Marques](https://github.com/marques-kevin) for the idea that sparked this project,
and to everyone who helps make it better.

## License

[MIT](./LICENSE)
