import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma-db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const files = await prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, size: true, createdAt: true }, // ✅ don't send content in list
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("List error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}