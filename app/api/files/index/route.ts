import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getEmbedding } from "@/lib/embeddings"
import { index } from "@/lib/pinecone"

function chunkCSV(csvText: string, chunkSize = 50): string[] {
  const lines = csvText
    .split("\n")
    .map(line => line.trim())
    .filter(line => {
      // ✅ Remove lines that are empty or contain only commas/spaces
      const stripped = line.replace(/,/g, "").trim()
      return stripped.length > 0
    })

  if (lines.length === 0) return []

  const header = lines[0]
  const rows = lines.slice(1)
  const chunks: string[] = []

  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize)
    chunks.push([header, ...batch].join("\n"))
  }
  return chunks
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const { fileId, content, fileName } = await req.json()
    if (!content) return new NextResponse("Missing content", { status: 400 })

    // ✅ Delete old vectors for this file before re-indexing
    try {
      await index.deleteMany({ userId: String(userId), fileId: String(fileId) })
    } catch (e) {
      // ignore if nothing to delete
    }

    const chunks = chunkCSV(content, 50)
    console.log(`Indexing ${chunks.length} chunks for file: ${fileName}`)

    if (chunks.length === 0) {
      return NextResponse.json({ success: false, error: "No valid data found in file" })
    }

    // Log first chunk to verify data quality
    console.log("First chunk preview:", chunks[0].slice(0, 200))

    const records = []
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i])
      records.push({
        id: `${userId}-${fileId}-chunk-${i}`,
        values: embedding,
        metadata: {
          userId: String(userId),
          fileId: String(fileId),
          fileName: String(fileName),
          chunkIndex: i,
          text: String(chunks[i]),
        },
      })
    }

    for (let i = 0; i < records.length; i += 100) {
      await index.upsert(records.slice(i, i + 100))
    }

    return NextResponse.json({ success: true, chunks: chunks.length })
  } catch (error) {
    console.error("Indexing error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}