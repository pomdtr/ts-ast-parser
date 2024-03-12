import type { ExpressionWithTypeArguments } from "./expression-with-type-arguments.ts";
import type { DeclarationKind } from "./declaration-kind.ts";
import type { CommentPart } from "https://esm.sh/@ts-ast-parser/comment@0.1.0";
import type { TypeParameter } from "./type-parameter.ts";
import type { FunctionSignature } from "./function.ts";
import type { Field, Method } from "./member.ts";
import type { Decorator } from "./decorator.ts";

/**
 * The result of a class node after being serialized
 */
export interface ClassDeclaration {
    /**
     * The name of the class
     */
    name: string;

    /**
     * The start line number where the class is defined
     */
    line: number;

    /**
     * The declaration kind
     */
    kind: DeclarationKind.Class;

    /**
     * The instance properties of the class
     */
    properties?: readonly Field[];

    /**
     * The static properties of the class
     */
    staticProperties?: readonly Field[];

    /**
     * The instance methods of the class
     */
    methods?: readonly Method[];

    /**
     * The static methods of the class
     */
    staticMethods?: readonly Method[];

    /**
     * The JSDoc
     */
    jsDoc?: CommentPart[];

    /**
     * The type parameters
     */
    typeParameters?: readonly TypeParameter[];

    /**
     * The heritage chain
     */
    heritage?: readonly ExpressionWithTypeArguments[];

    /**
     * The class decorators
     */
    decorators?: readonly Decorator[];

    /**
     * The class constructors
     */
    constructors?: readonly FunctionSignature[];

    /**
     * Whether the class is abstract or not
     */
    abstract?: boolean;

    /**
     * The namespace name where the class is defined (empty string if there is no namespace)
     */
    namespace?: string;

    /**
     * Whether the class is a custom element or not
     */
    customElement?: boolean;
}
