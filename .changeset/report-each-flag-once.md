---
"eslint-plugin-feature-flags": minor
---

`expired-feature-flag` and `no-undefined-feature-flags` read flags one way.

- `expired-feature-flag` reports each mention of an expired flag once: `isEnabled("old")` was
  reported twice. The message shows the configured date.
- A flag without `expires` is permanent: declared, never expired.
- `expires` must be `YYYY-MM-DD`: a date ESLint cannot read used to silently never expire. A flag
  expires the day after its `expires` date, in local time.
- Flag readers called as methods, such as `flags.isEnabled("x")`, and template literals such as
  ``isEnabled(`x`)`` are read too.
- `no-undefined-feature-flags` no longer claims to be fixable: it never fixed anything.
