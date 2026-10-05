// Writes README.md from the theme data.
//
//   node tools/readme.mjs

import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes, VARIANTS, CATEGORIES, contrast } from './palettes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/bjarneo/mineral-themes';
const SITE = 'https://bjarneo.github.io/mineral-themes';
const N = themes.length, NV = N * VARIANTS.length;

// Lowest contrast of the 6 normal ANSI colors and the text, per variant.
function stats(key) {
  let normal = 99, text = 99;
  for (const t of themes) {
    const v = t.variants[key], bg = v.colors.background;
    v.ansi.slice(1, 7).forEach(h => normal = Math.min(normal, contrast(h, bg)));
    text = Math.min(text, contrast(v.colors.foreground, bg));
  }
  return { normal: normal.toFixed(1), text: text.toFixed(1) };
}

const anchor = s => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\- ]/gu, '').replace(/ /g, '-');
const pad = n => String(n).padStart(3, '0');
const sizeMb = Math.round(Number(execFileSync('du', ['-sm', '--exclude=.git', '--exclude=.capture', ROOT]).toString().split('\t')[0]) / 10) * 10;
const hardness = ([lo, hi]) => lo === hi ? String(lo) : `${lo} to ${hi}`;

const USE = {
  night: 'A dark background in a tint of the mineral. For the evening and dim rooms.',
  day: 'A light background in a pale tint of the mineral. For bright rooms and daylight.',
};

const variantTable = VARIANTS.map(v => {
  const s = stats(v.key);
  return `| ${v.label} | \`malachite${v.suffix}\` | ${USE[v.key]} | ${s.normal}:1 | ${s.text}:1 |`;
}).join('\n');

const CLOSEUP = { gem: 'a cut gem on a table', slab: 'a polished slab of the stone', macro: 'the crystals up close' };
const closeupCount = k => themes.filter(t => t.closeup === k).length;

const signatures = themes.filter(t => t.signature).map(t => `[${t.name}](#${anchor(t.name)})`).join(', ');

const menu = Object.entries(CATEGORIES).map(([key, label]) => {
  const list = themes.filter(t => t.cat === key);
  return `| ${label} | ${list.map(t => `[${t.name}](#${anchor(t.name)})`).join(', ')} |`;
}).join('\n');

const sections = Object.entries(CATEGORIES).map(([key, label]) => {
  const list = themes.filter(t => t.cat === key);
  return `## ${label}

${list.map(t => {
    const rows = VARIANTS.map(v => {
      const tv = t.variants[v.key], c = tv.colors;
      return `| ${v.label} | [\`${tv.install}\`](${t.slug}/${v.key}/) | \`${c.background}\` | \`${c.foreground}\` | \`${c.accent}\` | \`${tv.icons}\` |`;
    }).join('\n');
    const colors = VARIANTS.map(v => {
      const a = t.variants[v.key].ansi;
      return `| ${v.label} | ${a.slice(0, 8).map(h => `\`${h}\``).join(' ')} | ${a.slice(8).map(h => `\`${h}\``).join(' ')} |`;
    }).join('\n');
    const extra = (t.note ? ` · ${t.note}` : '') + (t.signature ? ' · Signature palette' : '');
    return `### ${t.name}

[![${t.name} at night and in the day](site/assets/shots/${t.slug}/pair.webp)](${SITE}/#${t.slug})

\`${pad(t.index)}\`${extra} · Folder: [\`${t.slug}/\`](${t.slug}/) · [Open on the site](${SITE}/#${t.slug})

${t.desc} The close-up shows ${CLOSEUP[t.closeup]}.

| Formula | System | Hardness | Luster | Streak | Density | Locality |
| --- | --- | --- | --- | --- | --- | --- |
| ${t.formula} | ${t.system} | ${hardness(t.hardness)} | ${t.luster} | ${t.streak[0]} | ${t.sg} g/cm³ | ${t.locality} |

| Variant | Theme name | \`background\` | \`foreground\` | \`accent\` | Icons |
| --- | --- | --- | --- | --- | --- |
${rows}

<details>
<summary>All 16 ANSI colors of each variant</summary>

| Variant | Normal, 0 to 7 | Bright, 8 to 15 |
| --- | --- | --- |
${colors}

</details>

\`\`\`bash
curl -fsSL ${SITE}/install.sh | bash -s -- ${t.slug} --set
\`\`\`
`;
  }).join('\n')}`;
}).join('\n');

const readme = `# Mineral themes for Omarchy

[![All ${NV} themes, from the darkest night to the lightest day.](site/assets/mosaic.jpg)](${SITE})

This repo has ${N} mineral themes for [Omarchy](https://omarchy.org), from gold to lazurite. Each theme has a night variant and a day variant. That makes ${NV} Omarchy themes. Each variant has a 16-color ANSI palette, 5 backgrounds at 6K and a glint video.

- Site: [${SITE.replace('https://', '')}](${SITE})
- Screenshots: real captures of an Omarchy desktop with each variant applied
- Backgrounds: ${NV * 5} images at 6K, 6144×3456, and ${NV} glint videos at 3840×2160
- Data: the formula, the crystal system, the Mohs hardness, the luster, the streak, the density and a locality of each mineral

## Variants

| Variant | Theme name | What it is | Lowest ANSI contrast | Lowest text contrast |
| --- | --- | --- | --- | --- |
${variantTable}

The contrast columns show the lowest WCAG contrast ratio against the background, over all ${N} themes. The script raises or lowers the lightness of each color until it reaches its target. The 6 main ANSI colors reach at least 4.5:1, the WCAG AA level. The muted color for comments reaches at least 3.8:1. Each variant is a complete Omarchy theme with its own folder, so you can install any mix of them.

Alexandrite changes color like the real stone: its night variant is red, and its day variant is green.

## Signature palettes

${themes.filter(t => t.signature).length} minerals use a signature palette. Like Osaka Jade and Miasma in Omarchy, they fill the 6 ANSI slots with the colors of the mineral, so a slot can hold a color that is not its name. The yellow of Lazurite is the gold of its pyrite flecks, and the blue of Watermelon Tourmaline is the green of its rim. The other minerals keep a classic palette, where red is red and blue is blue.

The contrast targets above apply to both kinds. A check also keeps the 6 slots apart, so no 2 slots look the same.

Signature palettes: ${signatures}.

## Backgrounds

Each variant has 6 backgrounds: 5 images and 1 video. Omarchy shows them in this order. To show the next one, run \`omarchy theme bg next\`.

| File | What it shows |
| --- | --- |
| \`0-omarchy-wordmark.jpg\` | The Omarchy wordmark spelled in small pieces of the mineral on a table: crystals, tumbled stones or nuggets. |
| \`1-specimen.jpg\` | A specimen in the typical habit of the mineral on a seamless backdrop: crystals on their host rock, a stone with a polished face, a geode, a nugget or branches of metal. |
| \`2-mineral-card.jpg\` | A data card: the formula, a drawing of the crystal, the Mohs scale, the streak, the luster, the density and a locality. |
| \`3-close-up.jpg\` | A cut gem on a table for ${closeupCount('gem')} gem minerals, a polished slab for ${closeupCount('slab')} minerals with a pattern, and the crystals up close for the other ${closeupCount('macro')}. |
| \`4-rough.jpg\` | Rough pieces or crystals of the mineral, from a low angle with a shallow focus. |
| \`5-glint.mp4\` | A 12 second loop at 3840×2160. Light glints on the facets of the specimen. |

The wordmark, the specimen, the close-up and the rough pieces are photographic renders. The GPU ray-marches each 3D scene with soft shadows, reflections and depth of field. Light passes through clear crystals and cut gems with refraction, and gems with high dispersion, such as diamond and sphalerite, split it into colors. The data card is a flat drawing.

## Install

\`install.sh\` copies themes into \`~/.config/omarchy/themes\`. Each theme variant becomes a normal Omarchy theme folder. The script installs the night and day variants of a theme unless you name one with \`--variant\`.

### Install one theme without a clone

The script downloads only the themes that you name:

\`\`\`bash
curl -fsSL ${SITE}/install.sh | bash -s -- malachite --set
\`\`\`

To install one variant only, add \`--variant\`:

\`\`\`bash
curl -fsSL ${SITE}/install.sh | bash -s -- malachite amethyst --variant day
\`\`\`

\`--set\` applies the first installed variant of the last theme.

### Install from a clone

\`\`\`bash
git clone --depth 1 ${REPO} ~/.local/share/mineral-themes
cd ~/.local/share/mineral-themes
./install.sh --all
omarchy theme set malachite-night
\`\`\`

The full repo is about ${sizeMb} MB because it has ${NV * 5} backgrounds at 6K. To download less, use the \`curl\` command above. It downloads only the folders that you name.

### Options

| Command | Result |
| --- | --- |
| \`install.sh malachite amethyst\` | Installs the night and day variants of the named themes |
| \`install.sh malachite --variant day\` | Installs only this variant |
| \`install.sh --all\` | Installs all ${NV} themes |
| \`install.sh --list\` | Lists the ${N} theme names |
| \`install.sh malachite --set\` | Installs the theme, then applies its night variant |
| \`install.sh --update\` | Installs again every theme variant that the script installed |
| \`install.sh --remove malachite\` | Removes the variants of a theme that the script installed |
| \`install.sh --link malachite\` | Links to the clone instead of copying. Run \`git pull\` in the clone to update. |
| \`install.sh --force malachite\` | Replaces a theme with the same name that the script did not install |

The variant names are \`night\` and \`day\`. The script writes a \`.mineral-themes\` marker file in each theme that it copies. \`--update\` and \`--remove\` use this file, so they never change a theme that you made.

### Apply with Aether

[Aether](https://github.com/omacom/aether) can apply a theme straight from the [site](${SITE}). Open a mineral, pick a variant and a background, and select 1 of these buttons:

| Button | Result |
| --- | --- |
| Apply with Aether | Aether loads the palette and the background, then applies them at once through its own theme. |
| Install as Omarchy theme | Aether adds the variant to \`~/.config/omarchy/themes\` and activates it at once. This stops if a theme with the same name exists, for example after \`install.sh\`. |
| Open in editor | Aether opens the palette in its editor. Nothing changes until you select Apply. |

Aether stops a download after 60 seconds. On a slow connection, a 6K background can take longer, so the links download a 3840×2160 copy from \`site/assets/aether/\`. GitHub does not render \`aether://\` links, so use the site or build a link yourself:

\`\`\`text
aether://apply?colors=${SITE}/malachite/night/colors.toml&wallpaper=${SITE}/assets/aether/malachite/night/1-specimen.jpg&silent=true
\`\`\`

Add \`&as_omarchy_theme=malachite-night\` to install the variant. Use \`&edit=true\` instead of \`&silent=true\` to open the editor.

### Name conflicts

All theme names end in \`-night\` or \`-day\`, so they do not collide with the themes that ship with Omarchy. The names also differ from the themes of [coffee-themes](https://github.com/bjarneo/coffee-themes) and [100-themes](https://github.com/bjarneo/100-themes). The script does not replace a theme that it did not install. If \`~/.config/omarchy/themes/malachite-night\` exists, the script skips it and tells you. Rename your theme, or use \`--force\` to replace it.

\`omarchy theme install <url>\` does not work with this repo. That command expects one theme at the root of a repo.

## Switch themes and backgrounds

\`\`\`bash
omarchy theme set malachite-night   # apply a theme
omarchy theme set malachite-day     # the same mineral in daylight
omarchy theme bg next               # show the next background of the current theme
\`\`\`

## The collection

| Class | Minerals |
| --- | --- |
${menu}

${sections}

## How the themes are made

The scripts in [\`tools/\`](tools/) make every file in this repo. They need Node.js 22 or later, Chromium, ImageMagick and ffmpeg. \`tools/photo.mjs\` and \`tools/glint.mjs\` also need a GPU that Chromium can use through Vulkan. \`tools/capture.sh\` also needs Omarchy, Hyprland and grim.

| Script | Output |
| --- | --- |
| \`tools/palettes.mjs\` | The mineral table and the color math. Every other script reads it. |
| \`tools/crystals.js\` | The face planes of each crystal shape. \`tools/photo.html\` and \`tools/render.html\` both load it. |
| \`tools/build.mjs\` | \`colors.toml\` and \`icons.theme\` of each variant, and \`site/assets/themes.js\` |
| \`tools/render.mjs\` | The data card of each variant at 6K. \`tools/render.html\` draws it on a canvas. |
| \`tools/photo.mjs\` | The 4 photographic backgrounds of each variant at 6K. \`tools/photo.html\` ray-marches the 3D scenes on the GPU. |
| \`tools/glint.mjs\` | The glint video of each variant. \`tools/photo.html\` renders a mask of the highlights of the specimen, \`tools/glint.html\` draws a glint on the brightest ones, and ffmpeg lays the glints over the specimen. |
| \`tools/capture.sh\` | \`preview.png\` of each variant and the site screenshots. It applies each variant on this desktop and takes a screenshot of workspace 8. |
| \`tools/preview.mjs\` | The fallback for a computer without Omarchy: it draws a desktop with the colors of each variant and writes the same files as \`tools/capture.sh\`. |
| \`tools/assets.mjs\` | The site previews, the thumbnails, the Aether copies and the mosaic |
| \`tools/readme.mjs\` | This README |

To build everything again, run the scripts in this order:

\`\`\`bash
node tools/build.mjs
node tools/render.mjs
node tools/photo.mjs
node tools/glint.mjs
tools/capture.sh
node tools/assets.mjs
node tools/readme.mjs
\`\`\`

On a computer without Omarchy, run \`node tools/preview.mjs\` instead of \`tools/capture.sh\`.

\`tools/capture.sh\` takes about 30 minutes. It changes the theme of the desktop ${NV} times and shows workspace 8 the whole time. Open the windows that you want in the screenshots on workspace 8 first. If you switch to another workspace, the script stops and restores your theme. Run it again to continue where it stopped.

\`tools/photo.mjs\` takes about 2.5 hours for all ${NV * 4} photos on an Intel Arc GPU. \`tools/glint.mjs\` takes about 1 hour for the ${NV} videos. It draws small tiles and waits for the GPU after every 6 tiles. Some GPU drivers reset the GPU when one job runs longer than 5 seconds. The first photo of each scene waits for the shader to compile, which can take a minute.

To change a mineral, edit its row in \`tools/palettes.mjs\`, then run the scripts with the theme name, for example \`node tools/photo.mjs malachite\` and \`tools/capture.sh malachite\`.

The site in [\`site/\`](site/) is a static page. The workflow in \`.github/workflows/pages.yml\` copies \`install.sh\` and every \`colors.toml\` into it and publishes it to GitHub Pages.
`;

writeFileSync(join(ROOT, 'README.md'), readme);
console.log(`wrote README.md (${themes.length} themes)`);
