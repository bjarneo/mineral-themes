// Renders the photographic backgrounds of each theme variant on the GPU:
//
//   0-omarchy-wordmark.jpg   the Omarchy wordmark spelled in pieces of the mineral
//   1-specimen.jpg           a specimen in its typical habit on a seamless backdrop
//   3-close-up.jpg           a cut gem, a polished slab or a close-up of the crystals
//   4-rough.jpg              rough pieces or crystals, from a low angle
//
// tools/photo.html ray-marches the scenes.
//
//   node tools/photo.mjs                       render all themes and variants
//   node tools/photo.mjs ruby malachite        render the named themes
//   VARIANTS=day node tools/photo.mjs          render only these variants
//   KINDS=specimen,rough node tools/photo.mjs  render only these kinds
//   SAMPLES=24 node tools/photo.mjs            samples for each pixel (default 10 to 12)
//   PREVIEW=1 OUT=/tmp/x node tools/photo.mjs ruby
//                                              write small JPEGs to $OUT
//   SIZE=3840x2160 node tools/photo.mjs        render at another 16:9 size
//   RESUME=1 node tools/photo.mjs              skip images that this run already wrote
//
// The run lists each finished image in .capture/photo-done.txt, so RESUME=1
// continues a stopped run. Needs `chromium` with a GPU that Vulkan can use.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes, VARIANTS } from './palettes.mjs';
import { launch, logoPaths } from './cdp.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PHOTOS = [
  ['wordmark', '0-omarchy-wordmark'],
  ['specimen', '1-specimen'],
  ['closeup', '3-close-up'],
  ['rough', '4-rough'],
];
const PREVIEW = !!process.env.PREVIEW;
const OUT = process.env.OUT || ROOT;
// Samples for each pixel. The scenes with a short focus get more. A clear
// mineral with dispersion rounds up to a multiple of 3.
const KIND_SAMPLES = { wordmark: 10, specimen: 12, closeup: 12, rough: 10 };
const samplesFor = kind => Number(process.env.SAMPLES || (PREVIEW ? 12 : KIND_SAMPLES[kind]));
const SIZE = (process.env.SIZE || (PREVIEW ? '960x540' : '6144x3456')).split('x').map(Number);
const ONLY = process.env.VARIANTS ? process.env.VARIANTS.split(',') : VARIANTS.map(v => v.key);
const KINDS = process.env.KINDS ? process.env.KINDS.split(',') : PHOTOS.map(([k]) => k);
const DONE = join(ROOT, '.capture', 'photo-done.txt');

// The object that the photo page draws from.
export function photoTheme(t, v) {
  const { variants, ...rest } = t;
  return { ...rest, name: v.name, base: t.name, install: v.install, colors: v.colors, ansi: v.ansi, second: v.second };
}

// The scene of a kind: the close-up is a cut gem, a slab or a macro view.
export const sceneOf = (kind, t) => kind === 'closeup' ? t.closeup : kind;

// Opens the photo page. tools/glint.mjs uses this too.
export async function openPhotoPage() {
  const logo = logoPaths(readFileSync('/usr/share/omarchy/logo.svg', 'utf8'));
  const browser = await launch({ gpu: true });
  const photo = await browser.open(pathToFileURL(join(ROOT, 'tools/photo.html')).href);
  await photo.evaluate(`setup(${JSON.stringify(logo)})`);
  // Draws one photo and returns the image as a Buffer. The photo page must be
  // the front tab: Chromium skips the GPU work of a hidden tab.
  async function shoot(scene, theme, width, height, samples, mime = 'image/jpeg') {
    await photo.send('Page.bringToFront');
    const url = await photo.evaluate(`renderPhoto({ scene: '${scene}', width: ${width}, height: ${height}, samples: ${samples}, mime: '${mime}', theme: ${JSON.stringify(theme)} })`);
    return Buffer.from(url.split(',')[1], 'base64');
  }
  return { shoot, evaluate: photo.evaluate, close: () => browser.close() };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const wanted = process.argv.slice(2);
  const done = new Set(process.env.RESUME && existsSync(DONE) ? readFileSync(DONE, 'utf8').split('\n') : []);
  if (!PREVIEW) mkdirSync(dirname(DONE), { recursive: true });
  if (!process.env.RESUME && !PREVIEW) writeFileSync(DONE, '');
  const jobs = [];
  // The specimens go first, because tools/glint.mjs needs them.
  const order = ['specimen', 'wordmark', 'closeup', 'rough'];
  for (const [kind, file] of PHOTOS.filter(([k]) => KINDS.includes(k)).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))) {
    for (const t of wanted.length ? themes.filter(x => wanted.includes(x.slug)) : themes) {
      for (const { key } of VARIANTS.filter(v => ONLY.includes(v.key))) {
        const id = `${t.slug}/${key}/${file}`;
        if (done.has(id)) continue;
        const out = PREVIEW ? join(OUT, `${t.slug}-${key}-${file}.jpg`) : join(OUT, t.slug, key, 'backgrounds', `${file}.jpg`);
        jobs.push({ t, key, kind, out, id });
      }
    }
  }
  const page = await openPhotoPage();
  const started = Date.now();
  let n = 0;
  for (const { t, key, kind, out, id } of jobs) {
    const jpeg = await page.shoot(sceneOf(kind, t), photoTheme(t, t.variants[key]), SIZE[0], SIZE[1], samplesFor(kind));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, jpeg);
    if (!PREVIEW) appendFileSync(DONE, id + '\n');
    n++;
    const left = (Date.now() - started) / n * (jobs.length - n) / 60000;
    process.stdout.write(`\r${n}/${jobs.length} photos, about ${left.toFixed(0)} min left   `);
  }
  process.stdout.write('\n');
  await page.close();
}
