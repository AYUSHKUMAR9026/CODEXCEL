import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma-db";

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) return new NextResponse("Missing file ID", { status: 400 });

    // ✅ Only delete if it belongs to this user
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) return new NextResponse("File not found", { status: 404 });

    await prisma.file.delete({ where: { id: fileId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}