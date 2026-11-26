[🏠 Home](../../README.md) · [📚 Docs](../README.md) · `eslint-plugin-feature-flags`: **🚀
Tutorial** · [🛠️ How-to](./how-to.md) · [📖 Reference](./reference.md) ·
[💡 Explanation](./explanation.md)

# 🚀 Tutorial: catch an expired flag and a typo, then remove the flag

New here? Do this once, in order: 5 steps, about 10 minutes.

You will:

1. declare your flags once, in the ESLint config;
2. see ESLint report an expired flag and a misspelled one;
3. remove the expired flag with `eslint --fix`.

## Before you start

- Node 18.18 or later: `node --version`.
- A project with a flat config (`eslint.config.js`) and ESLint 9 or 10: `npx eslint --version`.

## 1. Install the plugin

```sh
npm install --save-dev eslint-plugin-feature-flags
```

## 2. Declare your flags

Replace `eslint.config.js` with
[examples/eslint.config.js](../../packages/eslint-plugin-feature-flags/examples/eslint.config.js):

```js
import featureFlags from "eslint-plugin-feature-flags";

export default [
  featureFlags.configs.recommended,
  {
    settings: {
      "feature-flags": {
        featureFlags: {
          "new-checkout": { expires: "2026-01-31", description: "Checkout redesign" },
          "new-search": { expires: "2099-12-31", description: "Search rewrite" },
          "kill-switch-payments": { description: "Permanent: no expires" },
        },
        identifiers: ["isEnabled"],
      },
    },
  },
];
```

`identifiers` names the function your code reads a flag with.

## 3. Lint a file that reads flags

Save [examples/app.js](../../packages/eslint-plugin-feature-flags/examples/app.js) as `app.js`, then
run ESLint:

```sh
npx eslint app.js
```

You should see:

```text
app.js
   5:17  error  Feature flag "new-checkout" expired on 2026-01-31. Remove it    feature-flags/expired-feature-flag
  13:22  error  Feature flag "new-serach" is not declared in the ESLint config  feature-flags/no-undefined-feature-flags

✖ 2 problems (2 errors, 0 warnings)
```

## 4. Fix the typo

In `app.js`, change `"new-serach"` to `"new-search"`, then run `npx eslint app.js` again.

You should see:

```text
app.js
  5:17  error  Feature flag "new-checkout" expired on 2026-01-31. Remove it  feature-flags/expired-feature-flag

✖ 1 problem (1 error, 0 warnings)
```

## 5. Remove the expired flag

The checkout redesign shipped. Save
[examples/cleanup.config.js](../../packages/eslint-plugin-feature-flags/examples/cleanup.config.js)
as `cleanup.config.js`, then fix with it:

```sh
npx eslint -c cleanup.config.js --fix app.js
```

ESLint prints nothing, and `checkoutPage` in `app.js` now reads:

```js
export function checkoutPage() {
  renderNewCheckout();
}
```

Delete the `renderOldCheckout` import it no longer uses, `"new-checkout"` from `featureFlags`, and
`cleanup.config.js`. `npx eslint app.js` now prints nothing.

## What you learned

- The flags live once, in `settings`, and `configs.recommended` reads them.
- ESLint reports a flag past its `expires` date, and a flag name the list lacks.
- `cleanup-feature-flag` turns a settled flag into the code its final value runs.

## Next

- 🛠️ [How-to](./how-to.md): lint TypeScript, read flags through your own function.
- 📖 [Reference](./reference.md): every setting, rule option and message.
- 💡 [Explanation](./explanation.md): why the rules read flags the way they do.
