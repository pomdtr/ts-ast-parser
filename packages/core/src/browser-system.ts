import { JS_DEFAULT_COMPILER_OPTIONS, TS_DEFAULT_COMPILER_OPTIONS } from './default-compiler-options.js';
import type { AnalyserOptions } from './analyser-options.js';
import type { AnalyserSystem } from './analyser-system.js';
import * as tsvfs from '@typescript/vfs';
import ts from 'typescript';


// @see https://github.com/microsoft/TypeScript-Website/issues/2801
// @see https://github.com/microsoft/TypeScript-Website/pull/2802
// @see https://github.com/microsoft/TypeScript/pull/54011
const knownLibFiles = [
    'lib.d.ts',
    'lib.decorators.d.ts',
    'lib.decorators.legacy.d.ts',
    'lib.dom.d.ts',
    'lib.dom.iterable.d.ts',
    'lib.es2015.collection.d.ts',
    'lib.es2015.core.d.ts',
    'lib.es2015.d.ts',
    'lib.es2015.generator.d.ts',
    'lib.es2015.iterable.d.ts',
    'lib.es2015.promise.d.ts',
    'lib.es2015.proxy.d.ts',
    'lib.es2015.reflect.d.ts',
    'lib.es2015.symbol.d.ts',
    'lib.es2015.symbol.wellknown.d.ts',
    'lib.es2016.array.include.d.ts',
    'lib.es2016.d.ts',
    'lib.es2016.full.d.ts',
    'lib.es2017.d.ts',
    'lib.es2017.full.d.ts',
    'lib.es2017.intl.d.ts',
    'lib.es2017.object.d.ts',
    'lib.es2017.sharedmemory.d.ts',
    'lib.es2017.string.d.ts',
    'lib.es2017.typedarrays.d.ts',
    'lib.es2018.asyncgenerator.d.ts',
    'lib.es2018.asynciterable.d.ts',
    'lib.es2018.d.ts',
    'lib.es2018.full.d.ts',
    'lib.es2018.intl.d.ts',
    'lib.es2018.promise.d.ts',
    'lib.es2018.regexp.d.ts',
    'lib.es2019.array.d.ts',
    'lib.es2019.d.ts',
    'lib.es2019.full.d.ts',
    'lib.es2019.intl.d.ts',
    'lib.es2019.object.d.ts',
    'lib.es2019.string.d.ts',
    'lib.es2019.symbol.d.ts',
    'lib.es2020.bigint.d.ts',
    'lib.es2020.d.ts',
    'lib.es2020.date.d.ts',
    'lib.es2020.full.d.ts',
    'lib.es2020.intl.d.ts',
    'lib.es2020.number.d.ts',
    'lib.es2020.promise.d.ts',
    'lib.es2020.sharedmemory.d.ts',
    'lib.es2020.string.d.ts',
    'lib.es2020.symbol.wellknown.d.ts',
    'lib.es2021.d.ts',
    'lib.es2021.full.d.ts',
    'lib.es2021.intl.d.ts',
    'lib.es2021.promise.d.ts',
    'lib.es2021.string.d.ts',
    'lib.es2021.weakref.d.ts',
    'lib.es2022.array.d.ts',
    'lib.es2022.d.ts',
    'lib.es2022.error.d.ts',
    'lib.es2022.full.d.ts',
    'lib.es2022.intl.d.ts',
    'lib.es2022.object.d.ts',
    'lib.es2022.regexp.d.ts',
    'lib.es2022.sharedmemory.d.ts',
    'lib.es2022.string.d.ts',
    'lib.es2023.array.d.ts',
    'lib.es2023.d.ts',
    'lib.es2023.full.d.ts',
    'lib.es5.d.ts',
    'lib.es6.d.ts',
    'lib.esnext.d.ts',
    'lib.esnext.full.d.ts',
    'lib.esnext.intl.d.ts',
    'lib.scripthost.d.ts',
    'lib.webworker.d.ts',
    'lib.webworker.importscripts.d.ts',
    'lib.webworker.iterable.d.ts',
];

/**
 * Options to configure the system behaviour
 */
export interface BrowserSystemOptions {
    /**
     * The original analyser options
     */
    analyserOptions: Partial<AnalyserOptions>;

    /**
     * The initial files to add in the in-memory file system
     */
    fsMap: Map<string, string>;
}

/**
 * Abstraction layer to use the analyser inside a browser
 */
export class BrowserSystem implements AnalyserSystem {

    private _commandLine: ts.ParsedCommandLine;

    private readonly _sys: ts.System;

    private readonly _host: ts.CompilerHost;

    private readonly _options: Partial<BrowserSystemOptions> = {};

    private readonly _updateFile: (sourceFile: ts.SourceFile) => void;

    private constructor(options: Partial<BrowserSystemOptions> = {}) {
        this._options = options;
        this._sys = tsvfs.createSystem(options?.fsMap ?? new Map<string, string>());
        this._commandLine = this._createCommandLine();

        const virtualCompilerHost = tsvfs.createVirtualCompilerHost(this._sys, this._commandLine.options, ts);
        this._host = virtualCompilerHost.compilerHost;
        this._updateFile = virtualCompilerHost.updateFile;
    }

    static async create(options: Partial<BrowserSystemOptions> = {}): Promise<BrowserSystem> {
        const system = new BrowserSystem(options);
        await system._createDefaultMapFromCDN(ts.version);
        return system;
    }

    /**
     * All interaction of the TypeScript compiler with the operating system goes
     * through a System interface.
     *
     * You can think of it as the Operating Environment (OE).
     */
    getSystem(): ts.System {
        return this._sys;
    }

    /**
     * This is used by the Program to interact with the System.
     */
    getCompilerHost(): ts.CompilerHost {
        return this._host;
    }

    /**
     * The parsed compiler options
     */
    getCommandLine(): ts.ParsedCommandLine {
        return this._commandLine;
    }

    /**
     * The current working directory
     */
    getCurrentDirectory(): string {
        return this._host.getCurrentDirectory();
    }

    /**
     * Checks whether the file exists
     *
     * @returns True if the file exists, otherwise false
     */
    fileExists(path: string): boolean {
        return this._host.fileExists(path);
    }

    /**
     * Reads the data encoded inside a file
     */
    readFile(path: string): string {
        return this._host.readFile(path) ?? '';
    }

    /**
     * Writes the provided data to the file.
     *
     * Be careful! As of right now, it will write to disk
     * when working with a real file system
     */
    writeFile(path: string, data: string): void {
        if (!this._host.fileExists(path)) {
            this._host.writeFile(path, data, false);
            this._commandLine = this._createCommandLine();
            return;
        }

        const target = this._commandLine.options.target ?? ts.ScriptTarget.ES2022;
        const oldSourceFile = this._host.getSourceFile(path, target) as ts.SourceFile;
        const textRangeChange: ts.TextChangeRange = {
            span: {start: 0, length: oldSourceFile.text.length},
            newLength: data.length,
        };

        const newSourceFile = oldSourceFile.update(data, textRangeChange);
        this._updateFile(newSourceFile);
    }

    /**
     * Normalizes the path based on the OS and makes it
     * relative to the current working directory.
     */
    normalizePath(path: string | undefined): string {
        return path?.startsWith('/') ? (path ?? '').slice(1) : (path ?? '');
    }

    /**
     * Returns the absolute path
     */
    getAbsolutePath(path: string | undefined): string {
        return path?.startsWith('/') ? (path ?? '') : (`/${ path ?? ''}`);
    }

    /**
     * Returns the directory name
     */
    getDirName(path: string): string {
        return path.split('/').slice(0, -1).join('/');
    }

    /**
     * Joins the segments using the path separator of the OS/Browser
     */
    join(...segments: string[]): string {
        return segments.join('/');
    }

    private _createDefaultMapFromCDN(version: string): Promise<void[]> {
        const prefix = `https://typescript.azureedge.net/cdn/${version}/typescript/lib/`;
        const promises: Promise<void>[] = [];

        for (const lib of knownLibFiles) {
            const promise = fetch(prefix + lib)
                .then(resp => resp.text())
                .then(text => {
                    this.writeFile(`/${lib}`, text);
                });

            promises.push(promise);
        }

        return Promise.all(promises);
    }

    private _createCommandLine(): ts.ParsedCommandLine {
        const { compilerOptions, jsProject, include, exclude } = this._options.analyserOptions ?? {};

        return ts.parseJsonConfigFileContent(
            {
                compilerOptions: jsProject
                    ? JS_DEFAULT_COMPILER_OPTIONS
                    : compilerOptions ?? TS_DEFAULT_COMPILER_OPTIONS,
                include: include ?? (jsProject ? ['**/*.js'] : ['**/*.ts']),
                exclude: exclude ?? ['**node_modules**'],
            },
            this._sys,
            '/',
        );
    }
}
