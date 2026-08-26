import { prepareUploads } from "./prepare.js";
export function attachDropTarget(element, options) {
    const activeClass = options.activeClass ?? "uploadkit-drag-active";
    const prevent = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const enter = (event) => {
        prevent(event);
        element.classList.add(activeClass);
    };
    const leave = (event) => {
        prevent(event);
        element.classList.remove(activeClass);
    };
    const drop = async (event) => {
        leave(event);
        const files = event.dataTransfer?.files;
        if (!files?.length)
            return;
        try {
            await options.onFiles(await prepareUploads(files, options));
        }
        catch (cause) {
            const error = cause instanceof Error ? cause : new Error(String(cause));
            options.onError?.(error);
        }
    };
    element.addEventListener("dragenter", enter);
    element.addEventListener("dragover", enter);
    element.addEventListener("dragleave", leave);
    element.addEventListener("drop", drop);
    return () => {
        element.removeEventListener("dragenter", enter);
        element.removeEventListener("dragover", enter);
        element.removeEventListener("dragleave", leave);
        element.removeEventListener("drop", drop);
    };
}
