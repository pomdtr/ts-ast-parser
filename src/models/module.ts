import type { CommentPart } from "https://esm.sh/@ts-ast-parser/comment@0.1.0";
import type { Declaration } from "./declaration.ts";
import type { Export } from "./export.ts";
import type { Import } from "./import.ts";

/**
 * A JS Module represents all the declarations/imports/exports defined inside a file
 */
export interface Module {
    /**
     * The source path of the file relative to the working directory
     */
    sourcePath: string;

    /**
     * The output path of the file relative to the working directory
     */
    outputPath: string;

    /**
     * All the declarations exported from the file
     */
    declarations: Declaration[];

    /**
     * All the imports
     */
    imports: Import[];

    /**
     * All the exports
     */
    exports: Export[];

    /**
     * Module JSDoc
     */
    jsDoc?: CommentPart[];
}
