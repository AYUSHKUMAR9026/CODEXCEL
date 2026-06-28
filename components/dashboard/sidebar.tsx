import Link from "next/link"
import { Home, Database, Settings, CodeSquare } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-white h-screen sticky top-0">
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-purple-50 hover:text-purple-700 transition">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <Link href="/dashboard/myfiles" className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-md hover:bg-purple-50 hover:text-purple-700 transition">
          <Database className="h-4 w-4" />
          My Files
        </Link>
      </nav>
    </aside>
  )
}