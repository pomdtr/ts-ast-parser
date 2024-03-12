import type ts from "https://esm.sh/typescript@5.4.2";

/**
 * Represent the nodes that are part of a mixin
 */
export interface MixinNodes {
    /**
     * The function declaration that represents the mixin.
     * It can also be a variable statement in case of using a
     * function expression to define the mixin.
     */
    function: ts.FunctionDeclaration | ts.VariableStatement;

    /**
     * The internal class that extends the base class provided as argument
     */
    class: ts.ClassExpression | ts.ClassDeclaration;
}
