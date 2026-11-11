/**
 * Converts the project and logo rasters under `public/` to WebP.
 *
 *   node scripts/optimize-images.mjs            # convert, keep originals
 *   node scripts/optimize-images.mjs --replace  # convert, delete originals
 *
 * Phone captures (App Store exports, 638x1386) stay at full size: the modal
 * gallery shows them at ~300 CSS px, so 638 is already the 2x asset. Web
 * captures (1568 wide) are the 2x asset for the ~780px modal strip. Nothing
 * is upscaled; the win is the codec, not the pixels.
 *
 * The hero portrait keeps its PNG (it doubles as the favicon and OG image)
 * and gains a WebP sibling for the page itself.
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIRS = ['projects', 'logos'];
const REPLACE = process.argv.includes('--replace');

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
};

const kb = (n) => `${(n / 1024).toFixed(0)} kB`;

let before = 0;
let after = 0;

const convert = async (file, { quality, keep }) => {
  const target = file.replace(/\.(jpe?g|png)$/i, '.webp');
  const src = (await stat(file)).size;
  await sharp(file).webp({ quality, effort: 6 }).toFile(target);
  const dst = (await stat(target)).size;
  before += src;
  after += dst;
  console.log(`${kb(src).padStart(7)} -> ${kb(dst).padStart(7)}  ${path.relative(ROOT, target)}`);
  if (REPLACE && !keep) await unlink(file);
};

for (const dir of DIRS) {
  for (const file of await walk(path.join(ROOT, dir))) {
    // Icons are small and sharp-edged; give them more headroom than photos.
    const isIcon = /icon\.(png|jpe?g)$/i.test(file) || dir === 'logos';
    await convert(file, { quality: isIcon ? 88 : 76 });
  }
}

await convert(path.join(ROOT, 'rinshid-portrait.png'), { quality: 84, keep: true });

console.log(`\n${kb(before)} -> ${kb(after)} (${Math.round((1 - after / before) * 100)}% smaller)`);
