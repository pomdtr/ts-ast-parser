import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import { createType } from "../factories/create-type.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents the reflected array type.
 * For example: `type foo = string[]`
 */
export class ArrayTypeNode implements ReflectedTypeNode<ts.ArrayTypeNode> {
    private readonly _node: ts.ArrayTypeNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.ArrayTypeNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.ArrayTypeNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Array;
    }

    getText(): string {
        return `${this.getElementType().getText()}[]`;
    }

    getElementType(): ReflectedTypeNode {
        return createType(this._node.elementType, this._context);
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
            elementType: this.getElementType().serialize(),
        };
    }
}
