import { ruleTester } from "../testing/rule-tester";
import rule from "./expired-feature-flag";

const options = [
  {
    featureFlags: {
      "old-checkout": { expires: "2000-01-01" },
      legacyUi: { expires: "2000-01-01" },
      "new-checkout": { expires: "2999-12-31" },
      "kill-switch": { description: "Permanent" },
    },
    identifiers: ["isEnabled"],
  },
];

const expired = (name: string) => ({
  messageId: "expiredFeatureFlag",
  data: { name, expires: "2000-01-01" },
});

ruleTester.run("expired-feature-flag", rule, {
  valid: [
    { name: "a flag before its expiry date", code: `isEnabled("new-checkout");`, options },
    { name: "a permanent flag", code: `isEnabled("kill-switch");`, options },
    { name: "a string that names no flag", code: `const label = "checkout";`, options },
    { name: "no flags configured", code: `isEnabled("old-checkout");` },
    { name: "a template literal with an expression", code: "`old-${name}`;", options },
  ],
  invalid: [
    {
      name: "reports a flag read once, on its name",
      code: `isEnabled("old-checkout");`,
      options,
      errors: [expired("old-checkout")],
    },
    {
      name: "reports an expired flag whatever function reads it",
      code: `track("old-checkout");`,
      options,
      errors: [expired("old-checkout")],
    },
    {
      name: "reports a template literal without expressions",
      code: "isEnabled(`old-checkout`);",
      options,
      errors: [expired("old-checkout")],
    },
    {
      name: "reports a bracket read once",
      code: `flags["old-checkout"];`,
      options,
      errors: [expired("old-checkout")],
    },
    {
      name: "reports a dot read and an object key",
      code: `const flags = { legacyUi: true }; flags.legacyUi;`,
      options,
      errors: [expired("legacyUi"), expired("legacyUi")],
    },
    {
      name: "reports each mention in a file",
      code: `if (isEnabled("old-checkout")) { log("old-checkout"); }`,
      options,
      errors: [expired("old-checkout"), expired("old-checkout")],
    },
  ],
});
