import type { InterfaceDeclaration } from "../models/interface.ts";
import type { ProjectContext } from "../project-context.ts";
import { InterfaceNode } from "../nodes/interface-node.ts";
import type { NodeFactory } from "./node-factory.ts";
import ts from "typescript";

export const interfaceFactory: NodeFactory<InterfaceDeclaration, InterfaceNode, ts.InterfaceDeclaration> = {
    isNode: (node: ts.Node): node is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(node),

    create: (node: ts.InterfaceDeclaration, context: ProjectContext): InterfaceNode[] => {
        const reflectedNode = context.registerReflectedNode(node, () => new InterfaceNode(node, context));
        return [reflectedNode];
    },
};
