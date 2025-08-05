import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUGGING OAUTH URL ===')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      })
    }

    // Parse the URL to see what's being sent
    const oauthUrl = new URL(data.url)
    
    return NextResponse.json({ 
      success: true,
      oauthUrl: data.url,
      parsedUrl: {
        protocol: oauthUrl.protocol,
        hostname: oauthUrl.hostname,
        pathname: oauthUrl.pathname,
        searchParams: Object.fromEntries(oauthUrl.searchParams.entries())
      },
      provider: data.provider
    })

  } catch (error) {
    console.error('OAuth URL debug error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate OAuth URL',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 