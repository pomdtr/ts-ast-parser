import type { DocTagValue } from '../models/js-doc.js';


export class JSDocValueNode {

    private readonly _jsDocTagValue: DocTagValue;

    constructor(jsDocTagValue: DocTagValue) {
        this._jsDocTagValue = jsDocTagValue;
    }

    getDescription(): string {
        if (typeof this._jsDocTagValue === 'string') {
            return this._jsDocTagValue;
        }

        if (typeof this._jsDocTagValue === 'boolean') {
            return '';
        }

        return this._jsDocTagValue.description ?? '';
    }

    getName(): string {
        if (typeof this._jsDocTagValue === 'string' || typeof this._jsDocTagValue === 'boolean') {
            return '';
        }

        return this._jsDocTagValue.name ?? '';
    }

    getType(): string {
        if (typeof this._jsDocTagValue === 'string' || typeof this._jsDocTagValue === 'boolean') {
            return '';
        }

        return this._jsDocTagValue.type ?? '';
    }

    getDefault(): string {
        if (typeof this._jsDocTagValue === 'string' || typeof this._jsDocTagValue === 'boolean') {
            return '';
        }

        return this._jsDocTagValue.default ?? '';
    }

    isOptional(): boolean {
        if (typeof this._jsDocTagValue === 'string' || typeof this._jsDocTagValue === 'boolean') {
            return false;
        }

        return !!this._jsDocTagValue.optional;
    }

    /**
     * The reflected node as a serializable object
     */
    serialize<T extends DocTagValue = DocTagValue>(): T {
        return this._jsDocTagValue as T;
    }
}
