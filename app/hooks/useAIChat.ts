import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  lastUpdated: string
  messageCount: number
}

interface DatabaseSession {
  id: string
  title: string
  subtitle: string
  updated_at: string
  chat_messages: Array<{
    id: string
    content: string
    role: string
    created_at: string
  }>
}

// Generate a proper UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [streamingMessage, setStreamingMessage] = useState<string>('')


  // Initialize session with proper UUID
  useEffect(() => {
    if (!sessionId) {
      setSessionId(generateUUID())
    }
  }, [sessionId])

  // Load chat history from database
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: sessions, error } = await supabase
          .from('chat_sessions')
          .select(`
            id,
            title,
            subtitle,
            updated_at,
            chat_messages (
              id,
              content,
              role,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })

        if (error) {
          console.error('Error loading chat history:', error)
          return
        }

        const formattedHistory: ChatSession[] = (sessions as DatabaseSession[]).map((session: DatabaseSession) => {
          const messages = session.chat_messages || []
          const lastMessage = messages[messages.length - 1]
          
          return {
            id: session.id,
            title: session.title,
            lastMessage: lastMessage ? lastMessage.content.substring(0, 100) : '',
            lastUpdated: session.updated_at,
            messageCount: messages.length
          }
        })

        setChatHistory(formattedHistory)
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }

    loadChatHistory()
  }, [supabase])

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
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: sessions, error } = await supabase
          .from('chat_sessions')
          .select(`
            id,
            title,
            subtitle,
            updated_at,
            chat_messages (
              id,
              content,
              role,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('updated_at', { ascending: false })

        if (!error && sessions) {
          const formattedHistory: ChatSession[] = (sessions as DatabaseSession[]).map((session: DatabaseSession) => {
            const messages = session.chat_messages || []
            const lastMessage = messages[messages.length - 1]
            
            return {
              id: session.id,
              title: session.title,
              lastMessage: lastMessage ? lastMessage.content.substring(0, 100) : '',
              lastUpdated: session.updated_at,
              messageCount: messages.length
            }
          })

          setChatHistory(formattedHistory)
        }
      }

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
  }, [isLoading, sessionId, supabase])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(generateUUID())
    setStreamingMessage('')
  }, [])

  const removeChat = useCallback(async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ is_active: false })
        .eq('id', chatId)

      if (error) {
        console.error('Error removing chat:', error)
        return
      }

      setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    } catch (error) {
      console.error('Error removing chat:', error)
    }
  }, [supabase])

  const clearHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('chat_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error clearing history:', error)
        return
      }

      setChatHistory([])
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }, [supabase])

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
    formatTimestamp
  }
} 