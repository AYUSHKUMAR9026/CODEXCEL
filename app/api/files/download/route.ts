import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma-db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");
    if (!fileId) return new NextResponse("Missing file ID", { status: 400 });

    const file = await prisma.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) return new NextResponse("File not found", { status: 404 });

    const isExcel =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls")

    if (isExcel && file.originalBinary) {
      // ✅ Serve the original binary directly — no conversion needed
      const buffer = Buffer.from(file.originalBinary, "base64")

      return new NextResponse(buffer, {
        headers: {
          "Content-Disposition": `attachment; filename="${file.name}"`,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })
    }

    // CSV or Excel without stored binary — serve as text
    return new NextResponse(file.content, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "Content-Type": isExcel ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "text/csv",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}