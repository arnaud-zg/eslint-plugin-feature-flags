import { describe, expect, it } from "vitest";

import { isDefined, isExpired } from "./flags";

const june10 = new Date(2025, 5, 10, 15, 30);

describe("isExpired", () => {
  it("keeps a flag alive through its expiry day", () => {
    expect(isExpired({ expires: "2025-06-10" }, june10)).toBe(false);
  });

  it("expires a flag the day after its expiry date", () => {
    expect(isExpired({ expires: "2025-06-09" }, june10)).toBe(true);
  });

  it("never expires a permanent flag", () => {
    expect(isExpired({ description: "kill switch" }, june10)).toBe(false);
  });
});

describe("isDefined", () => {
  it("ignores names inherited from Object.prototype", () => {
    expect(isDefined({}, "toString")).toBe(false);
  });
});
