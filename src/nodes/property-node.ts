import { getVisibilityModifier, isAbstract, isOptional, isReadOnly, isStatic } from "../utils/member.ts";
import { createType, createTypeFromDeclaration } from "../factories/create-type.ts";
import type { PropertyLikeNode, SymbolWithContext } from "../utils/types.ts";
import { resolveExpression } from "../utils/resolve-expression.ts";
import type { Field, ModifierType } from "../models/member.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ProjectContext } from "../project-context.ts";
import { getReturnStatement } from "../utils/function.ts";
import type { ReflectedNode } from "../reflected-node.ts";
import { MemberKind } from "../models/member-kind.ts";
import { getDecorators } from "../utils/decorator.ts";
import { DecoratorNode } from "./decorator-node.ts";
import { CommentNode } from "./comment-node.ts";
import type { Type } from "../models/type.ts";
import ts from "typescript";

/**
 * Represents the reflected node of a property declaration
 */
export class PropertyNode implements ReflectedNode<Field, PropertyLikeNode> {
    private readonly _node: PropertyLikeNode;

    private readonly _nodeContext: SymbolWithContext | null;

    private readonly _context: ProjectContext;

    private readonly _jsDoc: CommentNode;

    constructor(node: PropertyLikeNode, nodeContext: SymbolWithContext | null, context: ProjectContext) {
        this._node = node;
        this._nodeContext = nodeContext;
        this._context = context;

        const [getter, setter] = this._getAccessors();

        if (getter) {
            this._jsDoc = new CommentNode(getter);
        } else if (setter) {
            this._jsDoc = new CommentNode(setter);
        } else {
            this._jsDoc = new CommentNode(this._node);
        }
    }

    getName(): string {
        const [getter, setter] = this._getAccessors();

        if (getter) {
            return getter.name.getText() ?? "";
        }

        if (setter) {
            return setter.name.getText() ?? "";
        }

        if (ts.isIdentifier(this._node.name)) {
            return this._node.name.escapedText ?? "";
        }

        return this._node.name.getText() ?? "";
    }

    getKind(): MemberKind.Property {
        return MemberKind.Property;
    }

    getTSNode(): PropertyLikeNode {
        return this._node;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getLine(): number {
        const [getter, setter] = this._getAccessors();

        if (getter) {
            return this._context.getLinePosition(getter);
        }

        if (setter) {
            return this._context.getLinePosition(setter);
        }

        return this._context.getLocation(this._node).line as number;
    }

    getType(): ReflectedNode<Type> {
        const jsDocType = ts.getJSDocType(this._node);

        if (jsDocType) {
            return createType(jsDocType, this._context);
        }

        if (this._nodeContext?.type) {
            return createType(this._nodeContext.type, this._context);
        }

        if (this._node.type) {
            return createType(this._node.type, this._context);
        }

        return createTypeFromDeclaration(this._node, this._context);
    }

    getDefault(): unknown {
        const jsDocDefaultValue = this.getJSDoc().getTag("default")?.text;
        const [getter, setter] = this._getAccessors();

        if (jsDocDefaultValue) {
            return jsDocDefaultValue;
        }

        if (getter) {
            return resolveExpression(getReturnStatement(getter.body)?.expression, this._context);
        }

        if (setter) {
            return undefined;
        }

        return resolveExpression((this._node as ts.PropertyDeclaration).initializer, this._context);
    }

    getModifier(): ModifierType | null {
        if (!ts.isClassElement(this._node)) {
            return null;
        }

        return getVisibilityModifier(this._node);
    }

    getJSDoc(): CommentNode {
        return this._jsDoc;
    }

    getDecorators(): DecoratorNode[] {
        const [getter, setter] = this._getAccessors();

        if (getter) {
            return getDecorators(getter).map((d) => new DecoratorNode(d, this._context));
        }

        if (setter) {
            return getDecorators(setter).map((d) => new DecoratorNode(d, this._context));
        }

        return getDecorators(this._node).map((d) => new DecoratorNode(d, this._context));
    }

    isOptional(): boolean {
        if (this._nodeContext) {
            return isOptional(this._nodeContext.symbol);
        }

        const symbol = this._context.getSymbol(this._node);

        return isOptional(symbol);
    }

    isStatic(): boolean {
        const [getter, setter] = this._getAccessors();

        if (getter) {
            return isStatic(getter);
        }

        if (setter) {
            return isStatic(setter);
        }

        return isStatic(this._node);
    }

    isReadOnly(): boolean {
        const readOnlyTag = !!this.getJSDoc().getTag("readonly");
        const [getter, setter] = this._getAccessors();

        return readOnlyTag || (!!getter && !setter) || isReadOnly(this._node);
    }

    isWriteOnly(): boolean {
        const [getter, setter] = this._getAccessors();

        return !getter && !!setter;
    }

    isAbstract(): boolean {
        return isAbstract(this._node);
    }

    isInherited(): boolean {
        return !this._nodeContext?.overrides && !!this._nodeContext?.inherited;
    }

    overrides(): boolean {
        return !!this._nodeContext?.overrides;
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): Field {
        const tmpl: Field = {
            name: this.getName(),
            kind: this.getKind(),
            type: this.getType().serialize(),
        };

        tryAddProperty(tmpl, "line", this.getLine());
        tryAddProperty(tmpl, "optional", this.isOptional());
        tryAddProperty(tmpl, "jsDoc", this.getJSDoc().serialize());
        tryAddProperty(
            tmpl,
            "decorators",
            this.getDecorators().map((d) => d.serialize())
        );
        tryAddProperty(tmpl, "default", this.getDefault());
        tryAddProperty(tmpl, "static", this.isStatic());
        tryAddProperty(tmpl, "readOnly", this.isReadOnly());
        tryAddProperty(tmpl, "abstract", this.isAbstract());
        tryAddProperty(tmpl, "override", this.overrides());
        tryAddProperty(tmpl, "inherited", this.isInherited());
        tryAddProperty(tmpl, "writeOnly", this.isWriteOnly());

        return tmpl;
    }

    private _getAccessors(): [ts.GetAccessorDeclaration | undefined, ts.SetAccessorDeclaration | undefined] {
        const decls = this._nodeContext?.symbol?.getDeclarations() ?? [];
        const getter = decls.find(ts.isGetAccessor);
        const setter = decls.find(ts.isSetAccessor);

        return [getter, setter];
    }
}
