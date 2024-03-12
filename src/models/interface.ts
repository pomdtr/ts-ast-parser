import type { ExpressionWithTypeArguments } from "./expression-with-type-arguments.ts";
import type { DeclarationKind } from "./declaration-kind.ts";
import type { CommentPart } from "https://esm.sh/@ts-ast-parser/comment@0.1.0";
import type { TypeParameter } from "./type-parameter.ts";
import type { MemberKind } from "./member-kind.ts";
import type { PropertyLike } from "./property.ts";
import type { Field, Method } from "./member.ts";
import type { Type } from "./type.ts";

/**
 * An index signature after being serialized
 */
export interface IndexSignature extends PropertyLike {
    /**
     * The type of member
     */
    kind: MemberKind.IndexSignature;

    /**
     * The type of the index signature key
     */
    indexType?: Type;

    /**
     * Whether it's read-only or not
     */
    readOnly?: boolean;
}

/**
 * An interface declaration after being serialized
 */
export interface InterfaceDeclaration {
    /**
     * The name of the interface
     */
    name: string;

    /**
     * The start line number where the interface has been defined
     */
    line: number;

    /**
     * The type of declaration
     */
    kind: DeclarationKind.Interface;

    /**
     * The interface properties
     */
    properties?: readonly Field[];

    /**
     * The index signature
     */
    indexSignature?: IndexSignature;

    /**
     * The interface methods
     */
    methods?: readonly Method[];

    /**
     * Any JSDoc comment
     */
    jsDoc?: CommentPart[];

    /**
     * The interface type parameters
     */
    typeParameters?: readonly TypeParameter[];

    /**
     * The heritage chain
     */
    heritage?: readonly ExpressionWithTypeArguments[];

    /**
     * The namespace name where the interface is defined
     */
    namespace?: string;
}
