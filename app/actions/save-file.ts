"use server"

import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma-db"

export async function saveFileToDatabase(
  name: string,
  content: string,      // CSV for AI
  size: number,
  fileType: string,
  originalBinary?: string  // ✅ Base64 original file
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const newFile = await prisma.file.create({
    data: {
      name,
      url: "stored-in-db",
      size,
      userId,
      content,
      fileType,
      originalBinary: originalBinary || null,
    },
  })

  return newFile
}