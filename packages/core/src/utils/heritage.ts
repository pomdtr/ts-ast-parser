import type { Reference, SourceReference } from '../models/reference.js';
import { DeclarationKind } from '../models/declaration-kind.js';
import type { InterfaceOrClassDeclaration } from './is.js';
import { tryAddProperty } from './try-add-property.js';
import type { AnalyzerContext } from '../context.js';
import { getLocation } from './get-location.js';
import { isThirdParty } from './import.js';
import { hasFlag } from './member.js';
import ts from 'typescript';


export function isCustomElement(node: InterfaceOrClassDeclaration, context: AnalyzerContext): boolean {
    const type = context.checker.getTypeAtLocation(node);
    const baseTypes = context.checker.getBaseTypes(type as ts.InterfaceType);

    for (const baseType of baseTypes) {
        if (hasHTMLElementAsBase(baseType, context.checker)) {
            return true;
        }
    }

    return false;
}

export function hasHTMLElementAsBase(type: ts.Type, checker: ts.TypeChecker): boolean {
    const name = type.getSymbol()?.getName();

    if (name === 'HTMLElement') {
        return true;
    }

    return checker.getBaseTypes(type as ts.InterfaceType).some(t => hasHTMLElementAsBase(t, checker));
}

export function getExtendClauseReferences(node: InterfaceOrClassDeclaration, context: AnalyzerContext): Reference[] {
    const heritageClauses = node.heritageClauses ?? [];
    const references: Reference[] = [];

    for (const heritageClause of heritageClauses) {
        const types = heritageClause.types ?? [];

        for (const type of types) {
            const ref = createReference(type, context);

            if (!ref) {
                continue;
            }

            references.push(ref);
        }
    }

    return references;
}

export function createReference(type: ts.ExpressionWithTypeArguments, context: AnalyzerContext): Reference | null {
    const expr = type.expression;
    const typeArguments = type.typeArguments;

    if (!ts.isIdentifier(expr)) {
        return null;
    }

    const {path, symbol, line} = getLocation(expr, context);

    let name = expr.escapedText ?? '';

    if (typeArguments) {
        name += `<${getTypeArgumentNames(typeArguments).join(', ')}>`;
    }

    const sourceRef: SourceReference = {};
    const ref: Reference = {name};
    const isFromThirdParty = path && isThirdParty(path);

    if (path && !isFromThirdParty && line != null) {
        sourceRef.line = line;
        sourceRef.path = path;
    }

    tryAddProperty(ref, 'source', sourceRef);
    tryAddProperty(ref, 'kind', getInterfaceOrClassSymbolKind(symbol));

    return ref;
}

export function getTypeArgumentNames(typeArguments: ts.NodeArray<ts.TypeNode> | ts.TypeNode[]): string[] {
    const names: string[] = [];

    for (const typeArgument of typeArguments) {
        let name = '';

        if (ts.isTypeReferenceNode(typeArgument)) {
            name = typeArgument.typeName.getText() ?? '';

            if (typeArgument.typeArguments) {
                name += `<${getTypeArgumentNames(typeArgument.typeArguments).join(', ')}>`;
            }
        } else {
            name += typeArgument.getText();
        }

        names.push(name);
    }

    return names;
}

export function getInterfaceOrClassSymbolKind(symbol: ts.Symbol | undefined): DeclarationKind | null {
    if (!symbol) {
        return null;
    }

    return hasFlag(symbol.flags, ts.SymbolFlags.Class) ? DeclarationKind.Class : DeclarationKind.Interface;
}
