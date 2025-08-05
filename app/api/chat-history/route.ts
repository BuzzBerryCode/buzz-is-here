import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user from the server-side session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.log('No authenticated user found in chat history API')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    console.log('Loading chat history for user:', user.id)
    
    // Fetch chat sessions for the authenticated user
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
      return NextResponse.json({ error: 'Failed to load chat history' }, { status: 500 })
    }
    
    // Format the chat history
    const formattedHistory = (sessions || []).map((session: any) => {
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
    
    console.log('Chat history loaded successfully:', formattedHistory.length, 'sessions')
    
    return NextResponse.json({ 
      chatHistory: formattedHistory,
      userId: user.id 
    })
    
  } catch (error) {
    console.error('Error in chat history API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 