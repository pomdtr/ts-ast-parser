import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ReflectedRootNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import type { Export } from "../models/export.ts";
import { ExportKind } from "../models/export.ts";
import { RootNodeType } from "../models/node.ts";
import ts from "typescript";

/**
 * Represents the reflected node of a namespace export declaration.
 * For example: `export * as bar from './foo.js'`
 */
export class NamespaceExportNode implements ReflectedRootNode<Export, ts.ExportDeclaration> {
    private readonly _node: ts.ExportDeclaration;

    private readonly _context: ProjectContext;

    constructor(node: ts.ExportDeclaration, context: ProjectContext) {
        this._node = node;
        this._context = context;
    }

    getName(): string {
        if (!this._node.exportClause || !ts.isNamespaceExport(this._node.exportClause)) {
            return "";
        }

        return this._node.exportClause.name.escapedText ?? "";
    }

    getOriginalName(): string {
        return this.getName();
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getKind(): ExportKind {
        return ExportKind.Namespace;
    }

    getNodeType(): RootNodeType {
        return RootNodeType.Export;
    }

    getModule(): string {
        return this._node.moduleSpecifier?.getText() ?? "";
    }

    getTSNode(): ts.ExportDeclaration {
        return this._node;
    }

    isTypeOnly(): boolean {
        return this._node.isTypeOnly;
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): Export {
        const tmpl: Export = {
            name: this.getName(),
            kind: this.getKind(),
        };

        tryAddProperty(tmpl, "module", this.getModule());
        tryAddProperty(tmpl, "typeOnly", this.isTypeOnly());

        return tmpl;
    }
}
