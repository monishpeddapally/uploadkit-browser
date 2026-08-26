import { fitDimensions, renameForFormat } from "./helpers.js";
const DEFAULT_MAX_DIMENSION = 2048;
function abortIfNeeded(signal) {
    if (signal?.aborted)
        throw new DOMException("Upload preparation aborted.", "AbortError");
}
async function nativeDecode(file) {
    if (!file.type.startsWith("image/"))
        throw new TypeError("Only image files are supported in v0.1.");
    try {
        const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
        return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
    }
    catch {
        throw new TypeError(`This browser cannot decode ${file.type || "the supplied format"}. Provide a decoder adapter.`);
    }
}
function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error(`The browser could not encode ${type}.`)), type, quality);
    });
}
export async function prepareUpload(file, options = {}) {
    abortIfNeeded(options.signal);
    const format = options.format ?? "image/webp";
    const quality = options.quality ?? 0.82;
    const minQuality = options.minQuality ?? 0.45;
    const qualityStep = options.qualityStep ?? 0.07;
    if (quality <= 0 || quality > 1 || minQuality <= 0 || minQuality > quality || qualityStep <= 0) {
        throw new RangeError("Quality values must be within (0, 1], and minQuality cannot exceed quality.");
    }
    const decoded = await (options.decoder ?? nativeDecode)(file);
    try {
        abortIfNeeded(options.signal);
        const dimensions = fitDimensions(decoded.width, decoded.height, options.maxWidth ?? DEFAULT_MAX_DIMENSION, options.maxHeight ?? DEFAULT_MAX_DIMENSION, options.preventUpscale ?? true);
        const canvas = document.createElement("canvas");
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        const context = canvas.getContext("2d", { alpha: format !== "image/jpeg" });
        if (!context)
            throw new Error("Canvas 2D is unavailable in this browser.");
        context.drawImage(decoded.source, 0, 0, dimensions.width, dimensions.height);
        let currentQuality = quality;
        let blob = await canvasToBlob(canvas, format, currentQuality);
        while (options.maxBytes && blob.size > options.maxBytes && currentQuality - qualityStep >= minQuality) {
            abortIfNeeded(options.signal);
            currentQuality = Math.max(minQuality, currentQuality - qualityStep);
            blob = await canvasToBlob(canvas, format, currentQuality);
        }
        if (options.maxBytes && blob.size > options.maxBytes) {
            throw new RangeError(`Could not reduce the image below ${options.maxBytes} bytes without exceeding the configured limits.`);
        }
        const output = new File([blob], renameForFormat(file.name, format), {
            type: format,
            lastModified: Date.now(),
        });
        return {
            file: output,
            original: file,
            width: dimensions.width,
            height: dimensions.height,
            originalBytes: file.size,
            outputBytes: output.size,
            compressionRatio: file.size === 0 ? 1 : output.size / file.size,
        };
    }
    finally {
        decoded.close?.();
    }
}
export function prepareUploads(files, options = {}) {
    return Promise.all(Array.from(files, (file) => prepareUpload(file, options)));
}
