import { ReflectedNode } from '../nodes/reflected-node.js';
import ts from 'typescript';


export interface NodeFactory<POJO extends Object, AstNode extends ReflectedNode<POJO, T>, T extends ts.Node> {

    isNode(node: ts.Node): node is T;

    create(node: T): AstNode[];

}
