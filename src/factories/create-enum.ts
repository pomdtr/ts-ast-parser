import type { ProjectContext } from "../project-context.ts";
import type { EnumDeclaration } from "../models/enum.ts";
import type { NodeFactory } from "./node-factory.ts";
import { EnumNode } from "../nodes/enum-node.ts";
import ts from "typescript";

export const enumFactory: NodeFactory<EnumDeclaration, EnumNode, ts.EnumDeclaration> = {
    isNode: (node: ts.Node): node is ts.EnumDeclaration => {
        return ts.isEnumDeclaration(node);
    },

    create: (node: ts.EnumDeclaration, context: ProjectContext): EnumNode[] => {
        const reflectedNode = context.registerReflectedNode(node, () => new EnumNode(node, context));
        return [reflectedNode];
    },
};
