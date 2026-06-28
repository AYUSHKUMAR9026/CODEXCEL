import { createGroq } from "@ai-sdk/groq"
import { streamText, convertToModelMessages, UIMessage } from "ai"
import { auth } from "@clerk/nextjs/server"
import { getEmbedding } from "@/lib/embeddings"
import { index } from "@/lib/pinecone"

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    const { messages, fileId }: { messages: UIMessage[], fileId?: string } = await req.json()

    // Get last user message as search query
    const lastMessage = messages[messages.length - 1]
    const query = lastMessage.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join(" ")

    let context = "No file uploaded yet."

    if (fileId) {
      // Embed the question and find relevant chunks
      const queryEmbedding = await getEmbedding(query)

      const results = await index.query({
        vector: queryEmbedding,
        topK: 5,
        filter: { userId, fileId },
        includeMetadata: true,
      })

      if (results.matches.length > 0) {
        context = results.matches
          .map((m, i) => `[Chunk ${i + 1}]:\n${m.metadata?.text}`)
          .join("\n\n")
      }
    }

    const systemPrompt = `You are an expert Data Analyst AI for the Codexcel platform.
Answer the user's question based ONLY on the data chunks provided below.
If the data doesn't contain enough information, say so clearly.

Relevant data:
${context}`

    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error)
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}