import { getOriginalImportPath, isBareModuleSpecifier, matchesTsConfigPath } from '../utils/import.js';
import { tryAddProperty } from '../utils/try-add-property.js';
import { Import, ImportKind } from '../models/import.js';
import { ReflectedNode } from './reflected-node.js';
import { AnalyzerContext } from '../context.js';
import { NodeType } from '../models/node.js';
import ts from 'typescript';


export class DefaultImportNode implements ReflectedNode<Import, ts.ImportDeclaration> {

    private readonly _node: ts.ImportDeclaration;

    private readonly _context: AnalyzerContext;

    constructor(node: ts.ImportDeclaration, context: AnalyzerContext) {
        this._node = node;
        this._context = context;
    }

    getName(): string {
        const identifier = this._node.importClause?.name;

        return identifier?.escapedText ?? '';
    }

    getTSNode(): ts.ImportDeclaration {
        return this._node;
    }

    getContext(): AnalyzerContext {
        return this._context;
    }

    getNodeType(): NodeType {
        return NodeType.Import;
    }

    getKind(): ImportKind {
        return ImportKind.Default;
    }

    getReferenceName(): string {
        return this.getName();
    }

    getImportPath(): string {
        return (this._node.moduleSpecifier as ts.StringLiteral)?.text ?? '';
    }

    getOriginalPath(): string {
        const identifier = this._node.importClause?.name;
        const importPath = this.getImportPath();

        return matchesTsConfigPath(importPath, this._context.compilerOptions)
            ? getOriginalImportPath(identifier, this._context)
            : importPath;
    }

    isTypeOnly(): boolean {
        return !!this._node?.importClause?.isTypeOnly;
    }

    isBareModuleSpecifier(): boolean {
        return isBareModuleSpecifier(this.getImportPath());
    }

    toPOJO(): Import {
        const originalPath = this.getOriginalPath();
        const tmpl: Import = {
            name: this.getName(),
            kind: this.getKind(),
            importPath: this.getImportPath(),
        };

        if (originalPath !== tmpl.importPath) {
            tmpl.originalPath = originalPath;
        }

        tryAddProperty(tmpl, 'isTypeOnly', this.isTypeOnly());
        tryAddProperty(tmpl, 'isBareModuleSpecifier', this.isBareModuleSpecifier());

        return tmpl;
    }

}
