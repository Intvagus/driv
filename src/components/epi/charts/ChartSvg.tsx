import { ChartSpec } from "@/types/epi/visualization";
import { renderChartSvgString } from "@/lib/epi/charts/render-svg-string";

/** Renders an accessible, minimal, self-explanatory chart from a ChartSpec.
 *  Delegates to the pure renderChartSvgString() so the on-screen chart and
 *  every export (Word/PDF rasterization) come from one source of truth. */
export function ChartSvg({ spec, width = 720 }: { spec: ChartSpec; width?: number }) {
  const { svg } = renderChartSvgString(spec, width);
  return <figure style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
