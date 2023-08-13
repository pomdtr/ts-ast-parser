import type { AnalyserContext } from '../analyser-context.js';
import type { ReflectedNode } from '../reflected-node.js';
import type ts from 'typescript';


export interface NodeFactory<Model extends object, Node extends ReflectedNode<Model>, TSNode extends ts.Node> {

    isNode(node: ts.Node): node is TSNode;

    create(node: ts.Node, context: AnalyserContext): Node[];

}
