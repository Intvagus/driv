import sharp from "sharp";
import { ChartSpec } from "@/types/epi/visualization";
import { renderChartSvgString } from "@/lib/epi/charts/render-svg-string";

/** Server-only: rasterizes a ChartSpec to a PNG buffer from the same SVG
 *  string builder the browser uses, so exports match the on-screen chart. */
export async function renderChartToPng(spec: ChartSpec, width = 720): Promise<{ buffer: Buffer; width: number; height: number }> {
  const { svg } = renderChartSvgString(spec, width);
  const png = await sharp(Buffer.from(svg), { density: 220 }).png().toBuffer();
  const metadata = await sharp(png).metadata();
  return { buffer: png, width: metadata.width ?? width, height: metadata.height ?? 300 };
}
