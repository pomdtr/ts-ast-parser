import type { DeclarationKind } from "./declaration-kind.ts";
import type { SourceReference } from "./reference.ts";
import type { Type } from "./type.ts";

/**
 * Represents a reference to a class or an interface
 */
export interface ExpressionWithTypeArguments {
    /**
     * The name of the symbol
     */
    name: string;

    /**
     * The type of declaration
     */
    kind?: DeclarationKind.Class | DeclarationKind.Interface;

    /**
     * The type arguments
     */
    typeArguments?: readonly Type[];

    /**
     * The location of the symbol
     */
    source?: SourceReference;
}
