import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  try {
    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('Middleware session error:', error.message)
    } else {
      console.log('Middleware session check:', { 
        hasSession: !!session, 
        userId: session?.user?.id,
        path: req.nextUrl.pathname 
      })
    }
  } catch (err) {
    console.error('Middleware error:', err)
  }
  
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 