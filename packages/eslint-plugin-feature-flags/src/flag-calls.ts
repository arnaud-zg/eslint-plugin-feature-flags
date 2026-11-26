import type { CallExpression, Expression, Node, SpreadElement, Super } from "estree";

/** The function a call names: `isEnabled` in `isEnabled(…)` and in `flags.isEnabled(…)`. */
const calleeName = (callee: Expression | Super): string | undefined => {
  if (callee.type === "Identifier") return callee.name;
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    return callee.property.name;
  }
  return undefined;
};

/** The text of a string literal, or of a template literal without `${…}`. */
export const stringValue = (node: Node | SpreadElement): string | undefined => {
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis[0]?.value.cooked ?? undefined;
  }
  return undefined;
};

/** The flag a call such as `isEnabled("new-checkout")` reads, when `isEnabled` is a flag reader. */
export const flagReadBy = (
  call: CallExpression,
  readers: readonly string[],
): string | undefined => {
  const name = calleeName(call.callee);
  const [argument] = call.arguments;
  if (name === undefined || !readers.includes(name) || argument === undefined) return undefined;
  return stringValue(argument);
};
