export function fitDimensions(width, height, maxWidth = width, maxHeight = height, preventUpscale = true) {
    if (width <= 0 || height <= 0 || maxWidth <= 0 || maxHeight <= 0) {
        throw new RangeError("Image dimensions must be greater than zero.");
    }
    const scale = Math.min(maxWidth / width, maxHeight / height);
    const safeScale = preventUpscale ? Math.min(scale, 1) : scale;
    return {
        width: Math.max(1, Math.round(width * safeScale)),
        height: Math.max(1, Math.round(height * safeScale)),
    };
}
export function extensionFor(format) {
    return {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
    }[format];
}
export function renameForFormat(name, format) {
    const base = name.replace(/\.[^.]+$/, "") || "upload";
    return `${base}.${extensionFor(format)}`;
}
