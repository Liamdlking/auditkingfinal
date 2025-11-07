import { supabase } from "@/lib/supabaseClient";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const id = String(params?.id);

  const { data: insp } = await supabase
    .from("inspections")
    .select("*")
    .eq("id", id)
    .single();

  const { data: items } = await supabase
    .from("inspection_items")
    .select("*")
    .eq("inspection_id", id);

  if (!insp) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const { height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ x: 0, y: height - 80, width: 595, height: 80, color: rgb(0.145, 0.388, 0.922) });
  page.drawText("Audit King", { x: 40, y: height - 50, size: 20, font, color: rgb(1, 1, 1) });

  let y = height - 110;
  const line = (t: string, sz = 12) => { page.drawText(t, { x: 40, y, size: sz, font, color: rgb(0, 0, 0) }); y -= 18; };

  line(`Title: ${insp.title || "Untitled"}`);
  line(`Started: ${new Date(insp.started_at).toLocaleString()}`);
  line(`Completed: ${insp.completed_at ? new Date(insp.completed_at).toLocaleString() : "In progress"}`);
  line(`State: ${insp.state}`);
  y -= 10;
  line("Responses:", 14);

  for (const it of (items || [])) {
    line(`- ${it.question_title}`);
    if (it.response !== null && it.response !== undefined) line(`   Response: ${JSON.stringify(it.response)}`);
    if (it.note) line(`   Note: ${it.note}`);
    y -= 6;
  }

  const footer = `Audit King - Generated on ${new Date().toLocaleString()}`;
  page.drawText(footer, { x: 120, y: 40, size: 10, font, color: rgb(0.3, 0.3, 0.3) });

  const bytes = await pdf.save();
  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

  return new Response(ab, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="inspection-${id}.pdf"`
    }
  });
}
