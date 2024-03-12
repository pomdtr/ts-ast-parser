import type { BindingElement } from "./binding-element.ts";
import type { PropertyLike } from "./property.ts";

/**
 * A parameter after being serialized
 */
export interface Parameter extends PropertyLike {
    /**
     * Whether it's a rest parameter
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
     */
    rest?: boolean;

    /**
     * If it's a named parameter:
     *
     * @example
     *
     *      function foo({a, b}) { ... }
     */
    named?: boolean;

    /**
     * The elements of a named parameter
     */
    elements?: BindingElement[];
}
