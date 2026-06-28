import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Codexcel',
  description: 'Your premium learning and database dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}>
          <header className="flex justify-between items-center px-8 py-4 h-16 bg-white border-b shadow-sm">
            <div className="font-bold text-xl tracking-tight text-purple-700">Codexcel</div>
            
            <div className="flex items-center gap-4">
              {/* Visible only when signed out */}
              <Show when="signed-out">
                <SignInButton />
                <SignUpButton>
                  <button className="bg-purple-700 hover:bg-purple-800 text-white rounded-md font-medium text-sm h-10 px-4 cursor-pointer transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>

              {/* Visible only when signed in */}
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}