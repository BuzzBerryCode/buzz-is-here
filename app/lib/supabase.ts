import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface ChatSession {
  id: string
  user_id: string
  title: string
  subtitle?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface ChatMessage {
  id: string
  chat_session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface UserList {
  id: string
  user_id: string
  name: string
  description?: string
  creator_count: number
  created_at: string
  updated_at: string
}

// Influencer data types based on existing schema
export interface Influencer {
  id: string
  handle: string
  display_name: string
  profile_url: string
  profile_image_url: string
  bio: string
  platform: string
  primary_niche: string
  secondary_niche: string
  locationRegion: string
  followers_count: number
  average_views: number
  average_comments: number
  engagement_rate: number
  hashtags: string[]
  email: string
  recent_post_1: any
  recent_post_2: any
  recent_post_3: any
  recent_post_4: any
  recent_post_5: any
  recent_post_6: any
  recent_post_7: any
  recent_post_8: any
  recent_post_9: any
  recent_post_10: any
  recent_post_11: any
  recent_post_12: any
  past_ad_placements: string[]
  created_at: string
  average_likes: any
  brand_tags: string
  bio_links: string
  followers_change: number
  followers_change_type: string
  engagement_rate_change: number
  engagement_rate_change_type: string
  average_views_change: number
  average_views_change_type: string
  average_likes_change: number
  average_likes_change_type: string
  average_comments_change: number
  average_comments_change_type: string
  buzz_score: number
  location: string
}

export interface CampaignRecommendation {
  id: string
  chat_session_id: string
  influencer_ids: string[]
  reasoning: string
  estimated_reach: number
  estimated_engagement_rate: number
  budget_range: {
    min: number
    max: number
    currency: string
  }
  created_at: string
}

export interface InfluencerSearchFilters {
  platform?: string
  primary_niche?: string
  min_followers?: number
  max_followers?: number
  min_engagement_rate?: number
  location?: string
  hashtags?: string[]
}