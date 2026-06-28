import { WorkspaceClient } from "@/components/dashboard/workspace-client"

export default function DashboardHomePage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Workspace Overview</h1>
        <p className="text-gray-500 text-sm">Upload your datasets and start querying with AI instantly.</p>
      </div>

      {/* The Wrapper handles the grid and the state for both the upload and chat components! */}
      <WorkspaceClient />
    </div>
  )
}