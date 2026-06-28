import { Sidebar } from "@/components/dashboard/sidebar"

import { Footer } from "@/components/dashboard/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Sidebar Fixed */}
      <Sidebar />
      
      {/* Main Content Area (Header + Page + Footer) */}
      <div className="flex flex-col flex-1 w-full">
       
        
        <main className="flex-1 p-6 overflow-auto">
          {/* This {children} is where your page.tsx content injects! */}
          {children} 
        </main>
        
        <Footer />
      </div>
    </div>
  )
}