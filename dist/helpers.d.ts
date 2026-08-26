import type { OutputFormat } from "./types.js";
export declare function fitDimensions(width: number, height: number, maxWidth?: number, maxHeight?: number, preventUpscale?: boolean): {
    width: number;
    height: number;
};
export declare function extensionFor(format: OutputFormat): string;
export declare function renameForFormat(name: string, format: OutputFormat): string;
