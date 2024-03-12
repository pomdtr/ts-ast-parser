import type { AnalyserError } from "./analyser-diagnostic.ts";
import type { Project } from "./project.ts";

/**
 * Represents the result of calling any of
 * the parsing functions
 */
export interface AnalyserResult {
    /**
     * A project node contains a collection of
     * modules that have been successfully analysed
     */
    project: Project | null;

    /**
     * In case there have been errors during the
     * analysis, you will find them here
     */
    errors: AnalyserError[];
}
