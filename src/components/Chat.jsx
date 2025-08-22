import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { GET_CHAT, GET_MESSAGES } from '../graphql/queries'
import { CREATE_MESSAGE, SEND_MESSAGE } from '../graphql/mutations'
import { Send, ArrowLeft, Loader2, Bot, User } from 'lucide-react'

function Chat() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null)

  const { loading, error, data: chatData } = useQuery(GET_CHAT, {
    variables: { chatId },
    fetchPolicy: 'cache-and-network'
  })

  const { data: subscriptionData } = useSubscription(GET_MESSAGES, {
    variables: { chatId },
    skip: !chatId
  })

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    onCompleted: () => {
      setMessage('')
      setIsSending(false)
    },
    onError: (error) => {
      console.error('Error creating message:', error)
      setIsSending(false)
    }
  })

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (error) => {
      console.error('Error sending message to AI:', error)
    }
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [subscriptionData])

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return

    setIsSending(true)
    
    try {
      // Save user message to database
      await createMessage({
        variables: {
          chatId,
          content: message.trim(),
          role: 'user'
        }
      })

      // Trigger Hasura Action for AI response
      await triggerAIResponse(message.trim())
    } catch (err) {
      console.error('Failed to send message:', err)
      setIsSending(false)
    }
  }

  const triggerAIResponse = async (userMessage) => {
    try {
      // Call the Hasura Action which triggers n8n workflow
      const result = await sendMessage({
        variables: {
          chatId,
          message: userMessage
        }
      })

      // Save AI response to database
      if (result.data?.sendMessage?.success && result.data.sendMessage.response) {
        await createMessage({
          variables: {
            chatId,
            content: result.data.sendMessage.response,
            role: 'assistant'
          }
        })
      } else {
        // Handle error from AI service
        await createMessage({
          variables: {
            chatId,
            content: result.data?.sendMessage?.error || 'Sorry, I encountered an error. Please try again.',
            role: 'assistant'
          }
        })
      }
    } catch (err) {
      console.error('Failed to get AI response:', err)
      // Save error message
      await createMessage({
        variables: {
          chatId,
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant'
        }
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading chat: {error.message}</p>
        <button 
          onClick={() => navigate('/chats')} 
          className="btn-primary mt-4"
        >
          Back to chats
        </button>
      </div>
    )
  }

  if (!chatData?.chats_by_pk) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chat not found</p>
        <button 
          onClick={() => navigate('/chats')} 
          className="btn-primary mt-4"
        >
          Back to chats
        </button>
      </div>
    )
  }

  const chat = chatData.chats_by_pk
  const messages = subscriptionData?.messages || chat.messages || []

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/chats')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{chat.title}</h1>
          <p className="text-sm text-gray-500">
            Created {new Date(chat.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="card h-96 overflow-y-auto mb-6">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Start a conversation with the AI</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="flex space-x-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="input-field flex-1 resize-none"
          rows={3}
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

export default Chat
