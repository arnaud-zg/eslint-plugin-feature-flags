import { ruleTester } from "../testing/rule-tester";
import rule from "./cleanup-feature-flag";

const options = [
  {
    identifiers: ["isEnabled"],
    flagsToCleanup: {
      shipped: "preserve-enabled-path",
      dropped: "preserve-disabled-path",
      legacy: "remove-entirely",
    },
  },
];

const settled = (name: string, strategy: string) => ({
  messageId: "cleanupFeatureFlag",
  data: { name, strategy },
});
const shipped = [settled("shipped", "preserve-enabled-path")];
const dropped = [settled("dropped", "preserve-disabled-path")];

const lines = (...code: string[]) => code.join("\n");

ruleTester.run("cleanup-feature-flag", rule, {
  valid: [
    { name: "a flag that is not settled", code: `if (isEnabled("beta")) a();`, options },
    { name: "a function that reads no flag", code: `if (track("shipped")) a();`, options },
  ],
  invalid: [
    {
      name: "keeps the if branch of a shipped flag",
      code: `if (isEnabled("shipped")) { a(); } else { b(); }`,
      output: `a();`,
      options,
      errors: shipped,
    },
    {
      name: "keeps the else branch of a dropped flag",
      code: `if (isEnabled("dropped")) { a(); } else { b(); }`,
      output: `b();`,
      options,
      errors: dropped,
    },
    {
      name: "removes an if without else, with its line, for a dropped flag",
      code: lines("start();", "if (isEnabled(`dropped`)) {", "  a();", "}", "end();"),
      output: lines("start();", "end();"),
      options,
      errors: dropped,
    },
    {
      name: "keeps the else branch when legacy remove-entirely is used",
      code: `if (isEnabled("legacy")) { a(); } else { b(); }`,
      output: `b();`,
      options,
      errors: [settled("legacy", "remove-entirely")],
    },
    {
      name: "reads a negated flag",
      code: `if (!isEnabled("shipped")) { a(); } else { b(); }`,
      output: `b();`,
      options,
      errors: shipped,
    },
    {
      name: "spreads a multi-line branch at the indentation of the if, with its comments",
      code: lines(
        "function render() {",
        '  if (isEnabled("shipped")) {',
        "    // the new page",
        "    a();",
        "    b();",
        "  }",
        "}",
      ),
      output: lines("function render() {", "  // the new page", "  a();", "  b();", "}"),
      options,
      errors: shipped,
    },
    {
      name: "keeps the braces of a branch that declares block-scoped names",
      code: `if (isEnabled("shipped")) { const a = 1; use(a); }`,
      output: `{ const a = 1; use(a); }`,
      options,
      errors: shipped,
    },
    {
      name: "keeps the braces of an else-if branch",
      code: `if (x) { a(); } else if (isEnabled("shipped")) { b(); } else { c(); }`,
      output: `if (x) { a(); } else { b(); }`,
      options,
      errors: shipped,
    },
    {
      name: "drops an else-if branch that never runs",
      code: `if (x) { a(); } else if (isEnabled("dropped")) { b(); }`,
      output: `if (x) { a(); }`,
      options,
      errors: dropped,
    },
    {
      name: "picks the branch of a ternary",
      code: `const label = isEnabled("shipped") ? "new" : "old";`,
      output: `const label = "new";`,
      options,
      errors: shipped,
    },
    {
      name: "keeps the parentheses a ternary branch needs",
      code: `const total = (isEnabled("dropped") ? a : (b, c)) * 2;`,
      output: `const total = ((b, c)) * 2;`,
      options,
      errors: dropped,
    },
    {
      name: "keeps the right side of && for a shipped flag",
      code: `isEnabled("shipped") && a();`,
      output: `a();`,
      options,
      errors: shipped,
    },
    {
      name: "removes an && statement for a dropped flag",
      code: `isEnabled("dropped") && a();`,
      output: ``,
      options,
      errors: dropped,
    },
    {
      name: "folds && to false in a value for a dropped flag",
      code: `const show = isEnabled("dropped") && hasAccess();`,
      output: `const show = false;`,
      options,
      errors: dropped,
    },
    {
      name: "keeps the right side of || for a dropped flag",
      code: `const theme = isEnabled("dropped") || "light";`,
      output: `const theme = "light";`,
      options,
      errors: dropped,
    },
    {
      name: "folds || to true in a value for a shipped flag",
      code: `const show = isEnabled("shipped") || hasAccess();`,
      output: `const show = true;`,
      options,
      errors: shipped,
    },
    {
      name: "keeps precedence when && sits inside a wider expression",
      code: `const ok = isEnabled("shipped") && (a || b) && c;`,
      output: `const ok = (a || b) && c;`,
      options,
      errors: shipped,
    },
    {
      name: "turns any other read into its value",
      code: `track({ checkout: isEnabled("shipped") });`,
      output: `track({ checkout: true });`,
      options,
      errors: shipped,
    },
    {
      name: "leaves an empty block where a statement is required",
      code: `while (next()) if (isEnabled("dropped")) a();`,
      output: `while (next()) {}`,
      options,
      errors: dropped,
    },
    {
      name: "reads flag names declared in settings for identifiers",
      code: `flags.check("shipped") && a();`,
      output: `a();`,
      options: [{ flagsToCleanup: { shipped: "preserve-enabled-path" } }],
      settings: { "feature-flags": { identifiers: ["check"] } },
      errors: shipped,
    },
  ],
});
