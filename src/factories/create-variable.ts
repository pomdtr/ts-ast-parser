import type { VariableDeclaration } from "../models/variable.ts";
import type { ProjectContext } from "../project-context.ts";
import { isFunctionDeclaration } from "../utils/function.ts";
import { VariableNode } from "../nodes/variable-node.ts";
import { isClassDeclaration } from "../utils/class.ts";
import type { NodeFactory } from "./node-factory.ts";
import ts from "typescript";

export const variableFactory: NodeFactory<VariableDeclaration, VariableNode, ts.VariableStatement> = {
    isNode: (node: ts.Node): node is ts.VariableStatement => {
        return ts.isVariableStatement(node) && !isFunctionDeclaration(node) && !isClassDeclaration(node);
    },

    create: (node: ts.VariableStatement, context: ProjectContext): VariableNode[] => {
        const result: VariableNode[] = [];

        for (const declaration of node.declarationList.declarations) {
            const callback = () => new VariableNode(node, declaration, context);
            const reflectedNode = context.registerReflectedNode(declaration, callback);
            result.push(reflectedNode);
        }

        return result;
    },
};
