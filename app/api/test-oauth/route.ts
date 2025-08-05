import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING OAUTH CONFIGURATION ===')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Test getting OAuth URL
    console.log('Testing OAuth URL generation...')
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

    console.log('OAuth URL test result:', { 
      hasData: !!data, 
      hasUrl: !!data?.url, 
      error: error?.message 
    })

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      })
    }

    return NextResponse.json({ 
      success: true, 
      hasUrl: !!data?.url,
      url: data?.url ? 'URL generated successfully' : 'No URL generated'
    })

  } catch (error) {
    console.error('Test OAuth error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error',
      details: error
    })
  }
} 