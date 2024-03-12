import type { TypeAliasDeclaration } from "../models/type-alias.ts";
import type { ProjectContext } from "../project-context.ts";
import { TypeAliasNode } from "../nodes/type-alias-node.ts";
import type { NodeFactory } from "./node-factory.ts";
import ts from "typescript";

export const typeAliasFactory: NodeFactory<TypeAliasDeclaration, TypeAliasNode, ts.TypeAliasDeclaration> = {
    isNode: (node: ts.Node): node is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(node),

    create: (node: ts.TypeAliasDeclaration, context: ProjectContext): TypeAliasNode[] => {
        const reflectedNode = context.registerReflectedNode(node, () => new TypeAliasNode(node, context));
        return [reflectedNode];
    },
};
