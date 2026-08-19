import { ChartSpec } from "@/types/epi/visualization";
import { CHART_COLORS as C } from "./palette";

const DEFAULT_FONT_STACK = "Arial, Helvetica, sans-serif";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmt(value: number, unit?: string): string {
  if (unit === "%") return `${value.toFixed(1)}%`;
  return Math.round(value).toLocaleString();
}

function clampLabel(label: string, max = 28): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

/** Ranked leaderboard shows the top performers and bottom (priority) performers
 *  together, per the WHO-aligned "district performance" infographic pattern —
 *  not every row, which is what the full ranked bar chart is for. */
function leaderboardRows(spec: ChartSpec): { label: string; value: number; flagged?: boolean; divider?: boolean }[] {
  if (spec.data.length <= 6) return spec.data;
  const top = spec.data.slice(0, 3);
  const bottom = spec.data.slice(-3);
  return [...top, { label: "⋯", value: NaN, divider: true }, ...bottom];
}

function bodyHeight(spec: ChartSpec): number {
  const rowHeight = 28;
  const topPad = 56;
  const bottomPad = 34;
  switch (spec.kind) {
    case "bar_horizontal":
    case "ranked_list":
      return topPad + spec.data.length * rowHeight + bottomPad + 10;
    case "ranked_leaderboard":
      return topPad + leaderboardRows(spec).length * 32 + bottomPad + 10;
    case "gauge_gap":
      return topPad + 140 + bottomPad;
    case "coverage_flow":
      return topPad + 260 + bottomPad;
    default:
      return topPad + 300 + bottomPad;
  }
}

function barHorizontal(spec: ChartSpec, width: number, font: string): string {
  const labelWidth = 220;
  const valueWidth = 70;
  const barAreaWidth = width - labelWidth - valueWidth - 32;
  const rowHeight = 28;
  const barHeight = 16;
  const maxValue = spec.unit === "%" ? 100 : Math.max(...spec.data.map((d) => d.value), 1);

  const rows = spec.data
    .map((d, i) => {
      const y = i * rowHeight;
      const w = Math.max((d.value / maxValue) * barAreaWidth, 1);
      const color = d.flagged ? C.flagged : C.primary;
      return `
        <g transform="translate(16, ${y})">
          <text x="0" y="${barHeight - 3}" font-size="12" fill="${C.text}" ${font}>${esc(clampLabel(d.label))}${d.flagged ? " ⚠" : ""}</text>
          <rect x="${labelWidth}" y="0" width="${barAreaWidth}" height="${barHeight}" fill="${C.grid}" rx="2" />
          <rect x="${labelWidth}" y="0" width="${w}" height="${barHeight}" fill="${color}" rx="2" />
          <text x="${labelWidth + barAreaWidth + 8}" y="${barHeight - 3}" font-size="12" fill="${C.text}" ${font}>${fmt(d.value, spec.unit)}${d.flagged ? " • Priority" : ""}</text>
        </g>`;
    })
    .join("");
  return `<g>${rows}</g>`;
}

function barVertical(spec: ChartSpec, width: number, font: string): string {
  const chartHeight = 260;
  const leftPad = 44;
  const bottomPad = 40;
  const plotWidth = width - leftPad - 24;
  const plotHeight = chartHeight - bottomPad;
  const maxValue = Math.max(...spec.data.map((d) => d.value), 1) * 1.15;
  const barWidth = Math.min(64, (plotWidth / spec.data.length) * 0.6);
  const gap = plotWidth / spec.data.length;
  const fractions = [0, 0.25, 0.5, 0.75, 1];

  const gridLines = fractions
    .map((f) => {
      const y = plotHeight - f * plotHeight;
      return `<line x1="${leftPad}" x2="${width - 16}" y1="${y}" y2="${y}" stroke="${C.grid}" stroke-width="1" /><text x="${leftPad - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="${C.textMuted}" ${font}>${fmt(f * maxValue, spec.unit)}</text>`;
    })
    .join("");

  const bars = spec.data
    .map((d, i) => {
      const x = leftPad + i * gap + (gap - barWidth) / 2;
      const h = (d.value / maxValue) * plotHeight;
      const y = plotHeight - h;
      const color = d.flagged ? C.flagged : C.primary;
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${color}" rx="2" />
        <text x="${x + barWidth / 2}" y="${plotHeight + 16}" font-size="11" text-anchor="middle" fill="${C.text}" ${font}>${esc(clampLabel(d.label, 14))}</text>
        <text x="${x + barWidth / 2}" y="${y - 6}" font-size="11" text-anchor="middle" fill="${C.text}" ${font}>${fmt(d.value, spec.unit)}</text>`;
    })
    .join("");

  return `<g>${gridLines}${bars}</g>`;
}

function lineChart(spec: ChartSpec, width: number, font: string): string {
  const chartHeight = 260;
  const leftPad = 48;
  const bottomPad = 36;
  const plotWidth = width - leftPad - 24;
  const plotHeight = chartHeight - bottomPad;
  const maxValue = Math.max(...spec.data.map((d) => d.value), 1) * 1.15;
  const stepX = spec.data.length > 1 ? plotWidth / (spec.data.length - 1) : 0;

  const points = spec.data.map((d, i) => ({
    x: leftPad + i * stepX,
    y: plotHeight - (d.value / maxValue) * plotHeight,
    ...d,
  }));
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const fractions = [0, 0.25, 0.5, 0.75, 1];
  const gridLines = fractions
    .map((f) => `<line x1="${leftPad}" x2="${width - 16}" y1="${plotHeight - f * plotHeight}" y2="${plotHeight - f * plotHeight}" stroke="${C.grid}" stroke-width="1" />`)
    .join("");
  const pointEls = points
    .map(
      (p) => `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="${C.primary}" />
      <text x="${p.x}" y="${p.y - 10}" font-size="10" text-anchor="middle" fill="${C.text}" ${font}>${fmt(p.value, spec.unit)}</text>
      <text x="${p.x}" y="${plotHeight + 16}" font-size="10" text-anchor="middle" fill="${C.textMuted}" ${font}>${esc(clampLabel(p.label, 10))}</text>`,
    )
    .join("");

  return `<g>${gridLines}<path d="${path}" fill="none" stroke="${C.primary}" stroke-width="2.5" />${pointEls}</g>`;
}

function gaugeGap(spec: ChartSpec, width: number, font: string): string {
  const d = spec.data[0];
  const barWidth = width - 200;
  const target = d.reference ?? 100;
  const achievedW = (Math.min(d.value, target) / target) * barWidth;
  const gap = Math.max(target - d.value, 0);

  return `
    <g transform="translate(16, 8)">
      <text x="0" y="12" font-size="12" fill="${C.textMuted}" ${font}>Target</text>
      <rect x="0" y="20" width="${barWidth}" height="22" fill="none" stroke="${C.neutral}" stroke-width="2" rx="3" />
      <text x="${barWidth + 8}" y="36" font-size="12" fill="${C.text}" ${font}>${fmt(target, spec.unit)}</text>

      <text x="0" y="70" font-size="12" fill="${C.textMuted}" ${font}>Achieved</text>
      <rect x="0" y="78" width="${barWidth}" height="22" fill="${C.grid}" rx="3" />
      <rect x="0" y="78" width="${achievedW}" height="22" fill="${C.primary}" rx="3" />
      <text x="${barWidth + 8}" y="94" font-size="12" fill="${C.text}" ${font}>${fmt(d.value, spec.unit)}</text>

      <text x="0" y="124" font-size="12" fill="${C.flagged}" font-weight="600" ${font}>Gap: ${fmt(gap, spec.unit)} ${spec.unit === "%" ? "percentage points" : ""}</text>
    </g>`;
}

function rankedLeaderboard(spec: ChartSpec, width: number, font: string): string {
  const rows = leaderboardRows(spec);
  const rankWidth = 28;
  const labelWidth = 200;
  const valueWidth = 70;
  const barAreaWidth = width - rankWidth - labelWidth - valueWidth - 40;
  const rowHeight = 32;
  const barHeight = 10;
  const maxValue = spec.unit === "%" ? 100 : Math.max(...spec.data.map((d) => d.value), 1);

  let rank = 0;
  const body = rows
    .map((d, i) => {
      const y = i * rowHeight;
      if (d.divider) {
        return `<text x="${rankWidth + 16}" y="${y + 20}" font-size="14" fill="${C.textMuted}" ${font}>⋯</text>`;
      }
      rank += 1;
      const w = Math.max((d.value / maxValue) * barAreaWidth, 1);
      const color = d.flagged ? C.flagged : C.primary;
      return `
        <g transform="translate(0, ${y})">
          <circle cx="${rankWidth / 2}" cy="14" r="11" fill="${d.flagged ? C.flaggedLight : C.primaryLight}" />
          <text x="${rankWidth / 2}" y="18" font-size="11" font-weight="700" text-anchor="middle" fill="${d.flagged ? C.flagged : C.primary}" ${font}>${rank}</text>
          <text x="${rankWidth + 12}" y="18" font-size="12" fill="${C.text}" ${font}>${esc(clampLabel(d.label, 22))}</text>
          <rect x="${rankWidth + labelWidth}" y="10" width="${barAreaWidth}" height="${barHeight}" fill="${C.grid}" rx="2" />
          <rect x="${rankWidth + labelWidth}" y="10" width="${w}" height="${barHeight}" fill="${color}" rx="2" />
          <text x="${rankWidth + labelWidth + barAreaWidth + 8}" y="18" font-size="12" font-weight="600" fill="${C.text}" ${font}>${fmt(d.value, spec.unit)}</text>
          ${d.flagged ? `<text x="${rankWidth + labelWidth + barAreaWidth + 8}" y="30" font-size="9" fill="${C.flagged}" ${font}>← Priority</text>` : ""}
        </g>`;
    })
    .join("");
  return `<g>${body}</g>`;
}

function coverageFlow(spec: ChartSpec, width: number, font: string): string {
  const [target, achieved, pct] = spec.data;
  const cx = width / 2;
  const stageY = [10, 110, 210];
  const stage = (label: string, valueText: string, y: number, color: string, big = false) => `
    <text x="${cx}" y="${y}" font-size="11" letter-spacing="1" text-anchor="middle" fill="${C.textMuted}" ${font}>${esc(label.toUpperCase())}</text>
    <text x="${cx}" y="${y + (big ? 34 : 28)}" font-size="${big ? 30 : 22}" font-weight="700" text-anchor="middle" fill="${color}" ${font}>${valueText}</text>`;
  const arrow = (y: number) => `<path d="M ${cx} ${y} L ${cx} ${y + 26} M ${cx - 6} ${y + 19} L ${cx} ${y + 26} L ${cx + 6} ${y + 19}" stroke="${C.neutral}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`;

  return `<g>
    ${stage("Target Population", fmt(target.value, "count"), stageY[0], C.text)}
    ${arrow(stageY[0] + 34)}
    ${stage("Vaccinated Population", fmt(achieved.value, "count"), stageY[1], C.text)}
    ${arrow(stageY[1] + 34)}
    ${stage("Coverage", fmt(pct.value, "%"), stageY[2], C.primary, true)}
  </g>`;
}

function bodyMarkup(spec: ChartSpec, width: number, font: string): string {
  switch (spec.kind) {
    case "bar_horizontal":
    case "ranked_list":
      return barHorizontal(spec, width, font);
    case "ranked_leaderboard":
      return rankedLeaderboard(spec, width, font);
    case "bar_vertical":
    case "stacked_bar":
    case "histogram":
      return barVertical(spec, width, font);
    case "line":
      return lineChart(spec, width, font);
    case "gauge_gap":
      return gaugeGap(spec, width, font);
    case "coverage_flow":
      return coverageFlow(spec, width, font);
    default:
      return "";
  }
}

export interface FontEmbed {
  /** CSS @font-face rule(s), e.g. embedding a base64 TTF, so rasterizers with no
   *  system fonts (serverless export) still render legible text. */
  css: string;
  /** The font-family name declared inside `css`, used for every text element. */
  fontFamily: string;
}

/** Pure function producing the full accessible chart SVG markup as a string —
 *  the single source of truth used both for the on-screen ChartSvg component
 *  (via dangerouslySetInnerHTML, safe because output is deterministic and
 *  contains no user-controlled script) and for server-side export rasterization. */
export function renderChartSvgString(spec: ChartSpec, width = 720, embed?: FontEmbed): { svg: string; height: number } {
  const height = bodyHeight(spec);
  const titleId = `title-${spec.id}`;
  const descId = `desc-${spec.id}`;
  const fontFamily = embed?.fontFamily ?? DEFAULT_FONT_STACK;
  const font = `font-family="${fontFamily}"`;

  const svg = `<svg role="img" aria-labelledby="${titleId} ${descId}" width="${width}" height="${height}" style="width:100%;height:auto;display:block" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${embed ? `<defs><style>${embed.css}</style></defs>` : ""}
    <title id="${titleId}">${esc(spec.title)}</title>
    <desc id="${descId}">${esc(spec.subtitle ?? spec.rationale)}</desc>
    <rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF" />
    <text x="16" y="26" font-size="15" font-weight="700" fill="${C.text}" ${font}>${esc(spec.title)}</text>
    ${spec.subtitle ? `<text x="16" y="44" font-size="12" fill="${C.textMuted}" ${font}>${esc(spec.subtitle)}</text>` : ""}
    <g transform="translate(0, 56)">${bodyMarkup(spec, width, font)}</g>
    <text x="16" y="${height - 12}" font-size="10" fill="${C.textMuted}" ${font}>${esc(spec.sourceNote)}</text>
  </svg>`;

  return { svg, height };
}
