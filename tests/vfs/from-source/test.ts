import { BrowserSystem, NodeSystem, parseFromSource } from '@ts-ast-parser/core';
import { readExpectedOutput, test, updateExpectedOutput } from '../../utils.js';
import { describe, expect } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';


const category = 'vfs';
const subcategory = 'from-source';
const dir = path.join(process.cwd(), 'tests', category, subcategory);

const code1 = fs.readFileSync(path.join(dir, 'index1.ts'), 'utf-8');
const expectedOutput1 = readExpectedOutput(category, subcategory, 'output1.json');

const code2 = fs.readFileSync(path.join(dir, 'index2.ts'), 'utf-8');
const expectedOutput2 = readExpectedOutput(category, subcategory, 'output2.json');

describe(category, () => {
    test('should allow updating the contents of a file in Node.js', async ({ update }) => {
        const system = new NodeSystem({vfs: true, analyserOptions: {include: ['/*.ts']}});

        let actual = (await parseFromSource(code1, {system})).project;
        let result = actual?.getModules().map(m => m.serialize()) ?? [];

        if (update) {
            updateExpectedOutput(result, category, subcategory, 'output1.json');
        } else {
            expect(result).to.deep.equal(expectedOutput1);
        }

        const filePath = actual?.getModules()[0]?.getTSNode().fileName ?? '';

        actual?.update(filePath, code2);
        result = actual?.getModules().map(m => m.serialize()) ?? [];

        if (update) {
            updateExpectedOutput(result, category, subcategory, 'output2.json');
        } else {
            expect(result).to.deep.equal(expectedOutput2);
        }
    });

    test('should allow updating the contents of a file in a browser', async ({ update }) => {
        const system = await BrowserSystem.create({analyserOptions: {include: ['/*.ts']}});

        let actual = (await parseFromSource(code1, {system})).project;
        let result = actual?.getModules().map(m => m.serialize()) ?? [];

        if (update) {
            updateExpectedOutput(result, category, subcategory, 'output1.json');
        } else {
            expect(result).to.deep.equal(expectedOutput1);
        }

        const filePath = actual?.getModules()[0]?.getTSNode().fileName ?? '';

        actual?.update(filePath, code2);
        result = actual?.getModules().map(m => m.serialize()) ?? [];

        if (update) {
            updateExpectedOutput(result, category, subcategory, 'output2.json');
        } else {
            expect(result).to.deep.equal(expectedOutput2);
        }
    });
});
