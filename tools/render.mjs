// Renders the data card of each theme variant with headless Chromium:
// <theme>/<variant>/backgrounds/2-mineral-card.jpg. tools/render.html draws it.
//
//   node tools/render.mjs                         render all themes and variants
//   node tools/render.mjs ruby malachite          render the named themes
//   VARIANTS=day node tools/render.mjs            render only these variants
//   PREVIEW=1 OUT=/tmp/x node tools/render.mjs ruby
//                                                 write small JPEGs to $OUT
//   SIZE=3840x2160 node tools/render.mjs          render at another 16:9 size
//
// Needs `chromium` on PATH.

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes, VARIANTS } from './palettes.mjs';
import { launch } from './cdp.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREVIEW = !!process.env.PREVIEW;
const OUT = process.env.OUT || ROOT;
const WORKERS = Number(process.env.WORKERS || 3);
// Output size of the card. 6144x3456 is 6K at 16:9.
const SIZE = (process.env.SIZE || (PREVIEW ? '960x540' : '6144x3456')).split('x').map(Number);
const ONLY = process.env.VARIANTS ? process.env.VARIANTS.split(',') : VARIANTS.map(v => v.key);
export const CARD = '2-mineral-card';

// The object that the card page draws from.
export function cardTheme(t, v) {
  const { variants, ...rest } = t;
  return { ...rest, name: v.name, base: t.name, total: themes.length, colors: v.colors, ansi: v.ansi, second: v.second };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const wanted = process.argv.slice(2);
  const list = wanted.length ? themes.filter(t => wanted.includes(t.slug)) : themes;
  const browser = await launch();
  const queue = [];
  for (const t of list) {
    for (const { key } of VARIANTS.filter(v => ONLY.includes(v.key))) {
      const dir = PREVIEW ? OUT : join(OUT, t.slug, key, 'backgrounds');
      mkdirSync(dir, { recursive: true });
      queue.push([cardTheme(t, t.variants[key]), join(dir, PREVIEW ? `${t.slug}-${key}-${CARD}.jpg` : `${CARD}.jpg`)]);
    }
  }
  let done = 0;
  const total = queue.length, started = Date.now();
  await Promise.all(Array.from({ length: Math.min(WORKERS, queue.length) }, async () => {
    const page = await browser.open(pathToFileURL(join(ROOT, 'tools/render.html')).href);
    while (queue.length) {
      const [theme, file] = queue.shift();
      // Chromium encodes the JPEG. A PNG at 6K takes seconds to encode and convert.
      const url = await page.evaluate(`renderImage(${JSON.stringify(theme)}, ${SIZE[0]}, ${SIZE[1]}, 'image/jpeg', ${PREVIEW ? .85 : .9})`);
      writeFileSync(file, Buffer.from(url.split(',')[1], 'base64'));
      done++;
      process.stdout.write(`\r${done}/${total} cards, ${((Date.now() - started) / 1000).toFixed(0)}s   `);
    }
    page.close();
  }));
  process.stdout.write('\n');
  await browser.close();
}
