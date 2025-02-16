import type { AnalyserSystem } from "./system/analyser-system.ts";
import type { AnalyserOptions } from "./analyser-options.ts";
import type { AnalyserResult } from "./analyser-result.ts";
import { createSystem } from "./system/create-system.ts";
import { Project } from "./project.ts";

/**
 * Given an array of TypeScript file paths and some configurable options,
 * reflects a simplified version of the TypeScript Abstract Syntax Tree.
 *
 * @param files - An array of paths where the TypeScripts files are located
 * @param options - Options to configure the analyzer
 * @returns The reflected TypeScript AST
 */
export async function parseFromFiles(
    files: readonly string[],
    options: Partial<AnalyserOptions> = {}
): Promise<AnalyserResult> {
    if (!Array.isArray(files) || !files.length) {
        return {
            project: null,
            errors: [{ messageText: "Expected an array of files." }],
        };
    }

    let system: AnalyserSystem;
    if (options.system) {
        system = options.system;
    } else {
        system = await createSystem();
    }

    const project = Project.fromFiles(system, files, options);
    const errors = project.getDiagnostics().getAll();

    return { project, errors };
}
