"use client"

import { useEffect, useState, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import * as XLSX from "xlsx"
import { Send, Bot, User, Paperclip, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function AiChatAgent({ attachedFile }: { attachedFile: File | null }) {
  const [fileId, setFileId] = useState<string | null>(null)
  const [indexing, setIndexing] = useState(false)
  const [indexError, setIndexError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const fileIdRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!attachedFile) {
      setFileId(null)
      setIndexError(null)
      fileIdRef.current = null
      return
    }

    const reader = new FileReader()
    const fileName = attachedFile.name.toLowerCase()

    const processContent = async (content: string) => {
      const id = `${attachedFile.name}-${attachedFile.size}`
      setFileId(id)
      fileIdRef.current = id
      setIndexing(true)
      setIndexError(null)

      try {
        const res = await fetch("/api/files/index", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: id, content, fileName: attachedFile.name }),
        })
        if (!res.ok) throw new Error("Indexing failed")
      } catch (err) {
        console.error("Indexing failed:", err)
        setIndexError("Failed to index file. Please try again.")
      } finally {
        setIndexing(false)
      }
    }

    if (fileName.endsWith(".csv")) {
      reader.onload = (e) => processContent(e.target?.result as string)
      reader.readAsText(attachedFile)
   } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer)
    const workbook = XLSX.read(data, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    
    // ✅ Convert to CSV and filter out empty rows
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const cleanedCsv = csv
      .split("\n")
      .filter(row => row.replace(/,/g, "").trim() !== "") // remove rows that are all commas/empty
      .join("\n")
    
    processContent(cleanedCsv)
  }
  reader.readAsArrayBuffer(attachedFile)
}else {
      reader.onload = (e) => processContent(e.target?.result as string)
      reader.readAsText(attachedFile)
    }
  }, [attachedFile])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: { id, messages, fileId: fileIdRef.current },
      }),
    }),
  })

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !attachedFile || isLoading || indexing) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <Card className="flex flex-col shadow-sm border-gray-200" style={{ height: "100%", maxHeight: "100vh" }}>
      <CardHeader className="border-b bg-white pb-4 shrink-0">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Bot className="h-5 w-5" />
          Data Copilot
          {indexing && (
            <span className="text-xs font-normal text-purple-400 ml-2 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Indexing chunks...
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          <div className="space-y-4">

            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-purple-700" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none text-sm text-gray-700 max-w-[80%]">
                  Hello! Upload a CSV or Excel file — even large ones. I'll intelligently search through your data to answer questions accurately!
                </div>
              </div>
            )}

            {indexError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg">
                {indexError}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${
                  m.role === "user" ? "bg-gray-200" : "bg-purple-100"
                }`}>
                  {m.role === "user"
                    ? <User className="h-4 w-4 text-gray-600" />
                    : <Bot className="h-4 w-4 text-purple-700" />}
                </div>
                <div className={`p-3 rounded-lg text-sm max-w-[80%] whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}>
                  {m.parts.map((part: any, i: number) => {
                    if (part.type === "text") return <span key={i}>{part.text}</span>
                    return null
                  })}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex flex-col gap-2 shrink-0">
          {attachedFile && (
            <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md w-fit border ${
              indexing
                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                : indexError
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-purple-100 text-purple-800 border-purple-200"
            }`}>
              <Paperclip className="h-3 w-3" />
              {indexing
                ? "Indexing file chunks..."
                : indexError
                ? "Indexing failed — try re-uploading"
                : `Ready: ${attachedFile.name}`}
            </div>
          )}

          <form className="flex gap-2" onSubmit={onSubmit}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                indexing ? "Please wait, indexing file..."
                : attachedFile ? `Ask about ${attachedFile.name}...`
                : "Please upload a CSV or Excel file first..."
              }
              className="flex-1 bg-white"
              disabled={!attachedFile || isLoading || indexing}
            />
            <button
              type="submit"
              disabled={!attachedFile || isLoading || indexing}
              className={`${
                attachedFile && !isLoading && !indexing
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white p-2 rounded-md transition flex items-center justify-center w-10 h-10`}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}