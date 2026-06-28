import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma-db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, content, size } = await req.json();

    if (!name || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newFile = await prisma.file.create({
      data: {
        name,
        url: "stored-in-db",
        size,
        userId,
        content, // ✅ now actually saving the content
      },
    });

    return NextResponse.json(newFile);
  } catch (error) {
    console.error("API Error saving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}