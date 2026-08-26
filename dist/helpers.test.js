import assert from "node:assert/strict";
import test from "node:test";
import { fitDimensions, renameForFormat } from "./helpers.js";
test("fits a landscape image without changing aspect ratio", () => {
    assert.deepEqual(fitDimensions(4000, 3000, 1920, 1080), { width: 1440, height: 1080 });
});
test("does not upscale by default", () => {
    assert.deepEqual(fitDimensions(640, 480, 1920, 1080), { width: 640, height: 480 });
});
test("renames a converted file", () => {
    assert.equal(renameForFormat("holiday.photo.HEIC", "image/webp"), "holiday.photo.webp");
});
