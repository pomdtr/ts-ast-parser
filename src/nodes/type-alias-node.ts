import type { TypeAliasDeclaration } from "../models/type-alias.ts";
import { DeclarationKind } from "../models/declaration-kind.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ProjectContext } from "../project-context.ts";
import { TypeParameterNode } from "./type-parameter-node.ts";
import type { DeclarationNode } from "./declaration-node.ts";
import type { ReflectedTypeNode } from "../reflected-node.ts";
import { createType } from "../factories/create-type.ts";
import { getNamespace } from "../utils/namespace.ts";
import { RootNodeType } from "../models/node.ts";
import { CommentNode } from "./comment-node.ts";
import type ts from "typescript";

/**
 * Represents the reflected node of a type alias declaration
 */
export class TypeAliasNode implements DeclarationNode<TypeAliasDeclaration, ts.TypeAliasDeclaration> {
    private readonly _node: ts.TypeAliasDeclaration;

    private readonly _context: ProjectContext;

    private readonly _jsDoc: CommentNode;

    constructor(node: ts.TypeAliasDeclaration, context: ProjectContext) {
        this._node = node;
        this._context = context;
        this._jsDoc = new CommentNode(this._node);
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.TypeAliasDeclaration {
        return this._node;
    }

    getNodeType(): RootNodeType {
        return RootNodeType.Declaration;
    }

    getKind(): DeclarationKind.TypeAlias {
        return DeclarationKind.TypeAlias;
    }

    getName(): string {
        return this._node.name.getText() ?? "";
    }

    getLine(): number {
        return this._context.getLinePosition(this._node);
    }

    getNamespace(): string {
        return getNamespace(this._node);
    }

    getJSDoc(): CommentNode {
        return this._jsDoc;
    }

    getValue(): ReflectedTypeNode {
        return createType(this._node.type, this._context);
    }

    getTypeParameters(): TypeParameterNode[] {
        return this._node.typeParameters?.map((tp) => new TypeParameterNode(tp, this._context)) ?? [];
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): TypeAliasDeclaration {
        const tmpl: TypeAliasDeclaration = {
            name: this.getName(),
            kind: this.getKind(),
            line: this.getLine(),
            value: this.getValue().serialize(),
        };

        tryAddProperty(tmpl, "namespace", this.getNamespace());
        tryAddProperty(tmpl, "jsDoc", this.getJSDoc().serialize());
        tryAddProperty(
            tmpl,
            "typeParameters",
            this.getTypeParameters().map((tp) => tp.serialize())
        );

        return tmpl;
    }
}
