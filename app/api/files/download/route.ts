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
      where: { id: fileId, userId }, // ✅ only allow owner to download
    });

    if (!file) return new NextResponse("File not found", { status: 404 });

    // Send content back as a downloadable file
    return new NextResponse(file.content, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.name}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}