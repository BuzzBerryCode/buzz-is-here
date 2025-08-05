import { useState, useEffect, useCallback } from 'react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  lastUpdated: string
  messageCount: number
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [streamingMessage, setStreamingMessage] = useState<string>('')
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize session with proper UUID
  useEffect(() => {
    if (!sessionId) {
      setSessionId(generateUUID())
    }
  }, [sessionId])

  // Load chat history from server-side API
  const loadChatHistory = useCallback(async () => {
    try {
      console.log('Loading chat history from server API...')
      
      const response = await fetch('/api/chat-history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Failed to load chat history:', response.status)
        return
      }

      const data = await response.json()
      
      if (data.chatHistory) {
        console.log('Chat history loaded successfully:', data.chatHistory.length, 'sessions')
        setChatHistory(data.chatHistory)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }, [])

  // Load chat history when component mounts
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
      loadChatHistory()
    }
  }, [isInitialized, loadChatHistory])

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: generateUUID(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setStreamingMessage('')

    try {
      // Only send sessionId if we have a real session from the API
      const requestBody: any = { message }
      if (currentSessionId) {
        requestBody.sessionId = currentSessionId
      }

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Check if the response includes a new session ID
      const sessionIdHeader = response.headers.get('X-Session-ID')
      if (sessionIdHeader && !currentSessionId) {
        setCurrentSessionId(sessionIdHeader)
        console.log('New session created with ID:', sessionIdHeader)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedText = ''
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        accumulatedText += chunk
        setStreamingMessage(accumulatedText)
      }

      const assistantMessage: Message = {
        id: generateUUID(),
        content: accumulatedText,
        role: 'assistant',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessage('')

      // Refresh chat history after new message
      loadChatHistory()

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: generateUUID(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
      setStreamingMessage('')
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, currentSessionId, loadChatHistory])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(generateUUID())
    setCurrentSessionId('')
    setStreamingMessage('')
  }, [])

  const removeChat = useCallback(async (chatId: string) => {
    try {
      console.log('Deleting chat session:', chatId)
      
      const response = await fetch('/api/chat-history/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId })
      })

      if (!response.ok) {
        console.error('Failed to delete chat session:', response.status)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        console.log('Chat session deleted successfully:', chatId)
        // Remove from local state
        setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
      }
    } catch (error) {
      console.error('Error removing chat:', error)
    }
  }, [])

  const clearHistory = useCallback(async () => {
    try {
      console.log('Clearing all chat history')
      
      const response = await fetch('/api/chat-history/clear-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        console.error('Failed to clear chat history:', response.status)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        console.log('All chat history cleared successfully')
        // Clear local state
        setChatHistory([])
      }
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }, [])

  const formatTimestamp = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }, [])

  const loadChatSession = useCallback(async (chatId: string) => {
    try {
      console.log('Loading chat session from server API:', chatId)
      
      const response = await fetch('/api/chat-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: chatId })
      })

      if (!response.ok) {
        console.error('Failed to load chat session:', response.status)
        return
      }

      const data = await response.json()
      
      if (data.session && data.messages) {
        // Set the current session ID and messages immediately
        setCurrentSessionId(data.session.id)
        setMessages(data.messages)
        console.log('Chat session loaded successfully:', data.session.id, 'with', data.messages.length, 'messages')
      }
    } catch (error) {
      console.error('Error loading chat session:', error)
    }
  }, [])

  const refreshChatHistory = useCallback(async () => {
    console.log('Refreshing chat history...')
    await loadChatHistory()
  }, [loadChatHistory])

  return {
    messages,
    isLoading,
    sessionId,
    chatHistory,
    streamingMessage,
    sendMessage,
    clearMessages,
    removeChat,
    clearHistory,
    formatTimestamp,
    loadChatSession,
    refreshChatHistory
  }
} 