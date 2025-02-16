import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import { PropertyNode } from "../nodes/property-node.ts";
import { FunctionNode } from "../nodes/function-node.ts";
import type { Method } from "../models/member.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import ts from "typescript";

/**
 * Represents a type literal.
 * For example: `type foo = {a: number}`
 */
export class TypeLiteralNode implements ReflectedTypeNode<ts.TypeLiteralNode> {
    private readonly _node: ts.TypeLiteralNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.TypeLiteralNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.TypeLiteralNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getText(): string {
        try {
            return this._node.getText() ?? "";
        } catch (_) {
            return this._context.getTypeChecker().typeToString(this._type) ?? "";
        }
    }

    getKind(): TypeKind {
        return TypeKind.TypeLiteral;
    }

    getProperties(): PropertyNode[] {
        const checker = this._context.getTypeChecker();
        const members = this._node.members ?? [];
        const result: PropertyNode[] = [];

        for (const member of members) {
            if (!ts.isPropertySignature(member)) {
                continue;
            }

            const symbol = this._context.getSymbol(member);
            const type = symbol && checker.getTypeOfSymbolAtLocation(symbol, this._node);

            result.push(new PropertyNode(member, { symbol, type }, this._context));
        }

        return result;
    }

    getMethods(): FunctionNode[] {
        const checker = this._context.getTypeChecker();
        const members = this._node.members ?? [];
        const result: FunctionNode[] = [];

        for (const member of members) {
            if (!ts.isMethodSignature(member)) {
                continue;
            }

            const symbol = this._context.getSymbol(member);
            const type = symbol && checker.getTypeOfSymbolAtLocation(symbol, this._node);

            result.push(new FunctionNode(member, { symbol, type }, this._context));
        }

        return result;
    }

    /**
     * Serializes the reflected type
     *
     * @returns The type as a serializable object
     */
    serialize(): Type {
        const tmpl: Type = {
            text: this.getText(),
            kind: this.getKind(),
        };

        tryAddProperty(
            tmpl,
            "properties",
            this.getProperties().map((p) => p.serialize())
        );
        tryAddProperty(
            tmpl,
            "methods",
            this.getMethods().map((m) => m.serialize() as Method)
        );

        return tmpl;
    }
}
