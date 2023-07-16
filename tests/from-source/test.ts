import { parseFromSource } from '@ts-ast-parser/core';
import { readExpectedOutput } from '../utils.js';
import { describe, expect, it } from 'vitest';


const category = 'from-source';
const expected = readExpectedOutput(category);
const source = 'const foo = true;export { foo };';
const actual = await parseFromSource(source);

describe(category, () => {

    it('should extract the expected metadata', () => {
        expect(actual?.serialize()).to.deep.equal(expected);
    });

});
