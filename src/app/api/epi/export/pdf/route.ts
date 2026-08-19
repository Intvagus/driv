import { NextRequest, NextResponse } from "next/server";
import { buildPdfBuffer } from "@/lib/epi/export/server/build-pdf";
import { ReportModel } from "@/types/epi/report";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { report } = (await req.json()) as { report: ReportModel };
    if (!report || !report.sections) {
      return NextResponse.json({ error: "Invalid report payload." }, { status: 400 });
    }
    const buffer = await buildPdfBuffer(report);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report.pdf"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "PDF export failed." }, { status: 500 });
  }
}
