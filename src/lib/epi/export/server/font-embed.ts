import { readFileSync } from "fs";
import path from "path";
import { FontEmbed } from "@/lib/epi/charts/render-svg-string";

const FONT_FAMILY = "EpiExportSans";

let cached: FontEmbed | null = null;

/**
 * Server-only: builds a self-contained @font-face CSS block (base64-embedded
 * Liberation Sans) so chart SVGs rasterized via sharp/librsvg render legible
 * text even in serverless environments with no system fonts installed —
 * without this, every chart label silently renders as blank boxes ("tofu").
 * Memoized per warm function instance; each font is only a few hundred KB.
 */
export function getExportFontEmbed(): FontEmbed {
  if (cached) return cached;

  const dir = path.join(process.cwd(), "src/lib/epi/charts/fonts");
  const regular = readFileSync(path.join(dir, "LiberationSans-Regular.ttf")).toString("base64");
  const bold = readFileSync(path.join(dir, "LiberationSans-Bold.ttf")).toString("base64");

  const css = `
    @font-face {
      font-family: '${FONT_FAMILY}';
      font-weight: 400;
      src: url(data:font/truetype;base64,${regular}) format('truetype');
    }
    @font-face {
      font-family: '${FONT_FAMILY}';
      font-weight: 600;
      src: url(data:font/truetype;base64,${bold}) format('truetype');
    }
    @font-face {
      font-family: '${FONT_FAMILY}';
      font-weight: 700;
      src: url(data:font/truetype;base64,${bold}) format('truetype');
    }
  `;

  cached = { css, fontFamily: FONT_FAMILY };
  return cached;
}
