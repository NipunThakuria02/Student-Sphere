'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  const isActive = (path: string) => pathname === path

  // Check admin status via API
  useEffect(() => {
    async function checkAdmin() {
      if (!session?.user?.email) {
        setIsAdmin(false)
        return
      }
      
      try {
        const response = await fetch('/api/admin/stats')
        setIsAdmin(response.ok)
      } catch {
        setIsAdmin(false)
      }
    }
    
    checkAdmin()
  }, [session])
  

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Student Sphere</span>
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Posts
              </Link>
              <Link
                href="/academic"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/academic') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Academic
              </Link>
              <Link
                href="/non-academic"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/non-academic') 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Non-Academic
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/create"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Create Post
                </Link>
                {/* Admin Dashboard Link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <img
                      src={session.user.image || '/default-avatar.png'}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
