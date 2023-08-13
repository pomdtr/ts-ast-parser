import type { ReflectedTypeNode } from '../reflected-node.js';
import type { AnalyserContext } from '../context.js';
import type { Type } from '../models/type.js';
import { TypeKind } from '../models/type.js';
import type ts from 'typescript';

export class MappedTypeNode implements ReflectedTypeNode<ts.MappedTypeNode> {
    private readonly _node: ts.MappedTypeNode;

    private readonly _type: ts.Type;

    private readonly _context: AnalyserContext;

    constructor(node: ts.MappedTypeNode, type: ts.Type, context: AnalyserContext) {
        this._node = node;
        this._type = type;
        this._context = context;
    }

    getContext(): AnalyserContext {
        return this._context;
    }

    getTSNode(): ts.MappedTypeNode {
        return this._node;
    }

    getTSType(): ts.Type {
        return this._type;
    }

    getKind(): TypeKind {
        return TypeKind.Mapped;
    }

    getText(): string {
        return this._context.checker.typeToString(this._type);
    }

    serialize(): Type {
        return {
            text: this.getText(),
            kind: this.getKind(),
        };
    }
}
