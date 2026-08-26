# UploadKit

UploadKit prepares images in the user's browser before your app sends them to S3, Supabase, Firebase, Cloudinary, or your own API. It reduces storage and bandwidth costs while keeping the storage layer entirely under the developer's control.

## MVP capabilities

- Resize without changing aspect ratio or accidentally upscaling
- Convert to JPEG, PNG, WebP, or AVIF when the browser supports the codec
- Compress toward a maximum byte size
- Strip metadata by re-encoding pixels
- Correct standard EXIF orientation through `createImageBitmap`
- Cancel work with `AbortSignal`
- Handle drag-and-drop without refreshing the page
- Bring a custom decoder for HEIC or other browser-unsupported inputs

## Install

```bash
npm install @uploadkit/browser
```

## Prepare a file

```ts
import { prepareUpload } from "@uploadkit/browser";

const result = await prepareUpload(input.files[0], {
  maxWidth: 1920,
  maxHeight: 1920,
  maxBytes: 1_500_000,
  format: "image/webp",
});

await supabase.storage.from("photos").upload(result.file.name, result.file);
console.log(`${result.originalBytes} -> ${result.outputBytes} bytes`);
```

## Turn any element into a drop target

```ts
import { attachDropTarget } from "@uploadkit/browser";

const detach = attachDropTarget(document.body, {
  maxWidth: 1920,
  format: "image/webp",
  onFiles: async (items) => {
    for (const item of items) await upload(item.file);
  },
  onError: console.error,
});

// Call detach() when the view unmounts.
```

## HEIC and unusual formats

No browser API reliably decodes every image type. Connect a WASM-backed decoder through the `decoder` option. The decoder returns a `CanvasImageSource`, its dimensions, and an optional cleanup function. A production package can ship codec adapters separately so ordinary users do not download large WASM bundles.

## Product direction

The defensible product is a small client SDK plus an optional fallback service, not a monolithic upload UI. Recommended package split:

- `@uploadkit/browser`: dependency-light core
- `@uploadkit/react`: hooks and accessible upload component
- `@uploadkit/codecs`: lazy WASM codecs such as HEIC
- `@uploadkit/storage`: S3, Supabase, Firebase, and signed-URL helpers
- UploadKit Cloud: fallback conversion, policies, usage analytics, and malware scanning

## v0.1 boundary

This version intentionally handles images only. Video, audio, PDFs, archives, malware scanning, and genuinely arbitrary files require separate pipelines and should not be advertised until implemented.
