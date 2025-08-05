import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  const errorDescription = url.searchParams.get('error_description')
  
  console.log('OAuth callback received:', { 
    code: !!code, 
    error, 
    errorDescription,
    fullUrl: request.url 
  })
  
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    
    // If it's a database error, try to handle it gracefully
    if (errorDescription?.includes('Database error saving new user')) {
      console.log('Database error detected - attempting to handle gracefully')
      
      try {
        const supabase = createRouteHandlerClient({ cookies })
        
        // Try to get any existing session first
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('Existing session found despite database error, proceeding to dashboard')
          return NextResponse.redirect('http://localhost:3000/dashboard')
        }
        
        // If no session, redirect to signup page with helpful message
        console.log('No session found, redirecting to signup page')
        return NextResponse.redirect(`http://localhost:3000/signup?error=${encodeURIComponent('Please try signing up with email/password or contact support if the issue persists.')}`)
      } catch (sessionError) {
        console.log('Session check failed, redirecting to signup page')
        return NextResponse.redirect(`http://localhost:3000/signup?error=${encodeURIComponent('Please try signing up with email/password or contact support if the issue persists.')}`)
      }
    }
    
    return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`)
  }
  
  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError)
        
        // If it's a database error, redirect to signup
        if (exchangeError.message.includes('Database error')) {
          return NextResponse.redirect(`http://localhost:3000/signup?error=${encodeURIComponent('Please try signing up with email/password or contact support if the issue persists.')}`)
        }
        
        return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('Authentication failed. Please try again.')}`)
      }
      
      console.log('Session exchange successful:', { 
        user: data.user?.email,
        userId: data.user?.id,
        session: !!data.session 
      })
      
      // Verify the session was created and has a user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Session verification error:', sessionError)
        return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('Session verification failed. Please try again.')}`)
      }
      
      if (!session?.user) {
        console.error('No user found in session after OAuth')
        return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('No user found in session. Please try again.')}`)
      }
      
      console.log('Session verified successfully:', { 
        hasSession: !!session, 
        userId: session.user.id,
        userEmail: session.user.email,
        accessToken: !!session.access_token 
      })
      
      // Successfully authenticated - redirect to dashboard
      console.log('OAuth authentication successful, redirecting to dashboard')
      return NextResponse.redirect('http://localhost:3000/dashboard')
      
    } catch (err) {
      console.error('Unexpected error in callback:', err)
      return NextResponse.redirect(`http://localhost:3000?error=${encodeURIComponent('Unexpected error during authentication. Please try again.')}`)
    }
  } else {
    console.error('No code received in callback')
    return NextResponse.redirect('http://localhost:3000?error=no_code')
  }
} 