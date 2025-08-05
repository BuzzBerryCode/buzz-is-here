import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('Test auth API:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      authError: authError?.message,
      sessionError: sessionError?.message
    })
    
    if (authError || !user) {
      return NextResponse.json({ 
        authenticated: false, 
        error: authError?.message || 'No user found',
        hasSession: !!session
      })
    }
    
    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name
      },
      hasSession: !!session,
      sessionUserId: session?.user?.id
    })
    
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 