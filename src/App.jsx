import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthenticationStatus } from '@nhost/react'
import { Loader2 } from 'lucide-react'
import Layout from './components/Layout'
import Auth from './components/Auth'
import ChatList from './components/ChatList'
import Chat from './components/Chat'

function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Auth />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/:chatId" element={<Chat />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
