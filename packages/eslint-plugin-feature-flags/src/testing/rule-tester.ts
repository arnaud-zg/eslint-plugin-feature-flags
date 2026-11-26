import { RuleTester } from "eslint";
import { describe, it } from "vitest";

// Each RuleTester case becomes its own Vitest test, so a failing case fails the run.
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

export const ruleTester = new RuleTester();
