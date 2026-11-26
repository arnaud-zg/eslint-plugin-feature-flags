---
"eslint-plugin-feature-flags": minor
---

`cleanup-feature-flag` treats a settled flag as the constant it became, and keeps only the code that
value runs.

- `preserve-enabled-path` reads the flag as `true`, `preserve-disabled-path` as `false`.
  `remove-entirely` is kept as another name for `preserve-disabled-path`: it used to delete the
  `else` branch too, which still runs once the flag is off.
- `if`/`else`, `else if`, `? :`, `&&`, `||` and `!flag` are folded; any other read becomes `true` or
  `false`. It no longer guesses values from variable names (a `theme` variable became `'light'`).
- A branch is spread into the enclosing code at the right indentation, with its comments, unless it
  declares block-scoped names; parentheses that keep precedence stay.
- The rule reads `identifiers` from `settings["feature-flags"]` like the other rules.
- The plugin has no runtime dependency anymore.
