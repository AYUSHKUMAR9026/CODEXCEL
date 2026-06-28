"use client"

import { useState } from "react"
import { FileUploadArea } from "@/components/dashboard/file-upload"
import { AiChatAgent } from "@/components/dashboard/ai-chat"

export function WorkspaceClient() {
  // This state now lives ABOVE both components so they can share it!
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleSaveFile = () => {
    // In the future, this will send the file to your Prisma Database
    alert(`Saving ${selectedFile?.name} to your database...`)
    // Optionally clear it after saving, or leave it attached.
  }

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
      {/* Left Side: Upload - We pass the state down as props */}
      <div className="h-full overflow-hidden">
        <FileUploadArea 
          selectedFile={selectedFile} 
          onSelectFile={setSelectedFile} 
          onSaveFile={handleSaveFile}
        />
      </div>

      {/* Right Side: AI Chat - We pass the same state here! */}
      <div className="h-full overflow-hidden">
        <AiChatAgent attachedFile={selectedFile} />
      </div>
    </div>
  )
}