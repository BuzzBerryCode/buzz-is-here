import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')
  
  console.log('=== OAUTH CALLBACK START ===')
  console.log('OAuth callback received:', { 
    code: !!code, 
    error, 
    errorDescription,
    fullUrl: request.url 
  })
  
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    
    // If it's a database error, we need to fix the database permissions
    if (errorDescription?.includes('Database error saving new user')) {
      console.log('Database error detected - this needs to be fixed in Supabase')
      console.log('Please run the SQL commands in fix-oauth-database.sql in your Supabase SQL Editor')
      return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('Database configuration error. Please contact support.')}`)
    }
    
    return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`)
  }
  
  if (code) {
    try {
      console.log('Creating Supabase client for code exchange...')
      const supabase = createRouteHandlerClient({ cookies })
      
      console.log('Exchanging code for session...')
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError)
        return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent(exchangeError.message)}`)
      }
      
      console.log('Session exchange successful:', { 
        user: data.user?.email,
        userId: data.user?.id,
        session: !!data.session,
        accessToken: !!data.session?.access_token,
        refreshToken: !!data.session?.refresh_token
      })
      
      // Verify the session was created
      console.log('Verifying session...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session verification error:', sessionError)
        return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('Session verification failed')}`)
      }
      
      if (!session?.user) {
        console.error('No user found in session after OAuth')
        return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('No user found in session')}`)
      }
      
      console.log('Session verified successfully:', { 
        hasSession: !!session, 
        userId: session.user.id,
        userEmail: session.user.email,
        userCreatedAt: session.user.created_at,
        accessToken: !!session.access_token,
        expiresAt: session.expires_at
      })
      
      // Successfully authenticated - redirect to dashboard
      console.log('OAuth authentication successful, redirecting to dashboard')
      console.log('=== OAUTH CALLBACK END ===')
      return NextResponse.redirect('http://localhost:3000/dashboard')
      
    } catch (err) {
      console.error('Unexpected error in callback:', err)
      return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('Unexpected error during authentication')}`)
    }
  } else {
    console.error('No code received in callback')
    return NextResponse.redirect('http://localhost:3000?error=no_code')
  }
} 