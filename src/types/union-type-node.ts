import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import { createType } from "../factories/create-type.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents a union type.
 * For example: `type foo = string | number`
 */
export class UnionTypeNode implements ReflectedTypeNode<ts.UnionTypeNode> {
    private readonly _node: ts.UnionTypeNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.UnionTypeNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.UnionTypeNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Union;
    }

    getText(): string {
        try {
            return this._node.getText() ?? "";
        } catch (_) {
            return this._context.getTypeChecker().typeToString(this._type) ?? "";
        }
    }

    getElements(): ReflectedTypeNode[] {
        return this._node.types.map((typeNode) => createType(typeNode, this._context));
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
            elements: this.getElements().map((e) => e.serialize()),
        };
    }
}
