import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import ts from "typescript";

/**
 * Represents a literal type.
 * For example: `type foo = 4`
 */
export class LiteralTypeNode implements ReflectedTypeNode<ts.LiteralTypeNode> {
    private readonly _node: ts.LiteralTypeNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.LiteralTypeNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.LiteralTypeNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Literal;
    }

    getText(): string {
        // The types of the TS Compiler API doesn't seem to be quite right here I think
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const kind = this._node.literal.kind as ts.SyntaxKind;

        switch (kind) {
            case ts.SyntaxKind.TrueKeyword:
                return "true";
            case ts.SyntaxKind.FalseKeyword:
                return "false";
            case ts.SyntaxKind.NullKeyword:
                return "null";
            case ts.SyntaxKind.PrefixUnaryExpression: {
                const operand = (this._node.literal as ts.PrefixUnaryExpression).operand;
                return this._getUnaryExpressionText(operand);
            }

            case ts.SyntaxKind.NumericLiteral:
                return (this._node.literal as ts.NumericLiteral).text;
            case ts.SyntaxKind.StringLiteral:
                return `"${(this._node.literal as ts.StringLiteral).text}"`;
            case ts.SyntaxKind.BigIntLiteral:
                return (this._node.literal as ts.BigIntLiteral).text;
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                return (this._node.literal as ts.NoSubstitutionTemplateLiteral).text;
            default:
                return "";
        }
    }

    /**
     * Serializes the reflected type
     *
     * @returns The type as a serializable object
     */
    serialize(): Type {
        return {
            text: this.getText(),
            kind: this.getKind(),
        };
    }

    private _getUnaryExpressionText(unaryExpression: ts.UnaryExpression): string {
        switch (unaryExpression.kind) {
            case ts.SyntaxKind.NumericLiteral:
                return this._node.literal.getText();
            case ts.SyntaxKind.BigIntLiteral:
                return this._node.literal.getText().replace("n", "");
            default:
                return "";
        }
    }
}
