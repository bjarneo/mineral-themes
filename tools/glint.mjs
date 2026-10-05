// Renders an animated background for each theme variant:
// <theme>/<variant>/backgrounds/5-glint.mp4, 3840x2160, a 12 second loop.
// Light glints on the facets of the specimen in 1-specimen.jpg.
//
//   node tools/glint.mjs                     render all themes and variants
//   node tools/glint.mjs ruby malachite      render the named themes
//   VARIANTS=day node tools/glint.mjs        render only these variants
//   OUT=/tmp/x node tools/glint.mjs ruby     write the videos to $OUT
//   SKIP_EXISTING=1 node tools/glint.mjs     keep videos that exist
//
// Run tools/photo.mjs first: the video uses 1-specimen.jpg as its still.
// tools/photo.html renders a mask of the highlights of the same scene, and
// tools/glint.html finds the brightest highlights in it and draws a glint on
// each one. ffmpeg lays the glints over the still in a color of the theme.
// Needs `chromium` with a GPU that Vulkan can use, and `ffmpeg`.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes, VARIANTS, mix } from './palettes.mjs';
import { launch } from './cdp.mjs';
import { openPhotoPage, photoTheme } from './photo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 24, SECONDS = 12, FRAMES = FPS * SECONDS;
// Size of the glint frames. ffmpeg scales them up to 3840x2160.
const GLINT_SIZE = [1280, 720];
const OUT = process.env.OUT;
const ONLY = process.env.VARIANTS ? process.env.VARIANTS.split(',') : VARIANTS.map(v => v.key);

// The glints are warm white at night, with a hint of the accent, and plain
// white in the day.
function glintColor(v) {
  const c = v.colors;
  return c.mode === 'light' ? { color: mix('#ffffff', c.accent, .35), opacity: 1 } : { color: mix('#fff4e2', c.accent, .2), opacity: 1 };
}

const wanted = process.argv.slice(2);
const jobs = [];
for (const t of wanted.length ? themes.filter(x => wanted.includes(x.slug)) : themes) {
  for (const { key } of VARIANTS.filter(v => ONLY.includes(v.key))) {
    const still = join(ROOT, t.slug, key, 'backgrounds', '1-specimen.jpg');
    const out = OUT ? join(OUT, `${t.slug}-${key}-glint.mp4`) : join(ROOT, t.slug, key, 'backgrounds', '5-glint.mp4');
    if (process.env.SKIP_EXISTING && existsSync(out)) continue;
    if (!existsSync(still)) { console.log(`skip ${t.slug} ${key}: 1-specimen.jpg is missing`); continue; }
    jobs.push({ t, key, still, out });
  }
}

const run = promisify(execFile);
function encode(still, frames, v, out) {
  const { color, opacity } = glintColor(v);
  const [r, g, b] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
  mkdirSync(dirname(out), { recursive: true });
  return run('ffmpeg', [
    '-v', 'error', '-y',
    '-loop', '1', '-framerate', String(FPS), '-i', still,
    '-framerate', String(FPS), '-i', join(frames, '%03d.png'),
    '-filter_complex', `[0:v]scale=3840:2160:flags=lanczos[s];[1:v]format=rgba,lutrgb=r=${r}:g=${g}:b=${b},colorchannelmixer=aa=${opacity},scale=3840:2160:flags=bicubic,gblur=sigma=1.4[g];[s][g]overlay=0:0:format=auto,format=yuv420p[v]`,
    '-map', '[v]', '-frames:v', String(FRAMES), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '24',
    '-g', String(FPS * 2), '-an', '-movflags', '+faststart', out,
  ]);
}

const started = Date.now();
const scratch = mkdtempSync(join(tmpdir(), 'theme-glint-'));
const photo = await openPhotoPage();
const browser = await launch();
const page = await browser.open(pathToFileURL(join(ROOT, 'tools/glint.html')).href);
let done = 0, encoding = Promise.resolve();
for (const [i, { t, key, still, out }] of jobs.entries()) {
  const v = t.variants[key];
  const mask = await photo.shoot('glint', photoTheme(t, v), 960, 540, 6, 'image/png');
  await page.evaluate(`setMask('data:image/png;base64,${mask.toString('base64')}', ${t.index * 31 + i})`);
  // Two frame folders take turns, so the next frames never replace the
  // frames that ffmpeg reads.
  const frames = join(scratch, `f${i % 2}`);
  await encoding;
  rmSync(frames, { recursive: true, force: true });
  mkdirSync(frames, { recursive: true });
  for (let f = 0; f < FRAMES; f++) {
    const url = await page.evaluate(`renderGlints(${f}, ${FRAMES}, ${SECONDS}, ${GLINT_SIZE[0]}, ${GLINT_SIZE[1]})`);
    writeFileSync(join(frames, `${String(f).padStart(3, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  encoding = encode(still, frames, v, out).then(() => {
    done++;
    process.stdout.write(`\r${done}/${jobs.length} videos, ${((Date.now() - started) / 1000).toFixed(0)}s   `);
  });
}
await encoding;
process.stdout.write('\n');
await photo.close();
await browser.close();
rmSync(scratch, { recursive: true, force: true });
