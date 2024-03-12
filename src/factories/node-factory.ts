import type { ProjectContext } from "../project-context.ts";
import type { ReflectedNode } from "../reflected-node.ts";
import type ts from "typescript";

export interface NodeFactory<Model extends object, Node extends ReflectedNode<Model>, TSNode extends ts.Node> {
    isNode(node: ts.Node): node is TSNode;

    create(node: ts.Node, context: ProjectContext): Node[];
}
