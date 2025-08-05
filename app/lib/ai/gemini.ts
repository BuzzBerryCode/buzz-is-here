import { GoogleGenerativeAI } from '@google/generative-ai'
import type { GeminiResponse } from './types'
import { SYSTEM_PROMPTS } from './prompts/system-prompts'
import { CONTEXT_TEMPLATES } from './prompts/context-templates'
import { RESPONSE_FORMATS } from './prompts/response-formats'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export interface GenerateAIResponseOptions {
  prompt: string
  systemPromptName?: string
  context?: {
    stats?: any
    creators?: any[]
    history?: Array<{ role: 'user' | 'assistant'; content: string }>
    searchQuery?: string
    filters?: any
  }
  responseFormat?: 'default' | 'creator_list' | 'creator_detailed' | 'analytics_summary'
}

export async function generateAIResponse(options: GenerateAIResponseOptions): Promise<GeminiResponse> {
  try {
    const {
      prompt,
      systemPromptName = 'buzzberry_default',
      context = {},
      responseFormat = 'default'
    } = options

    // Get system prompt
    const systemPrompt = SYSTEM_PROMPTS[systemPromptName as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.BUZZBERRY_DEFAULT

    // Build full prompt with context
    let fullPrompt = systemPrompt.template + '\n\n'

    // Add database stats if available
    if (context.stats) {
      fullPrompt += CONTEXT_TEMPLATES.DATABASE_STATS(context.stats) + '\n\n'
    }

    // Add relevant creators if available
    if (context.creators && context.creators.length > 0) {
      fullPrompt += CONTEXT_TEMPLATES.RELEVANT_CREATORS(context.creators) + '\n\n'
    }

    // Add conversation history if available
    if (context.history && context.history.length > 0) {
      fullPrompt += CONTEXT_TEMPLATES.CONVERSATION_HISTORY(context.history) + '\n\n'
    }

    // Add search context if available
    if (context.searchQuery) {
      fullPrompt += CONTEXT_TEMPLATES.SEARCH_CONTEXT(context.searchQuery, context.filters || {}) + '\n\n'
    }

    // Add user prompt
    fullPrompt += `User: ${prompt}\n\nAssistant:`

    // Generate response
    const result = await geminiModel.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    return { content: text }
  } catch (error) {
    console.error('Gemini API error:', error)
    return { 
      content: 'I apologize, but I encountered an error processing your request. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Specialized function for influencer analysis
export async function generateInfluencerAnalysis(
  influencers: any[],
  userQuery: string,
  context?: any
): Promise<GeminiResponse> {
  try {
    const influencerData = influencers.map(inf => `
Creator: ${inf.display_name} (@${inf.handle})
- Platform: ${inf.platform}
- Followers: ${inf.followers_count.toLocaleString()}
- Engagement Rate: ${inf.engagement_rate.toFixed(2)}%
- Primary Niche: ${inf.primary_niche}
- Location: ${inf.location || 'N/A'}
- Buzz Score: ${inf.buzz_score}
- Bio: ${inf.bio || 'N/A'}
- Recent Performance: ${inf.followers_change > 0 ? '+' : ''}${inf.followers_change} followers, ${inf.engagement_rate_change > 0 ? '+' : ''}${inf.engagement_rate_change}% engagement change
`).join('\n')

    const fullPrompt = `${SYSTEM_PROMPTS.BUZZBERRY_ANALYST.template}

CREATOR DATA:
${influencerData}

USER QUERY: ${userQuery}

Please provide a detailed analysis including:
1. Relevance to the query
2. Key strengths and opportunities
3. Potential campaign fit
4. Estimated reach and engagement potential
5. Budget recommendations
6. Any concerns or considerations

Be specific, data-driven, and actionable in your response.`

    const result = await geminiModel.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()
    
    return { content: text }
  } catch (error) {
    console.error('Gemini influencer analysis error:', error)
    return { 
      content: 'I apologize, but I encountered an error analyzing the creators. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Helper function to format responses
export function formatResponse(format: string, data: any): string {
  switch (format) {
    case 'creator_list':
      return RESPONSE_FORMATS.CREATOR_LIST(data)
    case 'creator_detailed':
      return RESPONSE_FORMATS.CREATOR_DETAILED(data)
    case 'analytics_summary':
      return RESPONSE_FORMATS.ANALYTICS_SUMMARY(data.stats, data.creators)
    case 'error':
      return RESPONSE_FORMATS.ERROR_RESPONSE(data)
    default:
      return data
  }
} 