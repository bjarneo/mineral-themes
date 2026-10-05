// Draws a desktop preview of each theme variant with headless Chromium. This
// is the fallback for a computer without Omarchy: tools/capture.sh takes real
// screenshots instead, and it replaces these files.
//
// tools/preview.html draws an Omarchy desktop with the theme colors and the
// specimen background. The script writes:
//
//   <theme>/<variant>/preview.png               1920x1080, for the Omarchy theme menu
//   site/assets/shots/<theme>/<variant>.webp    1440 wide, for the site
//
//   node tools/preview.mjs                 draw all themes and variants
//   node tools/preview.mjs ruby malachite  draw the named themes
//   SKIP_CAPTURED=1 node tools/preview.mjs keep the variants that have a screenshot
//
// Run tools/photo.mjs first. Needs `chromium` and `magick` on PATH.

import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes, VARIANTS } from './palettes.mjs';
import { launch } from './cdp.mjs';

const run = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const wanted = process.argv.slice(2);
const queue = [];
for (const t of wanted.length ? themes.filter(x => wanted.includes(x.slug)) : themes) {
  for (const { key } of VARIANTS) {
    // A real screenshot of tools/capture.sh has a .toml copy next to it.
    if (process.env.SKIP_CAPTURED && existsSync(join(ROOT, '.capture', t.slug, `${key}.toml`))) continue;
    queue.push([t, key]);
  }
}

const scratch = mkdtempSync(join(tmpdir(), 'theme-preview-'));
const browser = await launch();
const page = await browser.open(pathToFileURL(join(ROOT, 'tools/preview.html')).href);
await page.send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
let done = 0;
const total = queue.length, started = Date.now();
for (const [t, key] of queue) {
  const v = t.variants[key];
  const wall = join(ROOT, t.slug, key, 'backgrounds', '1-specimen.jpg');
  const { variants, ...rest } = t;
  const theme = { ...rest, base: t.name, slug: v.install, variant: key, icons: v.icons, colors: v.colors, ansi: v.ansi, second: v.second };
  await page.evaluate(`paint(${JSON.stringify(theme)}, ${JSON.stringify(existsSync(wall) ? pathToFileURL(wall).href : '')})`);
  await page.send('Page.bringToFront');
  const shot = await page.send('Page.captureScreenshot', { format: 'png' });
  const raw = join(scratch, 'shot.png');
  writeFileSync(raw, Buffer.from(shot.result.data, 'base64'));
  mkdirSync(join(ROOT, 'site', 'assets', 'shots', t.slug), { recursive: true });
  await Promise.all([
    run('magick', [raw, '-dither', 'FloydSteinberg', '-colors', '256', `PNG8:${join(ROOT, t.slug, key, 'preview.png')}`]),
    run('magick', [raw, '-resize', '1440x', '-quality', '82', join(ROOT, 'site', 'assets', 'shots', t.slug, `${key}.webp`)]),
  ]);
  done++;
  process.stdout.write(`\r${done}/${total} previews, ${((Date.now() - started) / 1000).toFixed(0)}s   `);
}
process.stdout.write('\n');
page.close();
await browser.close();
rmSync(scratch, { recursive: true, force: true });
