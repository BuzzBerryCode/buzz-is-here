import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_actual_project_url_here' || supabaseAnonKey === 'your_actual_anon_key_here') {
  throw new Error('Missing Supabase environment variables. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching your exact Supabase schema
export type Database = {
  public: {
    Tables: {
      creatordata: {
        Row: {
          id: string;
          uuid: string;
          handle: string;
          display_name: string;
          profile_url: string;
          profile_image_url: string;
          bio: string;
          platform: string;
          primary_niche: string;
          secondary_niche: string;
          location: string;
          followers_count: number;
          average_views: number;
          average_comments: number;
          engagement_rate: number;
          hashtags: string[];
          email: string;
          recent_post_1: any; // JSONB
          recent_post_2: any; // JSONB
          recent_post_3: any; // JSONB
          recent_post_4: any; // JSONB
          recent_post_5: any; // JSONB
          recent_post_6: any; // JSONB
          recent_post_7: any; // JSONB
          recent_post_8: any; // JSONB
          recent_post_9: any; // JSONB
          recent_post_10: any; // JSONB
          recent_post_11: any; // JSONB
          recent_post_12: any; // JSONB
          paid_ad_placements: boolean;
          created_at: string;
          average_likes: any; // JSONB
          brand_tags: string;
          bio_links: string;
          followers_change: number;
          followers_change_type: string;
          engagement_rate_change: number;
          engagement_rate_change_type: string;
          average_views_change: number;
          average_views_change_type: string;
          average_likes_change: number;
          average_likes_change_type: string;
          average_comments_change: number;
          average_comments_change_type: string;
          buzz_score: number;
        };
        Insert: {
          id?: string;
          uuid?: string;
          handle: string;
          display_name: string;
          profile_url?: string;
          profile_image_url?: string;
          bio?: string;
          platform: string;
          primary_niche?: string;
          secondary_niche?: string;
          location?: string;
          followers_count: number;
          average_views: number;
          average_comments: number;
          engagement_rate: number;
          hashtags?: string[];
          email?: string;
          recent_post_1?: any;
          recent_post_2?: any;
          recent_post_3?: any;
          recent_post_4?: any;
          recent_post_5?: any;
          recent_post_6?: any;
          recent_post_7?: any;
          recent_post_8?: any;
          recent_post_9?: any;
          recent_post_10?: any;
          recent_post_11?: any;
          recent_post_12?: any;
          paid_ad_placements?: boolean;
          created_at?: string;
          average_likes?: any;
          brand_tags?: string;
          bio_links?: string;
          followers_change?: number;
          followers_change_type?: string;
          engagement_rate_change?: number;
          engagement_rate_change_type?: string;
          average_views_change?: number;
          average_views_change_type?: string;
          average_likes_change?: number;
          average_likes_change_type?: string;
          average_comments_change?: number;
          average_comments_change_type?: string;
          buzz_score?: number;
        };
        Update: {
          id?: string;
          uuid?: string;
          handle?: string;
          display_name?: string;
          profile_url?: string;
          profile_image_url?: string;
          bio?: string;
          platform?: string;
          primary_niche?: string;
          secondary_niche?: string;
          location?: string;
          followers_count?: number;
          average_views?: number;
          average_comments?: number;
          engagement_rate?: number;
          hashtags?: string[];
          email?: string;
          recent_post_1?: any;
          recent_post_2?: any;
          recent_post_3?: any;
          recent_post_4?: any;
          recent_post_5?: any;
          recent_post_6?: any;
          recent_post_7?: any;
          recent_post_8?: any;
          recent_post_9?: any;
          recent_post_10?: any;
          recent_post_11?: any;
          recent_post_12?: any;
          paid_ad_placements?: boolean;
          created_at?: string;
          average_likes?: any;
          brand_tags?: string;
          bio_links?: string;
          followers_change?: number;
          followers_change_type?: string;
          engagement_rate_change?: number;
          engagement_rate_change_type?: string;
          average_views_change?: number;
          average_views_change_type?: string;
          average_likes_change?: number;
          average_likes_change_type?: string;
          average_comments_change?: number;
          average_comments_change_type?: string;
          buzz_score?: number;
        };
      };
    };
  };
};

// Helper type for the transformed creator data
export interface CreatorData {
  id: string;
  profile_pic: string;
  match_score?: number; // This will be calculated/assigned by AI
  buzz_score: number;
  username: string;
  username_tag: string;
  social_media: Array<{
    platform: string;
    username: string;
    url: string;
  }>;
  bio: string;
  followers: number;
  followers_change: number;
  followers_change_type: 'positive' | 'negative';
  engagement: number;
  engagement_change: number;
  engagement_change_type: 'positive' | 'negative';
  avg_views: number;
  avg_views_change: number;
  avg_views_change_type: 'positive' | 'negative';
  avg_likes: number;
  avg_likes_change: number;
  avg_likes_change_type: 'positive' | 'negative';
  avg_comments: number;
  avg_comments_change: number;
  avg_comments_change_type: 'positive' | 'negative';
  niches: string[];
  hashtags: string[];
  thumbnails: string[];
  location: string;
  email: string;
  created_at: string;
  updated_at: string;
} 