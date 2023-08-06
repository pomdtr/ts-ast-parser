export const DEFAULT_GLOBBY_EXCLUDE: string[] = [
    '!node_modules/**/*.*',
    '!**/*.test.{ts,js}',
    '!**/*.spec.{ts,js}',
    '!**/*.suite.{ts,js}',
    '!**/*.config.{ts,js}',
    '!**/*.d.ts',
];

/**
 * These are the default TypeScript Compiler options used when we're unable
 * to find TSConfig file in the root of the project.
 *
 * @see https://www.typescriptlang.org/tsconfig#compilerOptions
 */
export const TS_DEFAULT_COMPILER_OPTIONS = {
    experimentalDecorators: true,
    target: 'es2020',
    module: 'ES2020',
    lib: ['es2020', 'DOM'],
    declaration: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
};

/**
 * These are the default TypeScript Compiler options used when we're analyzing
 * a JavaScript project.
 *
 * @see https://www.typescriptlang.org/tsconfig#compilerOptions
 */
export const JS_DEFAULT_COMPILER_OPTIONS = {
    target: 'es2020',
    module: 'ES2020',
    lib: ['es2020', 'DOM'],
    allowJs: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    moduleResolution: 'node',
    typeRoots: [],
};
