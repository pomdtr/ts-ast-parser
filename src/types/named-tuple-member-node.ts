import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ReflectedTypeNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import type { NamedTupleMember } from "../models/type.ts";
import { createType } from "../factories/create-type.ts";
import { TypeKind } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents a named tuple member.
 * For example: `type foo = [name: string]`.
 */
export class NamedTupleMemberNode implements ReflectedTypeNode<ts.NamedTupleMember> {
    private readonly _node: ts.NamedTupleMember;

    private readonly _type: ts.Type;

    private readonly _context: ProjectContext;

    constructor(node: ts.NamedTupleMember, type: ts.Type, context: ProjectContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.NamedTupleMember {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.NamedTupleMember;
    }

    getText(): string {
        return `${this.getName()}: ${this.getType().getText()}`;
    }

    getName(): string {
        return this._node.name.getText() ?? "";
    }

    getType(): ReflectedTypeNode {
        return createType(this._node.type, this._context);
    }

    isOptional(): boolean {
        return !!this._node.questionToken;
    }

    /**
     * Serializes the reflected type
     *
     * @returns The type as a serializable object
     */
    serialize(): NamedTupleMember {
        const tmpl: NamedTupleMember = {
            name: this.getName(),
            ...this.getType().serialize(),
        };

        tryAddProperty(tmpl, "optional", this.isOptional());

        return tmpl;
    }
}
