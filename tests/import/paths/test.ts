import { describe, expect, it } from 'vitest';
import { getFixture } from '../../utils.js';
import ts from 'typescript';
import path from 'path';


const category = 'import';
const subcategory = 'paths';
const compilerOptions: ts.CompilerOptions = {
    baseUrl: path.join(process.cwd(), 'tests', category, subcategory),
    experimentalDecorators: true,
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    lib: ['es2020'],
    paths: {
        'custom-path/foo': ['./foo.ts'],
    },
};
const {actual, expected} = getFixture({category, subcategory, importedFiles: ['foo.ts'], compilerOptions});

describe(`${category}/${subcategory}`, () => {

    it('should reflect the expected AST', () => {
        const result = actual.map(m => m.serialize());
        expect(result).to.deep.equal(expected);
    });

});
