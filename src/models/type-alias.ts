import type { DeclarationKind } from "./declaration-kind.ts";
import type { CommentPart } from "https://esm.sh/@ts-ast-parser/comment@0.1.0";
import type { TypeParameter } from "./type-parameter.ts";
import type { Type } from "./type.ts";

/**
 * A type-alias declaration after being serialized
 */
export interface TypeAliasDeclaration {
    /**
     * The name of the type-alias
     */
    name: string;

    /**
     * The type of declaration
     */
    kind: DeclarationKind.TypeAlias;

    /**
     * The start line number where the type-alias is defined
     */
    line: number;

    /**
     * The type that it's assigned
     */
    value: Type;

    /**
     * The type parameters defined in the type-alias
     */
    typeParameters?: TypeParameter[];

    /**
     * Any JSDoc comment
     */
    jsDoc?: CommentPart[];

    /**
     * The namespace name where the type-alias is defined
     */
    namespace?: string;
}
