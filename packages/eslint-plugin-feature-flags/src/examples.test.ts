import { readFile } from "node:fs/promises";
import type { Linter } from "eslint";
import { Linter as ESLintLinter } from "eslint";
import { describe, expect, it } from "vitest";

// The docs link these files, so a test runs each one as a project would.
const examples = new URL("../examples/", import.meta.url);

const read = (file: string) => readFile(new URL(file, examples), "utf8");

const config = async (file: string): Promise<Linter.Config[]> => {
  const module = (await import(new URL(file, examples).href)) as { default: Linter.Config[] };
  return module.default;
};

const linter = new ESLintLinter({ configType: "flat" });

describe("examples", () => {
  it("eslint.config.js reports the expired flag and the typo in app.js", async () => {
    const messages = linter.verify(
      await read("app.js"),
      await config("eslint.config.js"),
      "app.js",
    );

    expect(messages.map(({ line, ruleId, message }) => ({ line, ruleId, message }))).toEqual([
      {
        line: 5,
        ruleId: "feature-flags/expired-feature-flag",
        message: 'Feature flag "new-checkout" expired on 2026-01-31. Remove it.',
      },
      {
        line: 13,
        ruleId: "feature-flags/no-undefined-feature-flags",
        message: 'Feature flag "new-serach" is not declared in the ESLint config.',
      },
    ]);
  });

  it("cleanup.config.js turns app.js into app.cleaned.js", async () => {
    const { output } = linter.verifyAndFix(
      await read("app.js"),
      await config("cleanup.config.js"),
      "app.js",
    );

    expect(output).toBe(await read("app.cleaned.js"));
  });
});
