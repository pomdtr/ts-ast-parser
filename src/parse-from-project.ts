import type { AnalyserSystem } from "./system/analyser-system.ts";
import type { AnalyserOptions } from "./analyser-options.ts";
import type { AnalyserResult } from "./analyser-result.ts";
import { createSystem } from "./system/create-system.ts";
import { Project } from "./project.ts";

/**
 * Reflects a simplified version of the TypeScript Abstract
 * Syntax Tree from a project (a collection of TypeScript or JavaScript files)
 *
 * @param options - Options to configure the analyzer
 * @returns The reflected TypeScript AST
 */
export async function parseFromProject(options: Partial<AnalyserOptions> = {}): Promise<AnalyserResult> {
    let system: AnalyserSystem;
    if (options.system) {
        system = options.system;
    } else {
        system = await createSystem();
    }

    const project = Project.fromTSConfig(system, options);
    const errors = project.getDiagnostics().getAll();

    return { project, errors };
}
