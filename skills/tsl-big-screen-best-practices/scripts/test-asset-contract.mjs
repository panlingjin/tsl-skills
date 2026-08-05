import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedHashes = {
  "assets/map/china/china.json": "86da5e8677121c1c706b6437a0341f8c2eff3c8904b82f37dd901345d10d2639",
  "assets/map/china/china-map-outline.js": "2abefde77c8e7873213b6a45fa7639176c1b2b69223163c9ac4da5ab09a88261",
  "assets/img/decorations/card-title-rail.png": "281f6b133b936ebc2ee3900254d7a1b64443ab22152ce9d5a635cf25d0ba2876",
  "assets/img/decorations/section-title-marker.png": "7354dc410e962ac0710efd5bda23881ecafdd269e0a002d57449c441e6a3a786",
};

Object.entries(expectedHashes).forEach(([path, expected]) => {
  const digest = createHash("sha256").update(readFileSync(join(root, path))).digest("hex");
  assert.equal(digest, expected, `${path} changed from its approved source asset`);
});

const displayPath = join(root, "assets/template/data-visualization/data-display.less");
const display = readFileSync(displayPath, "utf8");
const urls = [...display.matchAll(/url\(["']?([^"')]+)["']?\)/g)]
  .map((match) => match[1])
  .filter((url) => url.startsWith("../images/"));
assert(urls.length > 0, "data-display.less should reference decoration assets");
urls.forEach((url) => {
  const sourcePath = normalize(
    join(root, "assets", url.replace(/^\.\.\/images\//, "img/")),
  );
  assert(existsSync(sourcePath), `missing copied-style dependency: ${url}`);
});

console.log(`verified ${Object.keys(expectedHashes).length} protected hashes and ${urls.length} style asset URLs`);
