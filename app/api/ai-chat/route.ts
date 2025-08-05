import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { generateAIResponse } from '@/lib/ai/gemini'
import {
  createChatSession,
  createChatMessage,
  updateChatSession,
  getChatMessages,
  getInfluencerStats,
  searchInfluencers,
  getInfluencerByHandle
} from '@/lib/ai/database'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, systemPromptName = 'buzzberry_default' } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get authenticated user for verification
    const supabase = createRouteHandlerClient({ cookies })

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('Auth check:', { 
      hasUser: !!user, 
      userId: user?.id, 
      userEmail: user?.email,
      authError: authError?.message 
    });

    // Ensure we have a valid authenticated user
    if (!user?.id) {
      console.log('No authenticated user found, returning error');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = user.id;

    console.log('Using user ID:', userId);

    // Create service role client for database operations
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Test if chat_sessions table exists and has data
    try {
      const { data: testData, error: testError } = await supabaseService
        .from('chat_sessions')
        .select('*')
        .limit(1);
      
      console.log('Chat sessions table test:', { 
        hasData: !!testData, 
        dataLength: testData?.length || 0, 
        error: testError?.message 
      });
    } catch (error) {
      console.error('Error testing chat_sessions table:', error);
    }

    // Create or get chat session
    let currentSessionId = sessionId
    if (!currentSessionId) {
      console.log('Creating new chat session for user:', userId);
      const newSession = await createChatSession(userId, message.substring(0, 50), '', supabaseService)
      console.log('createChatSession result:', newSession);
      
      if (!newSession) {
        console.error('Failed to create chat session - returning error');
        return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 })
      }
      
      currentSessionId = newSession.id
      console.log('New session created with ID:', currentSessionId);
    } else {
      console.log('Using existing session ID:', currentSessionId);
    }

    // Search for relevant creators
    let relevantCreators: any[] = []
    try {
      const searchKeywords = ['creator', 'influencer', 'tiktok', 'instagram', 'youtube', 'followers', 'engagement', 'niche', 'platform', '@', 'find', 'show', 'search', 'meme', 'crypto', 'coin', 'miami', 'florida', 'location']
      
      const hasSearchKeywords = searchKeywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
      )

      if (hasSearchKeywords) {
        // Check if it's a specific handle search
        if (message.includes('@')) {
          const handleMatch = message.match(/@(\w+)/)
          if (handleMatch) {
            const specificCreator = await getInfluencerByHandle(handleMatch[1])
            if (specificCreator) {
              relevantCreators = [specificCreator]
            }
          }
        }

        // If no specific creator found or it's a general search, do broader search
        if (relevantCreators.length === 0) {
          // Extract search terms more intelligently
          const words = message.toLowerCase().split(' ')
          const searchTerms = words.filter((term: string) => 
            term.length > 2 && 
            !['the', 'and', 'for', 'with', 'from', 'this', 'that', 'have', 'they', 'will', 'would', 'could', 'should', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'against', 'toward', 'towards', 'upon', 'except', 'besides', 'beyond', 'behind', 'beneath', 'beside', 'inside', 'outside', 'underneath', 'alongside', 'throughout', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 'whenever', 'whatever', 'whichever', 'whoever', 'whomever', 'however', 'nevertheless', 'nonetheless', 'moreover', 'furthermore', 'therefore', 'consequently', 'accordingly', 'meanwhile', 'otherwise', 'likewise', 'similarly', 'indeed', 'actually', 'basically', 'essentially', 'generally', 'usually', 'typically', 'normally', 'commonly', 'frequently', 'often', 'sometimes', 'rarely', 'seldom', 'never', 'always', 'ever', 'never', 'already', 'still', 'yet', 'just', 'only', 'even', 'also', 'too', 'as', 'well', 'either', 'neither', 'both', 'each', 'every', 'all', 'any', 'some', 'none', 'many', 'much', 'few', 'several', 'various', 'different', 'same', 'similar', 'other', 'another', 'next', 'last', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'find', 'show', 'search', 'me', 'in', 'on', 'at', 'to', 'of', 'by', 'is', 'are', 'was', 'were', 'can', 'get', 'give', 'tell', 'info', 'information', 'data', 'based', 'type', 'with', 'over', 'under', 'around', 'near', 'close', 'like', 'such', 'example', 'including', 'especially', 'particularly', 'mainly', 'mostly', 'primarily', 'secondarily'].includes(term)
          )
          
          if (searchTerms.length > 0) {
            // Try multiple search strategies
            const searchQuery = searchTerms.join(' ')
            relevantCreators = await searchInfluencers(searchQuery, {}, 15)
            
            // If no results, try individual terms
            if (relevantCreators.length === 0) {
              for (const term of searchTerms.slice(0, 3)) {
                const termResults = await searchInfluencers(term, {}, 10)
                relevantCreators = [...relevantCreators, ...termResults]
              }
              // Remove duplicates
              relevantCreators = relevantCreators.filter((creator, index, self) => 
                index === self.findIndex(c => c.id === creator.id)
              )
            }
          }
        }
      }
    } catch (error) {
      console.error('Error searching influencers:', error)
    }

    // Save user message to database FIRST (so it's included in context)
    try {
      await createChatMessage(currentSessionId, 'user', message, supabaseService)
      console.log('User message saved successfully');
    } catch (error) {
      console.error('Error saving user message:', error)
    }

    // Get full chat history for context (like ChatGPT) - NOW INCLUDES THE CURRENT MESSAGE
    let chatHistory: any[] = []
    try {
      console.log('Fetching chat history for session:', currentSessionId);
      chatHistory = await getChatMessages(currentSessionId, 50, supabaseService) // Get last 50 messages for context
      console.log('Chat history loaded:', chatHistory.length, 'messages');
    } catch (error) {
      console.error('Error getting chat history:', error)
    }

    // Format chat history for Gemini context (include both user and assistant messages)
    const conversationContext = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    })).slice(-20); // Keep last 20 messages for context (to avoid token limits)

    console.log('Conversation context for AI:', {
      messageCount: conversationContext.length,
      context: conversationContext.map(msg => `${msg.role}: ${msg.content.substring(0, 50)}...`)
    });

    // Get database stats
    let influencerStats: any = {}
    try {
      influencerStats = await getInfluencerStats()
    } catch (error) {
      console.error('Error getting influencer stats:', error)
    }

    // Generate AI response with full conversation context (like ChatGPT)
    const aiResponse = await generateAIResponse({
      prompt: message,
      systemPromptName,
      context: {
        stats: influencerStats,
        creators: relevantCreators,
        history: conversationContext, // Use full conversation context
        searchQuery: message,
        filters: {}
      }
    })

    // Save AI response to database
    try {
      await createChatMessage(currentSessionId, 'assistant', aiResponse.content, supabaseService)
      console.log('AI response saved successfully');
    } catch (error) {
      console.error('Error saving AI message:', error)
    }

    // Update chat session
    try {
      await updateChatSession(currentSessionId, { title: message.substring(0, 50) }, supabaseService)
    } catch (error) {
      console.error('Error updating chat session:', error)
    }

    // Return streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the response in chunks for smooth streaming
        const chunks = aiResponse.content.split(' ')
        let index = 0

        const sendChunk = () => {
          if (index < chunks.length) {
            const chunk = chunks[index] + (index < chunks.length - 1 ? ' ' : '')
            controller.enqueue(encoder.encode(chunk))
            index++
            setTimeout(sendChunk, 50) // 50ms delay between chunks for smooth effect
          } else {
            controller.close()
          }
        }

        sendChunk()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Session-ID': currentSessionId, // Include session ID in response headers
      },
    })

  } catch (error) {
    console.error('Error in AI chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 