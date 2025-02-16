import type { ReflectedTypeNode } from "../reflected-node.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ProjectContext } from "../project-context.ts";
import { createType } from "../factories/create-type.ts";
import type { Type } from "../models/type.ts";
import { TypeKind } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents the reflected infer type
 * For example: `type foo<T> = T extends Promise<infer U> ? U : never`
 */
export class InferTypeNode implements ReflectedTypeNode<ts.InferTypeNode> {
    private readonly _node: ts.InferTypeNode;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.InferTypeNode, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.InferTypeNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Infer;
    }

    getText(): string {
        const constraint = this.getConstraint();
        const name = this._node.typeParameter.name.text;

        if (constraint) {
            return `infer ${name} extends ${constraint.getText()}`;
        }

        return `infer ${name}`;
    }

    getConstraint(): ReflectedTypeNode | null {
        const constraint = this._node.typeParameter.constraint;

        if (!constraint) {
            return null;
        }

        return createType(constraint, this._context);
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

        tryAddProperty(tmpl, "constraint", this.getConstraint()?.serialize());

        return tmpl;
    }
}
