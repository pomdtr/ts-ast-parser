import type { ProjectContext } from "../project-context.ts";
import type { ReflectedRootNode } from "../reflected-node.ts";
import { hasDefaultKeyword } from "../utils/export.ts";
import type { Export } from "../models/export.ts";
import { ExportKind } from "../models/export.ts";
import { RootNodeType } from "../models/node.ts";
import type ts from "typescript";

export type ExportDeclarationNodeType =
    | ts.FunctionDeclaration
    | ts.ClassDeclaration
    | ts.InterfaceDeclaration
    | ts.EnumDeclaration
    | ts.TypeAliasDeclaration
    | ts.VariableStatement;

/**
 * Represents the reflected node of an export declaration.
 * For example: `export const x = 4` or `export class Foo {}`
 */
export class ExportDeclarationNode implements ReflectedRootNode<Export, ExportDeclarationNodeType> {
    private readonly _node: ExportDeclarationNodeType;

    private readonly _declaration: ts.VariableDeclaration | null = null;

    private readonly _context: ProjectContext;

    constructor(node: ExportDeclarationNodeType, context: ProjectContext, declaration?: ts.VariableDeclaration) {
        this._node = node;
        this._declaration = declaration ?? null;
        this._context = context;
    }

    getName(): string {
        if (this._declaration) {
            return this._declaration.name.getText() ?? "";
        }

        return (this._node as Exclude<ExportDeclarationNodeType, ts.VariableStatement>).name?.getText() ?? "";
    }

    /**
     * The qualified name of the symbol is considered the name of the symbol including the
     * parent namespaces where the symbol is defined.
     *
     * For example: `<NamespaceName1>.<Namespace2>.<SymbolName>`
     *
     * @returns The name of the symbol prefixed by any parent namespace is inside
     */
    getFullyQualifiedName(): string {
        const node = this._declaration ?? this._node;
        const symbol = this._context.getSymbol(node);

        if (symbol) {
            const fullyQualifiedName = this._context.getTypeChecker().getFullyQualifiedName(symbol);
            return fullyQualifiedName.split(".").slice(1).join(".");
        }

        return this.getName();
    }

    getOriginalName(): string {
        return this.getName();
    }

    getNodeType(): RootNodeType {
        return RootNodeType.Export;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getKind(): ExportKind {
        return hasDefaultKeyword(this._node) ? ExportKind.Default : ExportKind.Named;
    }

    getTSNode(): ExportDeclarationNodeType {
        return this._node;
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): Export {
        return {
            name: this.getFullyQualifiedName(),
            kind: this.getKind(),
        };
    }
}
