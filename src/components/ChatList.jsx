import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CHATS } from '../graphql/queries'
import { CREATE_CHAT } from '../graphql/mutations'
import { Plus, MessageSquare, Calendar, Clock } from 'lucide-react'

function ChatList() {
  const [newChatTitle, setNewChatTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { loading, error, data, refetch } = useQuery(GET_CHATS)
  const [createChat] = useMutation(CREATE_CHAT, {
    onCompleted: () => {
      setNewChatTitle('')
      setIsCreating(false)
      refetch()
    },
    onError: (error) => {
      console.error('Error creating chat:', error)
      setIsCreating(false)
    }
  })

  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return
    
    setIsCreating(true)
    try {
      await createChat({
        variables: { title: newChatTitle.trim() }
      })
    } catch (err) {
      console.error('Failed to create chat:', err)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading chats: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="btn-primary mt-4"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Chats</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Create new chat form */}
      {isCreating && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Start a new chat</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter chat title..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateChat()}
            />
            <button
              onClick={handleCreateChat}
              disabled={!newChatTitle.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false)
                setNewChatTitle('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chats list */}
      {data?.chats?.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No chats yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new chat.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary mt-6"
          >
            Create your first chat
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {data?.chats?.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {chat.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{chat.messages_aggregate.aggregate.count} messages</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(chat.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(chat.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatList
