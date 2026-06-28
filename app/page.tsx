import { SignInButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  // 1. Check if the user is authenticated on the server
  const { userId } = await auth()
  
  // 2. If they are logged in, instantly redirect them to the new dashboard
  if (userId) {
    redirect('/dashboard')
  }

  // 3. If they are NOT logged in, show them the public landing page
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="text-purple-700">Codexcel</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The ultimate companion workspace to track your database architecture, master server logic, and manage application workflows.
        </p>
        <SignInButton>
          <button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-base py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
            Get Started for Free
          </button>
        </SignInButton>
      </div>
    </div>
  )
}