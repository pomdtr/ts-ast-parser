import { getOriginalImportPath, isBareModuleSpecifier, matchesTsConfigPath } from "../utils/import.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ReflectedRootNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import type { Import } from "../models/import.ts";
import { ImportKind } from "../models/import.ts";
import { RootNodeType } from "../models/node.ts";
import type ts from "typescript";

/**
 * Represents the reflected node of a named import declaration.
 * For example: `import { x } from 'y'`
 */
export class NamedImportNode implements ReflectedRootNode<Import, ts.ImportDeclaration> {
    private readonly _node: ts.ImportDeclaration;

    private readonly _element: ts.ImportSpecifier;

    private readonly _context: ProjectContext;

    constructor(node: ts.ImportDeclaration, element: ts.ImportSpecifier, context: ProjectContext) {
        this._node = node;
        this._element = element;
        this._context = context;
    }

    getTSNode(): ts.ImportDeclaration {
        return this._node;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getName(): string {
        return this._element.name.escapedText ?? "";
    }

    getReferenceName(): string {
        return this._element.propertyName?.escapedText ?? this.getName();
    }

    getNodeType(): RootNodeType {
        return RootNodeType.Import;
    }

    getKind(): ImportKind {
        return ImportKind.Named;
    }

    getImportPath(): string {
        return (this._node.moduleSpecifier as ts.StringLiteral).text ?? "";
    }

    getOriginalPath(): string {
        const importPath = this.getImportPath();
        const compilerOptions = this._context.getCommandLine().options;

        return matchesTsConfigPath(importPath, compilerOptions)
            ? getOriginalImportPath(this._element.name, this._context)
            : importPath;
    }

    isTypeOnly(): boolean {
        return !!this._node.importClause?.isTypeOnly || this._element.isTypeOnly;
    }

    isBareModuleSpecifier(): boolean {
        return isBareModuleSpecifier(this.getImportPath());
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): Import {
        const originalPath = this.getOriginalPath();
        const referenceName = this.getReferenceName();
        const tmpl: Import = {
            name: this.getName(),
            kind: this.getKind(),
            importPath: this.getImportPath(),
        };

        if (referenceName !== tmpl.name) {
            tmpl.referenceName = referenceName;
        }

        if (originalPath !== tmpl.importPath) {
            tmpl.originalPath = originalPath;
        }

        tryAddProperty(tmpl, "typeOnly", this.isTypeOnly());
        tryAddProperty(tmpl, "bareModuleSpecifier", this.isBareModuleSpecifier());

        return tmpl;
    }
}
