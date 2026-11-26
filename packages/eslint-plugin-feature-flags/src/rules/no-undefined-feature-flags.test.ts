import { ruleTester } from "../testing/rule-tester";
import rule from "./no-undefined-feature-flags";

const options = [
  {
    featureFlags: { "new-checkout": { expires: "2999-12-31" }, "kill-switch": {} },
    identifiers: ["isEnabled"],
  },
];

const notDeclared = (name: string) => ({ messageId: "undefinedFeatureFlag", data: { name } });

ruleTester.run("no-undefined-feature-flags", rule, {
  valid: [
    { name: "a declared flag", code: `isEnabled("new-checkout");`, options },
    { name: "a permanent flag", code: `isEnabled("kill-switch");`, options },
    { name: "a call to another function", code: `track("new-chekout");`, options },
    { name: "a flag name only known at runtime", code: `isEnabled(name);`, options },
    { name: "a flag reader called without a name", code: `isEnabled();`, options },
    {
      name: "the default reader, getFeatureFlag",
      code: `getFeatureFlag("x");`,
      options: [{ featureFlags: { x: {} } }],
    },
  ],
  invalid: [
    {
      name: "reports a typo in a flag name",
      code: `isEnabled("new-chekout");`,
      options,
      errors: [notDeclared("new-chekout")],
    },
    {
      name: "reports a flag read through a method",
      code: `flags.isEnabled("dark-mode");`,
      options,
      errors: [notDeclared("dark-mode")],
    },
    {
      name: "reports a template literal flag name",
      code: "isEnabled(`dark-mode`);",
      options,
      errors: [notDeclared("dark-mode")],
    },
    {
      name: "reads getFeatureFlag when no identifiers are given",
      code: `getFeatureFlag("dark-mode");`,
      options: [{ featureFlags: {} }],
      errors: [notDeclared("dark-mode")],
    },
  ],
});
