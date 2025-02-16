import { createTypeFromDeclaration } from "../factories/create-type.ts";
import { resolveExpression } from "../utils/resolve-expression.ts";
import type { VariableDeclaration } from "../models/variable.ts";
import { DeclarationKind } from "../models/declaration-kind.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ProjectContext } from "../project-context.ts";
import type { DeclarationNode } from "./declaration-node.ts";
import type { ReflectedNode } from "../reflected-node.ts";
import { getDecorators } from "../utils/decorator.ts";
import { getNamespace } from "../utils/namespace.ts";
import { DecoratorNode } from "./decorator-node.ts";
import { RootNodeType } from "../models/node.ts";
import { CommentNode } from "./comment-node.ts";
import type { Type } from "../models/type.ts";
import type ts from "typescript";

/**
 * Represents the reflected node of a variable declaration
 */
export class VariableNode implements DeclarationNode<VariableDeclaration, ts.VariableDeclaration> {
    private readonly _node: ts.VariableStatement;

    private readonly _declaration: ts.VariableDeclaration;

    private readonly _context: ProjectContext;

    private readonly _jsDoc: CommentNode;

    constructor(node: ts.VariableStatement, declaration: ts.VariableDeclaration, context: ProjectContext) {
        this._node = node;
        this._declaration = declaration;
        this._context = context;
        this._jsDoc = new CommentNode(this._node);
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getName(): string {
        return this._declaration.name.getText() ?? "";
    }

    getTSNode(): ts.VariableDeclaration {
        return this._declaration;
    }

    getNodeType(): RootNodeType {
        return RootNodeType.Declaration;
    }

    getKind(): DeclarationKind.Variable {
        return DeclarationKind.Variable;
    }

    getDecorators(): DecoratorNode[] {
        return getDecorators(this._node).map((d) => new DecoratorNode(d, this._context));
    }

    getLine(): number {
        return this._context.getLinePosition(this._node);
    }

    getType(): ReflectedNode<Type> {
        return createTypeFromDeclaration(this._declaration, this._context);
    }

    getValue(): unknown {
        const jsDocDefaultValue = this.getJSDoc().getTag("default")?.text;
        return jsDocDefaultValue ?? resolveExpression(this._declaration.initializer, this._context);
    }

    getNamespace(): string {
        return getNamespace(this._node);
    }

    getJSDoc(): CommentNode {
        return this._jsDoc;
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): VariableDeclaration {
        const defaultValue = this.getValue();
        const tmpl: VariableDeclaration = {
            name: this.getName(),
            kind: this.getKind(),
            line: this.getLine(),
            type: this.getType().serialize(),
        };

        if (defaultValue !== "") {
            tmpl.default = defaultValue;
        }

        tryAddProperty(tmpl, "jsDoc", this.getJSDoc().serialize());
        tryAddProperty(
            tmpl,
            "decorators",
            this.getDecorators().map((d) => d.serialize())
        );
        tryAddProperty(tmpl, "namespace", this.getNamespace());

        return tmpl;
    }
}
