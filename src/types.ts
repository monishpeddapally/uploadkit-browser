export type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export interface DecodeResult {
  source: CanvasImageSource;
  width: number;
  height: number;
  close?: () => void;
}

export type Decoder = (file: File) => Promise<DecodeResult>;

export interface PrepareOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxBytes?: number;
  format?: OutputFormat;
  quality?: number;
  minQuality?: number;
  qualityStep?: number;
  preventUpscale?: boolean;
  decoder?: Decoder;
  signal?: AbortSignal;
}

export interface PreparedUpload {
  file: File;
  original: File;
  width: number;
  height: number;
  originalBytes: number;
  outputBytes: number;
  compressionRatio: number;
}

export interface DropTargetOptions extends PrepareOptions {
  onFiles: (files: PreparedUpload[]) => void | Promise<void>;
  onError?: (error: Error) => void;
  activeClass?: string;
}
