import type { ProjectContext } from "../project-context.ts";
import { tryAddProperty } from "../utils/try-add-property.ts";
import type { ReflectedNode } from "../reflected-node.ts";
import type { EnumMember } from "../models/enum.ts";
import { CommentNode } from "./comment-node.ts";
import type ts from "typescript";

/**
 * Represents the reflected node of an enum member
 */
export class EnumMemberNode implements ReflectedNode<EnumMember, ts.EnumMember> {
    private readonly _node: ts.EnumMember;

    private readonly _value: string | number;

    private readonly _context: ProjectContext;

    private readonly _jsDoc: CommentNode;

    constructor(node: ts.EnumMember, value: string | number, context: ProjectContext) {
        this._node = node;
        this._value = value;
        this._context = context;
        this._jsDoc = new CommentNode(node);
    }

    /**
     * The name of the enum member
     *
     * @returns The name of the enum member
     */
    getName(): string {
        return this._node.name.getText() ?? "";
    }

    /**
     * The value of the enum member
     *
     * @returns The value of the enum member
     */
    getValue(): string | number {
        return this._value;
    }

    /**
     * The context includes useful APIs that are shared across
     * all the reflected symbols.
     *
     * Some APIs include the parsed configuration options, the
     * system interface, the type checker
     *
     * @returns The analyser context
     */
    getContext(): ProjectContext {
        return this._context;
    }

    /**
     * The line position where the enum member is defined
     *
     * @returns The start line position number
     */
    getLine(): number {
        return this._context.getLinePosition(this._node);
    }

    /**
     * The original TypeScript node
     *
     * @returns The TypeScript AST node related to this reflected node
     */
    getTSNode(): ts.EnumMember {
        return this._node;
    }

    /**
     * The reflected documentation comment
     *
     * @returns The JSDoc node
     */
    getJSDoc(): CommentNode {
        return this._jsDoc;
    }

    /**
     * Serializes the reflected node
     *
     * @returns The reflected node as a serializable object
     */
    serialize(): EnumMember {
        const tmpl: EnumMember = {
            name: this.getName(),
            value: this.getValue(),
        };

        tryAddProperty(tmpl, "jsDoc", this.getJSDoc().serialize());

        return tmpl;
    }
}
