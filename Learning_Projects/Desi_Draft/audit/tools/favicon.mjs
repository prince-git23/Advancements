/**
 * Builds the site's favicon set from the supplied DD monogram.
 *
 * The mark is a white disc on a black field; the tab icon is that disc cropped
 * to a true circle (transparent outside), so it holds on light and dark tab
 * bars. Writes:
 *   public/favicon.svg             circle-clipped, 512 px raster inside
 *   public/favicon.ico             16 / 32 / 48
 *   public/favicon-32.png
 *   public/favicon-16.png
 *   public/apple-touch-icon.png    180, black tile (iOS masks its own corners)
 *
 *   node audit/tools/favicon.mjs <source-image>
 */
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = process.argv[2];
if (!SRC) throw new Error('usage: node audit/tools/favicon.mjs <image>');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public');
const b64 = (await fs.readFile(path.resolve(SRC))).toString('base64');
const mime = SRC.endsWith('.webp') ? 'image/webp' : SRC.endsWith('.png') ? 'image/png' : 'image/jpeg';

const base = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
const dirs = (await fs.readdir(base)).filter((d) => d.startsWith('chromium')).sort().reverse();
let exe = null;
for (const d of dirs) {
  const p = path.join(base, d, 'chrome-win64', 'chrome.exe');
  if (await fs.access(p).then(() => 1, () => 0)) {
    exe = p;
    break;
  }
}

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage();

const rendered = await page.evaluate(
  async ({ data, sizes }) => {
    const img = new Image();
    img.src = data;
    await img.decode();

    const draw = (size, { circle, background }) => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, size, size);
      }
      // The mark is a white disc on a black field. Cropped to a bare circle the
      // disc is white-on-white in a light tab bar, so the icon keeps the field
      // as a black rim: draw the source at 86%, centred on black, then clip to a
      // true circle. Light tab bars get a defined badge, dark bars still read.
      const s = (size / img.width) * (circle ? 0.86 : 1);
      if (circle) {
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, size, size);
      }
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      if (circle) {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      return c.toDataURL('image/png').split(',')[1];
    };

    const out = {};
    for (const size of sizes) out[size] = draw(size, { circle: true });
    out.apple = draw(180, { circle: false });
    return out;
  },
  { data: `data:${mime};base64,${b64}`, sizes: [512, 192, 48, 32, 16] }
);

await browser.close();

const write = async (name, base64) => {
  const file = path.join(OUT, name);
  await fs.writeFile(file, Buffer.from(base64, 'base64'));
  const { size } = await fs.stat(file);
  console.log(`  ${name}  ${Math.round(size / 1024)} kB`);
};

for (const [key, name] of [
  ['512', 'icon-512.png'],
  ['192', 'icon-192.png'],
  ['32', 'favicon-32.png'],
  ['16', 'favicon-16.png'],
  ['apple', 'apple-touch-icon.png'],
]) {
  await write(name, rendered[key]);
}

/* ---- favicon.svg: the 512 raster clipped to a circle ------------------ */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="desi draft">
  <defs>
    <clipPath id="disc"><circle cx="256" cy="256" r="256"/></clipPath>
  </defs>
  <image href="data:image/png;base64,${rendered['512']}" width="512" height="512" clip-path="url(#disc)" preserveAspectRatio="xMidYMid slice"/>
</svg>
`;
await fs.writeFile(path.join(OUT, 'favicon.svg'), svg);
console.log(`  favicon.svg  ${Math.round(Buffer.byteLength(svg) / 1024)} kB`);

/* ---- favicon.ico: 16 / 32 / 48, PNG payloads -------------------------- */
const icoSizes = [16, 32, 48];
const pngs = icoSizes.map((s) => Buffer.from(rendered[String(s)], 'base64'));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(icoSizes[i] >= 256 ? 0 : icoSizes[i], 0);
  e.writeUInt8(icoSizes[i] >= 256 ? 0 : icoSizes[i], 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
await fs.writeFile(path.join(OUT, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));
console.log(`  favicon.ico  ${Math.round((await fs.stat(path.join(OUT, 'favicon.ico'))).size / 1024)} kB`);
