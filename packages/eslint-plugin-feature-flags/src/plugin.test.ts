import type { Linter } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import pkg from "../package.json" with { type: "json" };
import featureFlags from "./index";

const settings = {
  "feature-flags": {
    featureFlags: {
      "old-checkout": { expires: "2000-01-01" },
      "new-checkout": { expires: "2999-12-31" },
    },
    identifiers: ["isEnabled"],
  },
};

/** Lints `code` the way a project does: ESLint, a flat config, and nothing else. */
const lint = async (code: string, ...config: Linter.Config[]) => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{ files: ["**/*.ts"] }, ...config],
  });
  const [result] = await eslint.lintText(code, { filePath: "app.ts" });
  return (result?.messages ?? []).map(({ ruleId, message }) => ({ ruleId, message }));
};

describe("configs.recommended", () => {
  it("reports expired and undeclared flags from flags declared once in settings", async () => {
    const messages = await lint(
      `isEnabled("old-checkout"); isEnabled("new-checkout"); isEnabled("dark-mode");`,
      featureFlags.configs.recommended,
      { settings },
    );

    expect(messages).toEqual([
      {
        ruleId: "feature-flags/expired-feature-flag",
        message: 'Feature flag "old-checkout" expired on 2000-01-01. Remove it.',
      },
      {
        ruleId: "feature-flags/no-undefined-feature-flags",
        message: 'Feature flag "dark-mode" is not declared in the ESLint config.',
      },
    ]);
  });

  it("lets a rule's own options override the settings", async () => {
    const messages = await lint(
      `isEnabled("dark-mode");`,
      featureFlags.configs.recommended,
      { settings },
      {
        rules: {
          "feature-flags/no-undefined-feature-flags": [
            "error",
            { featureFlags: { "dark-mode": {} }, identifiers: ["isEnabled"] },
          ],
        },
      },
    );

    expect(messages).toEqual([]);
  });

  it("reads TypeScript through typescript-eslint's parser", async () => {
    const messages = await lint(
      `const on: boolean = isEnabled<boolean>("old-checkout");`,
      featureFlags.configs.recommended,
      { settings, languageOptions: { parser: tsParser } },
    );

    expect(messages.map(({ ruleId }) => ruleId)).toEqual(["feature-flags/expired-feature-flag"]);
  });
});

describe("settings", () => {
  it("names identifiers that are not a list of function names", async () => {
    const broken = { "feature-flags": { identifiers: "isEnabled" } };

    await expect(
      lint(`isEnabled("x");`, featureFlags.configs.recommended, { settings: broken }),
    ).rejects.toThrow('settings["feature-flags"].identifiers must be a list of function names.');
  });

  it("names the setting that holds a date ESLint cannot read", async () => {
    const broken = {
      "feature-flags": { featureFlags: { "old-checkout": { expires: "31/12/2025" } } },
    };

    await expect(
      lint(`isEnabled("old-checkout");`, featureFlags.configs.recommended, { settings: broken }),
    ).rejects.toThrow(
      'settings["feature-flags"].featureFlags["old-checkout"].expires must be a YYYY-MM-DD date.',
    );
  });
});

describe("rule options", () => {
  it("rejects an expires that is not YYYY-MM-DD", async () => {
    const rules: Linter.RulesRecord = {
      "feature-flags/expired-feature-flag": [
        "error",
        { featureFlags: { "old-checkout": { expires: "2025-12" } } },
      ],
    };

    await expect(
      lint(`isEnabled("old-checkout");`, featureFlags.configs.recommended, { rules }),
    ).rejects.toThrow(/"2025-12" should match pattern/);
  });

  it("rejects a cleanup strategy it does not know", async () => {
    const rules: Linter.RulesRecord = {
      "feature-flags/cleanup-feature-flag": ["error", { flagsToCleanup: { x: "keep-both" } }],
    };

    await expect(lint(`x;`, featureFlags.configs.recommended, { rules })).rejects.toThrow(
      /"keep-both" should be equal to one of the allowed values/,
    );
  });
});

describe("the plugin", () => {
  it("names itself for ESLint's cache and config inspector", () => {
    expect(featureFlags.meta).toEqual({ name: pkg.name, version: pkg.version });
  });
});
