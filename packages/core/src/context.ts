import type { AnalyserOptions } from './analyser-options.js';
import type ts from 'typescript';


/**
 * Returns true if we're executing inside a browser
 */
export const isBrowser = typeof document === 'object' && !!document;

/**
 * The context of the analyser.
 *
 * Contains useful utilities to help analyze the code.
 *
 * Every project has only one context.
 *
 * In a monorepo there will be one context per child project.
 */
export interface AnalyserContext {
    /**
     * The TypeScript type checker.
     *
     * Useful to resolve the types of the symbols and declarations.
     */
    checker: ts.TypeChecker;

    /**
     * TSConfig file content.
     *
     * It won't be defined when we don't have a TSConfig file available.
     */
    commandLine: ts.ParsedCommandLine | null;

    /**
     * The analyzer options.
     */
    options: Partial<AnalyserOptions> | null;

    /**
     * Normalizing the path depends on the environment (browser or NodeJS) and the OS
     */
    normalizePath: (path: string | undefined) => string;
}
