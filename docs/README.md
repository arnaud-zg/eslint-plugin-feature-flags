[🏠 Home](../README.md) · **📚 Docs**

# 📚 Documentation

`eslint-plugin-feature-flags` reports feature flags past their expiry date or missing from your
config, and removes a settled flag for you. Its four pages follow [Diátaxis](https://diataxis.fr/):
pick the one that matches what you need right now.

| You want to...                          | Open                                                           |
| --------------------------------------- | -------------------------------------------------------------- |
| Get it working for the first time       | 🚀 [Tutorial](./eslint-plugin-feature-flags/tutorial.md)       |
| Solve one specific task                 | 🛠️ [How-to](./eslint-plugin-feature-flags/how-to.md)           |
| Look up a setting, rule or message      | 📖 [Reference](./eslint-plugin-feature-flags/reference.md)     |
| Understand why it works the way it does | 💡 [Explanation](./eslint-plugin-feature-flags/explanation.md) |

## 🤔 Which rule do I need?

| You're hitting                                               | Turn on                      | What it does                                            |
| ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------- |
| Flags that shipped months ago are still in the code          | `expired-feature-flag`       | Reports every mention of a flag past its `expires`      |
| A typo in a flag name silently reads `false` in production   | `no-undefined-feature-flags` | Reports a flag read that your flag list lacks           |
| Removing a flag by hand means editing every `if` and ternary | `cleanup-feature-flag`       | `eslint --fix` keeps only the code the final value runs |

`configs.recommended` turns on the first two. Every example the pages link lives in
[`examples/`](../packages/eslint-plugin-feature-flags/examples/eslint.config.js), and
`src/examples.test.ts` lints it on every `pnpm test`.

## 🤝 Contributing to this repo

[How-to](./contributing/how-to.md) (run the checks, release, keep the package findable) ·
[Reference](./contributing/reference.md) (layout, scripts, findability and link rules) ·
[Explanation](./contributing/explanation.md) (one package, versioning policy, why it is written to
be found)
