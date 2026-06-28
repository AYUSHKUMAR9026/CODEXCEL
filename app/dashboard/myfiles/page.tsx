"use client"

import { useEffect, useState } from "react"
import { Download, FileSpreadsheet, FileText, Trash2 } from "lucide-react"

interface File {
  id: string
  name: string
  size: number
  createdAt: string
}

export default function MyFilesPage() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/files/list")
      .then((r) => r.json())
      .then((data) => { setFiles(data); setLoading(false) })
  }, [])

  const handleDownload = async (file: File) => {
    setDownloading(file.id)
    try {
      const res = await fetch(`/api/files/download?id=${file.id}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (fileId: string) => {
    setDeleting(fileId)
    try {
      const res = await fetch(`/api/files/delete?id=${fileId}`, { method: "DELETE" })
      if (res.ok) setFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setDeleting(null)
      setConfirmId(null)
    }
  }

  const getIcon = (name: string) =>
    name.endsWith(".xlsx") || name.endsWith(".xls")
      ? <FileSpreadsheet className="h-5 w-5 text-green-600" />
      : <FileText className="h-5 w-5 text-blue-600" />

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Files</h1>

      {loading ? (
        <p className="text-gray-500">Loading files...</p>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No files saved yet. Upload a file from the dashboard.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {files.map((file) => (
            <div key={file.id}>
              <div className="p-4 border rounded-lg flex items-center justify-between bg-white hover:shadow-sm transition">
                {/* Left */}
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                  onClick={() => handleDownload(file)}
                >
                  {getIcon(file.name)}
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <span className="text-sm text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>

                  <button
                    onClick={() => handleDownload(file)}
                    title="Download"
                    style={{ padding: '6px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3f0ff')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {downloading === file.id
                      ? <span style={{ fontSize: '11px', color: '#7c3aed' }}>...</span>
                      : <Download className="h-4 w-4 text-gray-400" />}
                  </button>

                  <button
                    onClick={() => setConfirmId(confirmId === file.id ? null : file.id)}
                    title="Delete"
                    style={{ padding: '6px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fff1f2')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* ✅ Confirm row OUTSIDE the file row — never clipped */}
              {confirmId === file.id && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                }}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                  <span style={{ fontSize: '13px', color: '#dc2626', flex: 1 }}>
                    Are you sure you want to delete <strong>{file.name}</strong>?
                  </span>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleting === file.id}
                    style={{
                      fontSize: '12px',
                      padding: '5px 14px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      opacity: deleting === file.id ? 0.6 : 1,
                    }}
                  >
                    {deleting === file.id ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    style={{
                      fontSize: '12px',
                      padding: '5px 14px',
                      background: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}