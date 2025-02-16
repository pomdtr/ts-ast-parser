import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import { createType } from "../factories/create-type.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import ts from "typescript";

/**
 * Represents a type predicate.
 * For example: `function isString(x: unknown): x is string {}`
 */
export class TypePredicateNode implements ReflectedTypeNode<ts.TypePredicateNode> {
    private readonly _node: ts.TypePredicateNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.TypePredicateNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.TypePredicateNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Predicate;
    }

    getText(): string {
        const name = ts.isThisTypeNode(this._node.parameterName) ? "this" : this._node.parameterName.getText();
        const out = this.asserts() ? ["asserts", name] : [name];
        const targetType = this.getTargetType();

        if (targetType) {
            out.push("is", targetType.getText());
        }

        return out.join(" ");
    }

    getTargetType(): ReflectedTypeNode | null {
        if (!this._node.type) {
            return null;
        }

        return createType(this._node.type, this._context);
    }

    asserts(): boolean {
        return !!this._node.assertsModifier;
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
