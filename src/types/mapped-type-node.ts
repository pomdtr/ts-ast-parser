import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents a mapped type.
 * For example `type foo<T> = { [p in keyof T]: boolean; }`.
 */
export class MappedTypeNode implements ReflectedTypeNode<ts.MappedTypeNode> {
    private readonly _node: ts.MappedTypeNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.MappedTypeNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.MappedTypeNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Mapped;
    }

    getText(): string {
        return this._context.getTypeChecker().typeToString(this._type);
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
}
