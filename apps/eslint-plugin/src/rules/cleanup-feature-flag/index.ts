// ESLint rule to clean up feature flags based on strategy
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

type Node = TSESTree.Node;
type Literal = TSESTree.Literal;
type Identifier = TSESTree.Identifier;
type BlockStatement = TSESTree.BlockStatement;
type RuleFixer = TSESLint.RuleFixer;
type Fix = TSESLint.RuleFix;
type Expression = TSESTree.Expression;
type VariableDeclaration = TSESTree.VariableDeclaration;

export interface RuleOptions {
  featureFlags?: Record<string, {
    expires: string;
    description?: string;
  }>;
  identifiers?: string[];
  flagsToCleanup?: Record<string, CleanupStrategy>;
}

type Options = [RuleOptions?];
type CleanupStrategy = 'preserve-enabled-path' | 'preserve-disabled-path' | 'remove-entirely';
type FlagsToCleanup = Record<string, CleanupStrategy>;
type MessageIds = 'cleanupFeatureFlag';

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Clean up feature flags based on specified strategy',
    },
    messages: {
      cleanupFeatureFlag: 'Feature flag "{{name}}" should be cleaned up using strategy "{{strategy}}"',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          featureFlags: {
            type: 'object',
            additionalProperties: {
              type: 'object',
              properties: {
                expires: { type: 'string' },
                description: { type: 'string' },
              },
              required: ['expires'],
              additionalProperties: false,
            },
          },
          identifiers: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          flagsToCleanup: {
            type: 'object',
            additionalProperties: {
              type: 'string',
              enum: ['preserve-enabled-path', 'preserve-disabled-path', 'remove-entirely'],
            },
          },
        },
        required: ['flagsToCleanup'],
        additionalProperties: false,
      },
    ],
  },
  create(context: TSESLint.RuleContext<MessageIds, Options>) {
    const options = context.options[0] || {};
    const flagsToCleanup: FlagsToCleanup = options.flagsToCleanup || {};
    const identifiers: string[] = options.identifiers || ['getFeatureFlag'];
    
    function getFeatureFlagName(node: TSESTree.CallExpression): string | null {
      if (
        node.callee.type !== AST_NODE_TYPES.Identifier ||
        !identifiers.includes((node.callee as Identifier).name) ||
        node.arguments.length === 0
      ) {
        return null;
      }

      const arg = node.arguments[0];
      if (arg.type !== AST_NODE_TYPES.Literal || typeof (arg as Literal).value !== 'string') {
        return null;
      }

      const flagName = (arg as Literal).value as string;
      return flagsToCleanup[flagName] ? flagName : null;
    }

    function getBlockContent(node: Node): string {
      if (!node || node.type !== AST_NODE_TYPES.BlockStatement) {
        return context.getSourceCode().getText(node);
      }
      
      const blockNode = node as BlockStatement;
      if (!blockNode.body || blockNode.body.length === 0) {
        return '';
      }
      
      if (blockNode.body.length === 1) {
        const sourceCode = context.getSourceCode();
        const statementText = sourceCode.getText(blockNode.body[0]);
        
        const statementLines = statementText.split('\n');
        if (statementLines.length > 1) {
          const baseIndentMatch = statementLines[0].match(/^\s*/);
          const baseIndent = baseIndentMatch ? baseIndentMatch[0] : '';
          return statementLines
            .map((line, i) => i === 0 ? line : line.replace(/^\s*/, baseIndent))
            .join('\n');
        }
        
        return statementText;
      }
      
      const sourceCode = context.getSourceCode();
      const blockText = sourceCode.getText(node);
      const openBraceIndex = blockText.indexOf('{');
      const closeBraceIndex = blockText.lastIndexOf('}');
      
      if (openBraceIndex !== -1 && closeBraceIndex !== -1) {
        const blockContent = blockText.substring(openBraceIndex + 1, closeBraceIndex);
        
        const lines = blockContent.split('\n');
        if (lines.length > 2) {
          const baseIndentMatch = lines.slice(1).find(line => line.trim())?.match(/^\s*/);
          if (baseIndentMatch && baseIndentMatch[0]) {
            const baseIndent = baseIndentMatch[0];
            return lines.map(line => 
              line.startsWith(baseIndent) ? line.replace(baseIndent, '') : line
            ).join('\n').trim();
          }
        }
        
        return blockContent.trim();
      }
      
      return blockText;
    }

    function applyFix(fixer: RuleFixer, node: Node, strategy: CleanupStrategy): Fix | null {
      const isInVariableDecl = node.parent && 
        (node.parent.type === AST_NODE_TYPES.VariableDeclarator || 
         (node.parent.type === AST_NODE_TYPES.AssignmentExpression && node.parent.right === node));

      switch (strategy) {
        case 'preserve-enabled-path':
          if (node.type === AST_NODE_TYPES.IfStatement) {
            return fixer.replaceText(node, getBlockContent(node.consequent));
          } else if (node.type === AST_NODE_TYPES.ConditionalExpression) {
            return fixer.replaceText(node, context.getSourceCode().getText(node.consequent));
          } else if (node.type === AST_NODE_TYPES.LogicalExpression && node.operator === '&&') {
            return fixer.replaceText(node, context.getSourceCode().getText(node.right));
          } else if (node.type === AST_NODE_TYPES.LogicalExpression && node.operator === '||') {
            if (isInVariableDecl) {
              return fixer.replaceText(node, context.getSourceCode().getText(node.right));
            }
            return fixer.remove(node);
          }
          break;
          
        case 'preserve-disabled-path':
          if (node.type === AST_NODE_TYPES.IfStatement) {
            if (!node.alternate) {
              return fixer.remove(node);
            }
            return fixer.replaceText(node, getBlockContent(node.alternate));
          } else if (node.type === AST_NODE_TYPES.ConditionalExpression) {
            return fixer.replaceText(node, context.getSourceCode().getText(node.alternate));
          } else if (node.type === AST_NODE_TYPES.LogicalExpression && node.operator === '&&') {
            if (isInVariableDecl) {
              const parent = node.parent as { id?: { name: string } };
              if (parent?.id?.name) {
                const varName = parent.id.name.toLowerCase();
                if (varName.includes('theme')) return fixer.replaceText(node, "'light'");
                if (varName.includes('enabled') || varName.includes('active')) return fixer.replaceText(node, 'false');
                if (varName.includes('count') || varName.includes('index')) return fixer.replaceText(node, '0');
              }
              return fixer.replaceText(node, "''");
            }
            return fixer.remove(node);
          } else if (node.type === AST_NODE_TYPES.LogicalExpression && node.operator === '||') {
            return fixer.replaceText(node, context.getSourceCode().getText(node.right));
          }
          break;
          
        case 'remove-entirely':
          if (isInVariableDecl) {
            if (node.type === AST_NODE_TYPES.ConditionalExpression) {
              return fixer.replaceText(node, context.getSourceCode().getText(node.alternate));
            }
            
            if (node.type === AST_NODE_TYPES.LogicalExpression) {
              if (node.operator === '&&') {
                const rightText = context.getSourceCode().getText(node.right);
                  
                if (/^(true|false)$/.test(rightText)) {
                  return fixer.replaceText(node, 'false');
                } else if (/^(['"`]).*\1$/.test(rightText)) {
                  return fixer.replaceText(node, "''");
                } else if (/^\d+$/.test(rightText)) {
                  return fixer.replaceText(node, '0');
                }
              }
              
              if (node.operator === '||') {
                return fixer.replaceText(node, context.getSourceCode().getText(node.right));
              }
            }
            
            return fixer.replaceText(node, 'false');
          }
          
          if (node.type === AST_NODE_TYPES.LogicalExpression && node.parent?.type === AST_NODE_TYPES.ExpressionStatement) {
            return fixer.remove(node.parent);
          }
          
          if (node.type === AST_NODE_TYPES.ConditionalExpression) {
            const falsePathValue = context.getSourceCode().getText(node.alternate);
            
            if (node.parent?.type === AST_NODE_TYPES.BinaryExpression ||
                node.parent?.type === AST_NODE_TYPES.CallExpression || 
                node.parent?.type === AST_NODE_TYPES.MemberExpression) {
              return fixer.replaceText(node, falsePathValue);
            }
            
            return fixer.replaceText(node, falsePathValue);
          }
          
          return fixer.remove(node);
      }
      
      return null;
    }

    return {
      VariableDeclaration(node: VariableDeclaration) {
        for (const declaration of node.declarations) {
          const init = declaration.init;
          if (!init) continue;
          
          if (init.type === AST_NODE_TYPES.ConditionalExpression && 
              init.test.type === AST_NODE_TYPES.CallExpression) {
            const flagName = getFeatureFlagName(init.test);
            
            if (flagName) {
              const strategy = flagsToCleanup[flagName];
              context.report({
                node: init,
                messageId: 'cleanupFeatureFlag',
                data: { name: flagName, strategy },
                fix(fixer) {
                  return applyFix(fixer, init, strategy);
                }
              });
            }
          }
          
          if (init.type === AST_NODE_TYPES.LogicalExpression) {
            if (init.left.type === AST_NODE_TYPES.CallExpression) {
              const flagName = getFeatureFlagName(init.left);
              if (flagName) {
                const strategy = flagsToCleanup[flagName];
                
                if (strategy === 'preserve-enabled-path' && 
                    init.operator === '&&' && 
                    init.right.type === AST_NODE_TYPES.LogicalExpression) {
                  context.report({
                    node: init,
                    messageId: 'cleanupFeatureFlag',
                    data: { name: flagName, strategy },
                    fix(fixer) {
                      return fixer.replaceText(init, context.getSourceCode().getText(init.right));
                    }
                  });
                  return;
                }
                
                context.report({
                  node: init,
                  messageId: 'cleanupFeatureFlag',
                  data: { name: flagName, strategy },
                  fix(fixer) {
                    return applyFix(fixer, init, strategy);
                  }
                });
              }
            } else if (init.left.type === AST_NODE_TYPES.LogicalExpression) {
              const processNestedExpression = (expr: Expression): CleanupStrategy | null => {
                if (expr.type === AST_NODE_TYPES.CallExpression) {
                  const flagName = getFeatureFlagName(expr);
                  return flagName ? flagsToCleanup[flagName] : null;
                }
                if (expr.type === AST_NODE_TYPES.LogicalExpression && 
                    expr.left.type === AST_NODE_TYPES.CallExpression) {
                  const flagName = getFeatureFlagName(expr.left);
                  return flagName ? flagsToCleanup[flagName] : null;
                }
                if (expr.type === AST_NODE_TYPES.LogicalExpression && 
                    expr.left.type === AST_NODE_TYPES.LogicalExpression) {
                  return processNestedExpression(expr.left);
                }
                return null;
              };
              
              const strategy = processNestedExpression(init.left);
              if (strategy) {
                context.report({
                  node: init,
                  messageId: 'cleanupFeatureFlag',
                  data: { name: 'multiple-flags', strategy },
                  fix(fixer) {
                    if (strategy === 'preserve-enabled-path' && 
                        init.operator === '&&' && 
                        init.right.type === AST_NODE_TYPES.LogicalExpression) {
                      return fixer.replaceText(init, context.getSourceCode().getText(init.right));
                    }
                    return applyFix(fixer, init, strategy);
                  }
                });
              }
            }
          }
        }
      },

      IfStatement(node: TSESTree.IfStatement) {
        if (node.test.type === AST_NODE_TYPES.CallExpression) {
          const flagName = getFeatureFlagName(node.test);
          
          if (flagName) {
            const strategy = flagsToCleanup[flagName];
            context.report({
              node,
              messageId: 'cleanupFeatureFlag',
              data: { name: flagName, strategy },
              fix(fixer) {
                return applyFix(fixer, node, strategy);
              }
            });
          }
        }
      },
      
      ConditionalExpression(node: TSESTree.ConditionalExpression) {
        if (node.parent?.type === AST_NODE_TYPES.VariableDeclarator) {
          return;
        }
        
        if (node.test.type === AST_NODE_TYPES.CallExpression) {
          const flagName = getFeatureFlagName(node.test);
          
          if (flagName) {
            const strategy = flagsToCleanup[flagName];
            context.report({
              node,
              messageId: 'cleanupFeatureFlag',
              data: { name: flagName, strategy },
              fix(fixer) {
                return applyFix(fixer, node, strategy);
              }
            });
          }
        }
      },
      
      LogicalExpression(node: TSESTree.LogicalExpression) {
        if (node.left.type === AST_NODE_TYPES.CallExpression) {
          const flagName = getFeatureFlagName(node.left);
          
          if (flagName) {
            const strategy = flagsToCleanup[flagName];
            context.report({
              node,
              messageId: 'cleanupFeatureFlag', 
              data: { name: flagName, strategy },
              fix(fixer) {
                return applyFix(fixer, node, strategy);
              }
            });
          }
        }
      }
    };
  }
};

export default rule 