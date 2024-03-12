import type { ReflectedNode, ReflectedTypeNode } from "../reflected-node.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ProjectContext } from "../project-context.ts";
import type { IndexSignature } from "../models/interface.ts";
import { createType } from "../factories/create-type.ts";
import type { SymbolWithContext } from "../utils/types.ts";
import { MemberKind } from "../models/member-kind.ts";
import { ParameterNode } from "./parameter-node.ts";
import type { Type } from "../models/type.ts";
import { CommentNode } from "./comment-node.ts";
import type ts from "typescript";

/**
 * Represents the reflected node of an index signature in an interface or in a type literal.
 * For example: `{ [key: string]: number }`
 */
export class IndexSignatureNode implements ReflectedNode<IndexSignature, ts.IndexSignatureDeclaration> {
    private readonly _node: ts.IndexSignatureDeclaration;

    private readonly _member: SymbolWithContext;

    private readonly _context: ProjectContext;

    private readonly _parameter: ParameterNode | null;

    private readonly _jsDoc: CommentNode;

    constructor(node: ts.IndexSignatureDeclaration, member: SymbolWithContext, context: ProjectContext) {
        this._node = node;
        this._member = member;
        this._context = context;
        this._parameter = this._getParameter();
        this._jsDoc = new CommentNode(this._node);
    }

    getName(): string {
        return this._parameter?.getName() ?? "";
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getKind(): MemberKind {
        return MemberKind.IndexSignature;
    }

    getTSNode(): ts.IndexSignatureDeclaration {
        return this._node;
    }

    getJSDoc(): CommentNode {
        return this._jsDoc;
    }

    getLine(): number {
        return this._context.getLinePosition(this._node);
    }

    getType(): ReflectedTypeNode {
        return createType(this._node.type, this._context);
    }

    getIndexType(): ReflectedNode<Type> | null {
        return this._parameter?.getType() ?? null;
    }

    isOptional(): boolean {
        return !!this._parameter?.isOptional();
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): IndexSignature {
        const tmpl: IndexSignature = {
            name: this.getName(),
            line: this.getLine(),
            kind: MemberKind.IndexSignature,
            type: this.getType().serialize(),
        };

        tryAddProperty(tmpl, "indexType", this.getIndexType()?.serialize());
        tryAddProperty(tmpl, "optional", this.isOptional());
        tryAddProperty(tmpl, "jsDoc", this.getJSDoc().serialize());

        return tmpl;
    }

    private _getParameter(): ParameterNode | null {
        const callSignature = this._member.type?.getCallSignatures()?.[0];
        const nodeParameters = this._node.parameters ?? [];
        const symbolParameters = callSignature?.parameters ?? [];
        const nodeParam = nodeParameters[0];
        const symbolParam = symbolParameters[0] ?? null;

        if (!nodeParam) {
            return null;
        }

        return new ParameterNode(nodeParam, symbolParam, this._context);
    }
}
