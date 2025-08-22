import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSignOut } from '@nhost/react'
import { MessageSquare, LogOut, Plus } from 'lucide-react'

function Layout({ children }) {
  const { signOut } = useSignOut()
  const location = useLocation()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/chats" className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">AI Chatbot</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/chats"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/chats'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Chats
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
