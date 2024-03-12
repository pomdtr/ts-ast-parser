import type { DeclarationKind } from "./declaration-kind.ts";
import type { PropertyLike } from "./property.ts";

/**
 * A variable declaration after being serialized
 */
export interface VariableDeclaration extends PropertyLike {
    /**
     * The type of declaration
     */
    kind: DeclarationKind.Variable;

    /**
     * The namespace name where the variable is defined
     */
    namespace?: string;
}
