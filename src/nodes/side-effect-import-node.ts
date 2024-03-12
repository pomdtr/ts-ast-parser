import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ReflectedRootNode } from "../reflected-node.ts";
import type { ProjectContext } from "../project-context.ts";
import { isBareModuleSpecifier } from "../utils/import.ts";
import type { Import } from "../models/import.ts";
import { ImportKind } from "../models/import.ts";
import { RootNodeType } from "../models/node.ts";
import type ts from "typescript";

/**
 * Represents the reflected node of a side effect import declaration.
 * For example: `import './foo.ts'`
 */
export class SideEffectImportNode implements ReflectedRootNode<Import, ts.ImportDeclaration> {
    private readonly _node: ts.ImportDeclaration;

    private readonly _context: ProjectContext;

    constructor(node: ts.ImportDeclaration, context: ProjectContext) {
        this._node = node;
        this._context = context;
    }

    getTSNode(): ts.ImportDeclaration {
        return this._node;
    }

    getNodeType(): RootNodeType {
        return RootNodeType.Import;
    }

    getKind(): ImportKind.SideEffect {
        return ImportKind.SideEffect;
    }

    getContext(): ProjectContext {
        return this._context;
    }

    getImportPath(): string {
        return (this._node.moduleSpecifier as ts.StringLiteral).text ?? "";
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
        const tmpl: Import = {
            kind: ImportKind.SideEffect,
            importPath: this.getImportPath(),
        };

        tryAddProperty(tmpl, "bareModuleSpecifier", this.isBareModuleSpecifier());

        return tmpl;
    }
}
