// Generates Rootline PWA icons into public/tracker/icons.
// Run: node scripts/tracker-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

const OUT = "public/tracker/icons";
mkdirSync(OUT, { recursive: true });

// Three hair strands growing from a scalp line. `pad` shrinks the glyph so
// maskable icons keep it inside the 80% safe zone.
const glyph = (pad) => {
  const s = 1 - pad * 2;
  return `<g transform="translate(${512 * pad} ${512 * pad}) scale(${s})" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="34">
    <path d="M150 372 H362"/>
    <path d="M256 372 C256 290 250 220 262 140"/>
    <path d="M206 372 C200 300 176 250 146 196"/>
    <path d="M306 372 C312 300 336 250 366 196"/>
  </g>`;
};

const svg = ({ rounded, pad }) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="#0F766E"/>
  ${glyph(pad)}
</svg>`);

const jobs = [
  ["icon-192.png", 192, { rounded: true, pad: 0.04 }],
  ["icon-512.png", 512, { rounded: true, pad: 0.04 }],
  ["maskable-512.png", 512, { rounded: false, pad: 0.14 }],
  ["apple-touch-icon.png", 180, { rounded: false, pad: 0.08 }],
  ["favicon-32.png", 32, { rounded: true, pad: 0 }],
];
for (const [name, size, opts] of jobs) {
  await sharp(svg(opts)).resize(size, size).png().toFile(`${OUT}/${name}`);
  console.log("wrote", `${OUT}/${name}`);
}
