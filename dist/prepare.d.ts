import type { PrepareOptions, PreparedUpload } from "./types.js";
export declare function prepareUpload(file: File, options?: PrepareOptions): Promise<PreparedUpload>;
export declare function prepareUploads(files: ArrayLike<File> | Iterable<File>, options?: PrepareOptions): Promise<PreparedUpload[]>;
