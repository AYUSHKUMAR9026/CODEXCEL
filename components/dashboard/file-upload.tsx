"use client"

import { useState } from "react"
import { UploadCloud, FileSpreadsheet, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveFileToDatabase } from "@/app/actions/save-file"

// We define the props this component expects to receive
interface FileUploadProps {
  selectedFile: File | null
  onSelectFile: (file: File | null) => void
  onSaveFile?: () => void // Kept optional to maintain backwards compatibility
}

export function FileUploadArea({ selectedFile, onSelectFile, onSaveFile }: FileUploadProps) {
  const [isSaving, setIsSaving] = useState(false)
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onSelectFile(file)
    }
  }

  const handleSave = async () => {
    if (!selectedFile || isSaving) return;
    setIsSaving(true);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          
          // Use standard fetch instead of the server action to bypass serialization limits
          const response = await fetch("/api/files/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: selectedFile.name,
              content: content,
              size: selectedFile.size,
            }),
          });

          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
          
          if (onSaveFile) {
            onSaveFile();
          }
          
          alert("File saved successfully!");
        } catch (error) {
          console.error("Failed to save file contents:", error);
          alert("Error saving file content to database.");
        } finally {
          setIsSaving(false);
        }
      };

      // Check file extension to read binary streams or standard plain text properly
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        reader.readAsBinaryString(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }

    } catch (err) {
      console.error("File processing error:", err);
      alert("Failed to process file for saving.");
      setIsSaving(false);
    }
  };
  return (
    <Card className="h-full flex flex-col border-dashed border-2 border-gray-300 bg-gray-50/50">
      <CardHeader>
        <CardTitle>Upload Data</CardTitle>
        <CardDescription>Drag and drop your Excel (.xlsx) or CSV files here.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6">
        {!selectedFile ? (
          <>
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <UploadCloud className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Click to upload</h3>
            <p className="text-sm text-gray-500 mt-2">Maximum file size 50MB.</p>
            
            <input 
              type="file" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
              className="hidden" 
              id="file-upload"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload" 
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 transition"
            >
              Select File
            </label>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-sm p-4 bg-white border border-purple-200 rounded-lg shadow-sm flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileSpreadsheet className="h-8 w-8 text-green-600 shrink-0" />
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => onSelectFile(null)} 
                disabled={isSaving}
                className="text-gray-400 hover:text-red-500 transition disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving File...
                </>
              ) : (
                "Save File"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}