import { NextRequest, NextResponse } from "next/server";
import { buildDocxBuffer } from "@/lib/epi/export/server/build-docx";
import { ReportModel } from "@/types/epi/report";

export const runtime = "nodejs";

/**
 * Receives only the already-aggregated report model (no raw/patient-level
 * records) and returns a generated .docx. Nothing here is logged or stored.
 */
export async function POST(req: NextRequest) {
  try {
    const { report } = (await req.json()) as { report: ReportModel };
    if (!report || !report.sections) {
      return NextResponse.json({ error: "Invalid report payload." }, { status: 400 });
    }
    const buffer = await buildDocxBuffer(report);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="report.docx"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Word export failed." }, { status: 500 });
  }
}
