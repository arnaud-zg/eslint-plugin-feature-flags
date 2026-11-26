[🏠 Home](../../README.md) · [📚 Docs](../README.md) · `eslint-plugin-feature-flags`:
[🚀 Tutorial](./tutorial.md) · [🛠️ How-to](./how-to.md) · **📖 Reference** ·
[💡 Explanation](./explanation.md)

# 📖 Reference: `eslint-plugin-feature-flags`

2 settings, 3 rules, 1 config. Every table names the source file that defines it, under
`packages/eslint-plugin-feature-flags/`. A working config:
[examples/eslint.config.js](../../packages/eslint-plugin-feature-flags/examples/eslint.config.js).

## Package

| Field     | Value                                              | Source         |
| --------- | -------------------------------------------------- | -------------- |
| Export    | `.` (default export: the plugin), `./package.json` | `package.json` |
| Format    | ES module, types in `dist/index.d.ts`              | `package.json` |
| ESLint    | `>=9.0.0` (peer dependency), flat config only      | `package.json` |
| Node      | `^18.18.0 \|\| ^20.9.0 \|\| >=21.1.0`              | `package.json` |
| Namespace | `feature-flags`: rules are `feature-flags/<rule>`  | `src/index.ts` |

## Settings

Declared once under `settings["feature-flags"]`, read by every rule. Source: `src/options.ts`.

| Key            | Type                                     | Default              |
| -------------- | ---------------------------------------- | -------------------- |
| `featureFlags` | `{ [name]: { expires?, description? } }` | `{}`                 |
| `identifiers`  | `string[]`, at least one                 | `["getFeatureFlag"]` |

| Flag field    | Type                   | Meaning                                                                |
| ------------- | ---------------------- | ---------------------------------------------------------------------- |
| `expires`     | `string`, `YYYY-MM-DD` | The last day the flag may live. Reported from the next day, local time |
| `description` | `string`               | For people; no rule reads it                                           |

A rule's own `featureFlags` or `identifiers` option wins over the setting of the same name.

### Settings errors

ESLint stops with one of these when a setting has the wrong shape. Source: `src/options.ts`.

| Setting            | Error                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| the whole object   | `settings["feature-flags"]. must be an object.`                                       |
| `featureFlags`     | `settings["feature-flags"].featureFlags must be an object of flags.`                  |
| a flag             | `settings["feature-flags"].featureFlags["<name>"] must be an object.`                 |
| a flag's `expires` | `settings["feature-flags"].featureFlags["<name>"].expires must be a YYYY-MM-DD date.` |
| `identifiers`      | `settings["feature-flags"].identifiers must be a list of function names.`             |

The same mistakes in a rule's options fail ESLint's own schema check instead, such as
`"2025-12" should match pattern`.

## Flag reads

What each rule counts as a read of the flag `x`. Source: `src/flag-calls.ts`,
`src/rules/expired-feature-flag.ts`.

| Code                                   | `expired-feature-flag` | `no-undefined-feature-flags` | `cleanup-feature-flag` |
| -------------------------------------- | ---------------------- | ---------------------------- | ---------------------- |
| `isEnabled("x")`, ``isEnabled(`x`)``   | ✅                     | ✅                           | ✅                     |
| `flags.isEnabled("x")`                 | ✅                     | ✅                           | ✅                     |
| `track("x")`, any string `"x"`         | ✅                     |                              |                        |
| `flags.x`, `flags["x"]`, `{ x: true }` | ✅                     |                              |                        |
| `isEnabled(name)`, `` `${a}-x` ``      |                        |                              |                        |

`isEnabled` stands for any name in `identifiers`.

## `configs.recommended`

Source: `src/index.ts`.

| Rule                                       | Level   |
| ------------------------------------------ | ------- |
| `feature-flags/expired-feature-flag`       | `error` |
| `feature-flags/no-undefined-feature-flags` | `error` |

It declares the plugin, so a config that uses it needs no `plugins` entry.

## Rules

### `expired-feature-flag`

| Field   | Value                                                    |
| ------- | -------------------------------------------------------- |
| Type    | `problem`                                                |
| Fix     | none                                                     |
| Options | `featureFlags`, `identifiers`                            |
| Message | `Feature flag "<name>" expired on <expires>. Remove it.` |
| Source  | `src/rules/expired-feature-flag.ts`, `src/flags.ts`      |

### `no-undefined-feature-flags`

| Field   | Value                                                         |
| ------- | ------------------------------------------------------------- |
| Type    | `problem`                                                     |
| Fix     | none                                                          |
| Options | `featureFlags`, `identifiers`                                 |
| Message | `Feature flag "<name>" is not declared in the ESLint config.` |
| Source  | `src/rules/no-undefined-feature-flags.ts`                     |

### `cleanup-feature-flag`

| Field   | Value                                                       |
| ------- | ----------------------------------------------------------- |
| Type    | `suggestion`                                                |
| Fix     | `code`: `eslint --fix`                                      |
| Options | `flagsToCleanup` (required), `featureFlags`, `identifiers`  |
| Message | `Feature flag "<name>" is settled (<strategy>): remove it.` |
| Source  | `src/rules/cleanup-feature-flag.ts`, `src/fold-flag.ts`     |

`flagsToCleanup` maps a flag name to a strategy:

| Strategy                 | The flag reads | Note                                      |
| ------------------------ | -------------- | ----------------------------------------- |
| `preserve-enabled-path`  | `true`         | The flag shipped                          |
| `preserve-disabled-path` | `false`        | The flag was dropped                      |
| `remove-entirely`        | `false`        | Another name for `preserve-disabled-path` |

What the fix writes, for a flag `x` read by `isEnabled`. Tests:
`src/rules/cleanup-feature-flag.test.ts`.

| Before                                       | `preserve-enabled-path` | `preserve-disabled-path` |
| -------------------------------------------- | ----------------------- | ------------------------ |
| `if (isEnabled("x")) { a(); } else { b(); }` | `a();`                  | `b();`                   |
| `if (isEnabled("x")) { a(); }`               | `a();`                  | removed                  |
| `isEnabled("x") ? a : b`                     | `a`                     | `b`                      |
| `isEnabled("x") && a()` as a statement       | `a()`                   | removed                  |
| `const show = isEnabled("x") && canSee()`    | `canSee()`              | `false`                  |
| `const theme = isEnabled("x") \|\| "light"`  | `true`                  | `"light"`                |
| `!isEnabled("x")`, `track(isEnabled("x"))`   | `false`, `track(true)`  | `true`, `track(false)`   |
| `while (go()) if (isEnabled("x")) a();`      | `while (go()) a();`     | `while (go()) {}`        |

A kept block joins the code around it, with its comments, unless it declares `let`, `const`, `class`
or `function`: then its braces stay. The fix leaves imports alone.
