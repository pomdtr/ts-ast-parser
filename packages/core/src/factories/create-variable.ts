import { DeclarationKind, JSDocTagName, Module, VariableDeclaration } from '../models/index.js';
import { getDecorators } from '../utils/decorator.js';
import { NodeFactory } from './node-factory.js';
import ts from 'typescript';
import {
    findJSDoc,
    getAllJSDoc,
    getTypeName,
    isFunctionDeclaration,
    resolveExpression,
    tryAddProperty,
} from '../utils/index.js';


export const variableFactory: NodeFactory<ts.VariableStatement> = {

    isNode: (node: ts.Node): node is ts.VariableStatement => {
        return !isFunctionDeclaration(node) && ts.isVariableStatement(node);
    },

    create: createVariable,

};

function createVariable(node: ts.VariableStatement, moduleDoc: Module): void {

    const jsDoc = getAllJSDoc(node);
    const decorators = getDecorators(node);
    const jsDocDefinedType = findJSDoc<string>(JSDocTagName.type, jsDoc)?.value;
    const jsDocDefaultValue = findJSDoc<string>(JSDocTagName.default, jsDoc)?.value;

    for (const declaration of node.declarationList.declarations) {
        const name = declaration?.name?.getText() ?? '';
        const defaultValue = jsDocDefaultValue ?? resolveExpression(declaration.initializer);
        const tmpl: VariableDeclaration = {
            kind: DeclarationKind.variable,
            name,
            type: jsDocDefinedType ? {text: jsDocDefinedType} : {text: getTypeName(declaration)},
        };

        if (defaultValue !== '') {
            tmpl.default = defaultValue;
        }

        tryAddProperty(tmpl, 'jsDoc', jsDoc);
        tryAddProperty(tmpl, 'decorators', decorators);

        moduleDoc.declarations.push(tmpl);
    }

}
