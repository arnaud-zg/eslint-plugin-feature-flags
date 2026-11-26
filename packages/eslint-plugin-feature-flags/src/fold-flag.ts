import type { AST, Rule, SourceCode } from "eslint";
import type { BlockStatement, IfStatement, LogicalExpression, Node, Statement } from "estree";

/** What a fix needs: the file's source and ESLint's fixer. */
export interface Fold {
  sourceCode: SourceCode;
  fixer: Rule.RuleFixer;
}

type Parented<T extends Node = Node> = T & Rule.NodeParentExtension;

/** Parents whose body is a list of statements, where one can be removed or spread. */
const STATEMENT_LISTS = new Set(["Program", "BlockStatement", "StaticBlock", "SwitchCase"]);

const inStatementList = (node: Parented) => STATEMENT_LISTS.has(node.parent.type);

/** The node's text with the parentheses written around it, so precedence survives the move. */
const textOf = ({ sourceCode }: Fold, node: Node): string => {
  let first = sourceCode.getFirstToken(node);
  let last = sourceCode.getLastToken(node);
  let before = first && sourceCode.getTokenBefore(first);
  let after = last && sourceCode.getTokenAfter(last);
  while (before?.value === "(" && after?.value === ")") {
    [first, last] = [before, after];
    [before, after] = [sourceCode.getTokenBefore(before), sourceCode.getTokenAfter(after)];
  }
  if (!first || !last) return sourceCode.getText(node);
  return sourceCode.text.slice(first.range[0], last.range[1]);
};

/** The node's range, grown to whole lines when nothing else shares them. */
const wholeLines = ({ sourceCode }: Fold, node: Node): AST.Range => {
  const { text } = sourceCode;
  const [start, end] = sourceCode.getRange(node);
  const lineStart = text.lastIndexOf("\n", start - 1) + 1;
  const newline = text.indexOf("\n", end);
  const lineEnd = newline === -1 ? text.length : newline + 1;
  const alone = !text.slice(lineStart, start).trim() && !text.slice(end, lineEnd).trim();
  return alone ? [lineStart, lineEnd] : [start, end];
};

/** Removes a statement, or leaves an empty block where the syntax needs a statement. */
const removeStatement = (fold: Fold, statement: Parented<Statement>): Rule.Fix => {
  const { parent } = statement;
  if (parent.type === "IfStatement" && parent.alternate === statement) {
    return fold.fixer.removeRange([
      fold.sourceCode.getRange(parent.consequent)[1],
      fold.sourceCode.getRange(statement)[1],
    ]);
  }
  if (!inStatementList(statement)) return fold.fixer.replaceText(statement, "{}");
  return fold.fixer.removeRange(wholeLines(fold, statement));
};

/** A block whose statements can join the enclosing list: it declares no block-scoped name. */
const canSpread = (block: BlockStatement) =>
  block.body.every(
    (statement) =>
      statement.type !== "ClassDeclaration" &&
      statement.type !== "FunctionDeclaration" &&
      (statement.type !== "VariableDeclaration" || statement.kind === "var"),
  );

/** A block's statements and comments, indented as the statement they replace. */
const blockBody = (fold: Fold, block: BlockStatement, replaced: Node): string => {
  const { sourceCode } = fold;
  const open = sourceCode.getFirstToken(block);
  const close = sourceCode.getLastToken(block);
  const first = open && sourceCode.getTokenAfter(open, { includeComments: true });
  const last = close && sourceCode.getTokenBefore(close, { includeComments: true });
  if (!first || !last) return sourceCode.getText(block);
  const body = sourceCode.text.slice(sourceCode.getRange(first)[0], sourceCode.getRange(last)[1]);
  // A template literal may span lines: its text is a value, so it keeps its indentation.
  if (body.includes("`")) return body;
  const extra = sourceCode.getLoc(first).start.column - sourceCode.getLoc(replaced).start.column;
  const indent = new RegExp(`^ {0,${Math.max(extra, 0)}}`);
  return body
    .split("\n")
    .map((line, index) => (index === 0 ? line : line.replace(indent, "")))
    .join("\n");
};

/** `if (flag) a else b` becomes the branch the flag's value takes. */
const foldIf = (fold: Fold, statement: Parented<IfStatement>, truth: boolean): Rule.Fix => {
  const kept = truth ? statement.consequent : statement.alternate;
  if (!kept || (kept.type === "BlockStatement" && kept.body.length === 0)) {
    return removeStatement(fold, statement);
  }
  if (kept.type === "BlockStatement" && inStatementList(statement) && canSpread(kept)) {
    return fold.fixer.replaceText(statement, blockBody(fold, kept, statement));
  }
  return fold.fixer.replaceText(statement, textOf(fold, kept));
};

/** `flag && x` is `x` when on and `false` when off; `flag || x` is `true` when on and `x` when off. */
const foldLogical = (
  fold: Fold,
  expression: Parented<LogicalExpression>,
  truth: boolean,
): Rule.Fix => {
  const keepsRight = (expression.operator === "&&") === truth;
  if (keepsRight) return fold.fixer.replaceText(expression, textOf(fold, expression.right));
  const { parent } = expression;
  if (parent.type === "ExpressionStatement") return removeStatement(fold, parent);
  return fold.fixer.replaceText(expression, String(truth));
};

/**
 * The fix for a flag read whose value is now settled: the read becomes `true` or `false`, and the
 * `if`, `? :`, `&&` or `||` around it keeps only the code that value runs. `!flag` counts too.
 */
export const foldFlag = (fold: Fold, read: Parented, value: boolean): Rule.Fix => {
  let node = read;
  let truth = value;
  while (node.parent.type === "UnaryExpression" && node.parent.operator === "!") {
    node = node.parent;
    truth = !truth;
  }
  const { parent } = node;
  if (parent.type === "IfStatement" && parent.test === node) return foldIf(fold, parent, truth);
  if (parent.type === "ConditionalExpression" && parent.test === node) {
    return fold.fixer.replaceText(
      parent,
      textOf(fold, truth ? parent.consequent : parent.alternate),
    );
  }
  if (parent.type === "LogicalExpression" && parent.left === node && parent.operator !== "??") {
    return foldLogical(fold, parent, truth);
  }
  return fold.fixer.replaceText(node, String(truth));
};
