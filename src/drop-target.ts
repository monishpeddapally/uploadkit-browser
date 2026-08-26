import { prepareUploads } from "./prepare.js";
import type { DropTargetOptions } from "./types.js";

export function attachDropTarget(element: HTMLElement, options: DropTargetOptions): () => void {
  const activeClass = options.activeClass ?? "uploadkit-drag-active";
  const prevent = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const enter = (event: DragEvent) => {
    prevent(event);
    element.classList.add(activeClass);
  };
  const leave = (event: DragEvent) => {
    prevent(event);
    element.classList.remove(activeClass);
  };
  const drop = async (event: DragEvent) => {
    leave(event);
    const files = event.dataTransfer?.files;
    if (!files?.length) return;
    try {
      await options.onFiles(await prepareUploads(files, options));
    } catch (cause) {
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
