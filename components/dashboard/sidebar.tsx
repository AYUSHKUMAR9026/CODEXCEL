"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Database, Settings, CodeSquare } from "lucide-react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "My Files", href: "/dashboard/myfiles", icon: Database },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    // Changed to a deep gray background (bg-gray-900) with a subtle dark border
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-800 bg-gray-900 h-screen sticky top-0">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 font-medium" // Solid purple with a subtle glow
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100" // Subtle gray hover effect
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}