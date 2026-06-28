export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text.slice(0, 8000) }),
    }
  )
  const data = await res.json()

  if (!Array.isArray(data) || !data[0]) {
    console.error("HuggingFace embedding error:", JSON.stringify(data))
    throw new Error(`Embedding failed: ${JSON.stringify(data)}`)
  }

  // Returns array of arrays — flatten to single vector
  return Array.isArray(data[0]) ? data[0] : data
}