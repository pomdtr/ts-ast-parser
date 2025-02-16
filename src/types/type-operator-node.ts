import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import { createType } from "../factories/create-type.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents a type operator.
 * For example: `type foo = readonly string[]`
 */
export class TypeOperatorNode implements ReflectedTypeNode<ts.TypeOperatorNode> {
    private readonly _node: ts.TypeOperatorNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.TypeOperatorNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.TypeOperatorNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Operator;
    }

    getText(): string {
        try {
            return this._node.getText() ?? "";
        } catch (_) {
            return this._context.getTypeChecker().typeToString(this._type) ?? "";
        }
    }

    getElementType(): ReflectedTypeNode {
        return createType(this._node.type, this._context);
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
