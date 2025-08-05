import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Test OAuth configuration
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })
    
    console.log('OAuth test result:', { data, error })
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      url: data.url,
      provider: data.provider
    })
    
  } catch (error) {
    console.error('OAuth test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 