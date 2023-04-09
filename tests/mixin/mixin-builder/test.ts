import { describe, expect, it } from 'vitest';
import { getFixture } from '../../utils.js';


const category = 'mixin';
const subcategory = 'mixin-builder';
const {actual, expected} = getFixture({category, subcategory});

describe(`${category}/${subcategory}`, () => {

    it.skip('should extract the expected metadata', () => {
        const result = actual.map(m => m.serialize());
        expect(result).to.deep.equal(expected);
    });

});
