// Writes the derived files that the site, the README and the Aether links use:
//
//   site/assets/aether/<theme>/<variant>/*.jpg   3840x2160 copies for Aether links
//   site/assets/bg/<theme>/<variant>/*.webp      1440x810 previews for the site, and the
//                                                first frame of each video as its poster
//   site/assets/thumbs/<theme>/<variant>.webp    640x360 specimen crops for the cards
//   site/assets/thumbs/<theme>/<variant>-desktop.webp  640x360 screenshot crops for card hovers
//   site/assets/shots/<theme>/pair.webp          night and day screenshots side by side
//   site/assets/mosaic.jpg                       all 200 screenshots in one image
//
//   node tools/assets.mjs
//
// Aether stops a download after 60 seconds, so its links use the smaller
// copies. The script skips files that are newer than their source.
// Needs `magick` and `ffmpeg` on PATH. Run it after tools/photo.mjs,
// tools/render.mjs, tools/glint.mjs and tools/capture.sh. The screenshots
// come from site/assets/shots/<theme>/<variant>.webp: real captures from
// tools/capture.sh, or the drawn previews of tools/preview.mjs.

import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { cpus } from 'node:os';
import { themes, VARIANTS } from './palettes.mjs';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site', 'assets');
const fresh = (dest, srcs) => existsSync(dest) && srcs.every(s => statSync(s).mtimeMs <= statSync(dest).mtimeMs);

// The screenshot of a variant, or its specimen preview when no screenshot
// exists yet.
function shotOrBackground(t, key) {
  const shot = join(SITE, 'shots', t.slug, `${key}.webp`);
  return existsSync(shot) ? shot : join(SITE, 'bg', t.slug, key, '1-specimen.webp');
}

const jobs = [];
for (const t of themes) {
  for (const { key } of VARIANTS) {
    const src = join(ROOT, t.slug, key, 'backgrounds');
    if (!existsSync(src)) continue;
    for (const f of readdirSync(src).filter(f => f.endsWith('.jpg'))) {
      const aether = join(SITE, 'aether', t.slug, key, f);
      const thumb = join(SITE, 'bg', t.slug, key, f.replace(/\.jpg$/, '.webp'));
      if (!fresh(aether, [join(src, f)])) jobs.push(['magick', [join(src, f), '-resize', '3840x2160', '-sampling-factor', '4:2:0', '-quality', '82', '-interlace', 'Plane', '-strip', aether]]);
      if (!fresh(thumb, [join(src, f)])) jobs.push(['magick', [join(src, f), '-resize', '1440x810', '-quality', '80', '-strip', thumb]]);
    }
    for (const f of readdirSync(src).filter(f => f.endsWith('.mp4'))) {
      const poster = join(SITE, 'bg', t.slug, key, f.replace(/\.mp4$/, '.webp'));
      if (!fresh(poster, [join(src, f)])) jobs.push(['ffmpeg', ['-v', 'error', '-y', '-i', join(src, f), '-frames:v', '1', '-vf', 'scale=1440:810', '-c:v', 'libwebp', '-quality', '80', poster]]);
    }
  }
}
await runAll(jobs);

// Thumbnails and pairs come from the screenshots, so they run after the previews above exist.
const second = [];
for (const t of themes) {
  for (const { key } of VARIANTS) {
    // The card shows the specimen: a crop of 64 percent of the specimen
    // background around the stone, which sits at about 62 percent of the
    // width and in the middle of the height. The offsets are for the
    // 6144x3456 source.
    const spec = join(ROOT, t.slug, key, 'backgrounds', '1-specimen.jpg');
    const thumb = join(SITE, 'thumbs', t.slug, `${key}.webp`);
    if (existsSync(spec) && !fresh(thumb, [spec])) {
      second.push(['magick', [spec, '-gravity', 'northwest', '-crop', '64%x64%+1843+622', '+repage', '-resize', '640x360', '-quality', '78', '-strip', thumb]]);
    }
    const src = shotOrBackground(t, key);
    const desk = join(SITE, 'thumbs', t.slug, `${key}-desktop.webp`);
    if (existsSync(src) && !fresh(desk, [src])) second.push(['magick', [src, '-resize', '640x360^', '-gravity', 'center', '-extent', '640x360', '-quality', '78', '-strip', desk]]);
  }
  const shots = VARIANTS.map(({ key }) => shotOrBackground(t, key));
  const pair = join(SITE, 'shots', t.slug, 'pair.webp');
  if (shots.every(existsSync) && !fresh(pair, shots)) {
    second.push(['magick', ['montage', ...shots, '-tile', `${shots.length}x1`, '-geometry', '720x450+4+0', '-background', '#101014', '-quality', '82', pair]]);
  }
}
await runAll(second);

// The wall: 15 columns and 14 rows of screenshots, sorted by the lightness
// of the background. The tiles fill the diagonals from the top left, so the
// wall runs from the darkest night to the lightest day. The last 10 tiles
// repeat the lightest days.
const COLS = 15, ROWS = 14;
const lightness = hex => [1, 3, 5].reduce((a, i, k) => a + [.2126, .7152, .0722][k] * parseInt(hex.slice(i, i + 2), 16), 0);
const sorted = themes.flatMap(t => VARIANTS.map(({ key }) => ({ t, key, l: lightness(t.variants[key].colors.background) }))).sort((a, b) => a.l - b.l);
sorted.push(...sorted.slice(sorted.length - (COLS * ROWS - sorted.length)));
const slots = [];
for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) slots.push([row, col]);
slots.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]) || a[0] - b[0]);
const tiles = [];
slots.forEach(([row, col], i) => { tiles[row * COLS + col] = shotOrBackground(sorted[i].t, sorted[i].key); });
const missing = tiles.filter(f => !existsSync(f)).length;
if (missing) {
  console.log(`skipped site/assets/mosaic.jpg: ${missing} images are missing`);
} else {
  await run('magick', ['montage', ...tiles, '-tile', `${COLS}x${ROWS}`, '-geometry', '160x100+0+0', '-background', '#000', '-quality', '86', join(SITE, 'mosaic.jpg')]);
  console.log('wrote site/assets/mosaic.jpg');
}

async function runAll(list) {
  let done = 0;
  await Promise.all(Array.from({ length: Math.max(1, cpus().length - 2) }, async () => {
    while (list.length) {
      const [cmd, args] = list.shift();
      mkdirSync(dirname(args[args.length - 1]), { recursive: true });
      await run(cmd, args);
      process.stdout.write(`\r${++done} files`);
    }
  }));
  if (done) process.stdout.write('\n');
}
