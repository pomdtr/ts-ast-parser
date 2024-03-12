import type { FunctionDeclaration } from "../models/function.ts";
import type { ProjectContext } from "../project-context.ts";
import { isFunctionDeclaration } from "../utils/function.ts";
import { FunctionNode } from "../nodes/function-node.ts";
import type { NodeFactory } from "./node-factory.ts";
import type { Method } from "../models/member.ts";
import type ts from "typescript";

export const functionFactory: NodeFactory<
    FunctionDeclaration | Method,
    FunctionNode,
    ts.VariableStatement | ts.FunctionDeclaration
> = {
    isNode: isFunctionDeclaration,

    create: (node: ts.VariableStatement | ts.FunctionDeclaration, context: ProjectContext): FunctionNode[] => {
        const reflectedNode = context.registerReflectedNode(node, () => new FunctionNode(node, null, context));
        return [reflectedNode];
    },
};
