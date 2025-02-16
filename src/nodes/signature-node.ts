import type { FunctionSignature } from "../models/function.ts";
import type { ProjectContext } from "../project-context.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import { TypeParameterNode } from "./type-parameter-node.ts";
import type { ReflectedNode } from "../reflected-node.ts";
import { createType } from "../factories/create-type.ts";
import { ParameterNode } from "./parameter-node.ts";
import type { Type } from "../models/type.ts";
import { CommentNode } from "./comment-node.ts";
import ts from "typescript";

/**
 * Represents the reflected node of a signature declaration
 */
export class SignatureNode implements ReflectedNode<FunctionSignature, ts.Signature> {
    private readonly _node: ts.Signature;

    private readonly _context: ProjectContext;

    private readonly _jsDoc: CommentNode;

    constructor(node: ts.Signature, context: ProjectContext) {
        this._node = node;
        this._context = context;
        this._jsDoc = new CommentNode(this._node.getDeclaration());
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getTSNode(): ts.Signature {
        return this._node;
    }

    getLine(): number {
        return this._context.getLinePosition(this._node.getDeclaration());
    }

    getPath(): string {
        const fileName = this._node.getDeclaration().getSourceFile().fileName ?? "";
        return fileName ? this._context.getSystem().realpath(fileName) : fileName;
    }

    getJSDoc(): CommentNode {
        return this._jsDoc;
    }

    getReturnType(): ReflectedNode<Type> {
        const jsDocType = ts.getJSDocReturnType(this._node.getDeclaration());

        if (jsDocType) {
            return createType(jsDocType, this._context);
        }

        const returnTypeOfSignature = this._context.getTypeChecker().getReturnTypeOfSignature(this._node);

        return createType(returnTypeOfSignature, this._context);
    }

    getTypeParameters(): TypeParameterNode[] {
        return this._node.getDeclaration().typeParameters?.map((tp) => new TypeParameterNode(tp, this._context)) ?? [];
    }

    getParameters(): ParameterNode[] {
        const symbolParameters = this._node.parameters ?? [];
        const declarationParameters = this._node.getDeclaration().parameters ?? [];
        const result: ParameterNode[] = [];

        for (let index = 0; index < declarationParameters.length; index++) {
            const paramNode = declarationParameters[index] as ts.ParameterDeclaration;
            const node = new ParameterNode(paramNode, symbolParameters[index] ?? null, this._context);

            if (node.getJSDoc().isIgnored()) {
                continue;
            }

            result.push(node);
        }

        return result;
    }

    getParameterByName(name: string): ParameterNode | null {
        return this.getParameters().find((param) => param.getName() === name) ?? null;
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): FunctionSignature {
        const tmpl: FunctionSignature = {
            return: {
                type: this.getReturnType().serialize(),
            },
        };

        tryAddProperty(tmpl, "line", this.getLine());
        tryAddProperty(tmpl, "jsDoc", this.getJSDoc().serialize());
        tryAddProperty(
            tmpl,
            "typeParameters",
            this.getTypeParameters().map((tp) => tp.serialize())
        );
        tryAddProperty(
            tmpl,
            "parameters",
            this.getParameters().map((param) => param.serialize())
        );

        return tmpl;
    }
}
