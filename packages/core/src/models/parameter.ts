import type { PropertyLike } from './property.js';


export interface Parameter extends PropertyLike {
    rest?: boolean;
    named?: boolean;
    elements?: NamedParameterElement[];
}

export interface NamedParameterElement {
    name: string;
    default?: unknown;
}
