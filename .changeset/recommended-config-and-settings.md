---
"eslint-plugin-feature-flags": minor
---

Declare your flags once and use `configs.recommended` as a flat config.

```js
import featureFlags from "eslint-plugin-feature-flags";

export default [
  featureFlags.configs.recommended,
  {
    settings: {
      "feature-flags": {
        featureFlags: { "new-checkout": { expires: "2026-12-31" } },
        identifiers: ["isEnabled"],
      },
    },
  },
];
```

- `configs.recommended` loads in ESLint 9 and 10: it used to name its plugin as a string, which flat
  config rejects.
- Every rule reads `settings["feature-flags"]`; a rule's own options still win. A setting ESLint
  cannot use, such as an `expires` that is not `YYYY-MM-DD`, fails with an error naming its key.
- `cleanup-feature-flag` works on ESLint 10: it crashed on the removed `context.getSourceCode()`.
- Breaking: the `strict` and `base` configs are gone (`strict` was `recommended`), and ESLint 8 is
  no longer supported. The plugin now sets `meta.name` and `meta.version`.
