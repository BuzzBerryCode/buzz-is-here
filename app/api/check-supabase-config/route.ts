import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('=== CHECKING SUPABASE CONFIGURATION ===')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if we can connect to Supabase
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data: healthData, error: healthError } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1)
    
    console.log('Health check result:', { 
      hasData: !!healthData, 
      error: healthError?.message 
    })

    // Test OAuth configuration
    console.log('Testing OAuth configuration...')
    const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    console.log('OAuth test result:', { 
      hasData: !!oauthData, 
      hasUrl: !!oauthData?.url,
      error: oauthError?.message 
    })

    // Check current session
    console.log('Checking current session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('Session check result:', { 
      hasSession: !!session, 
      userId: session?.user?.id,
      error: sessionError?.message 
    })

    // Check if we can access auth functions
    console.log('Testing auth functions...')
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    console.log('User check result:', { 
      hasUser: !!userData.user, 
      userId: userData.user?.id,
      error: userError?.message 
    })

    return NextResponse.json({ 
      success: true,
      configuration: {
        healthCheck: {
          success: !healthError,
          error: healthError?.message
        },
        oauthConfig: {
          success: !oauthError,
          hasUrl: !!oauthData?.url,
          error: oauthError?.message
        },
        sessionCheck: {
          hasSession: !!session,
          userId: session?.user?.id,
          error: sessionError?.message
        },
        userCheck: {
          hasUser: !!userData.user,
          userId: userData.user?.id,
          error: userError?.message
        }
      }
    })

  } catch (error) {
    console.error('Configuration check error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Configuration check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 