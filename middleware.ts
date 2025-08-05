import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Only run middleware on actual page routes, not static assets
  const pathname = req.nextUrl.pathname
  
  // Skip middleware for static assets, API routes, and other non-page requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // Files with extensions (images, css, js, etc.)
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/.well-known')
  ) {
    return res
  }
  
  // Only run auth checks on actual page routes
  if (pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/auth')) {
    const supabase = createMiddlewareClient({ req, res })
    
    try {
      // Refresh session if expired - required for Server Components
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.log('Middleware session error:', error.message)
        // Don't block the request, just log the error
      } else {
        // Only log session info for actual page requests, not static assets
        console.log('Middleware session check:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          path: pathname 
        })
      }
      
      // Allow all requests to proceed, even if there are auth issues
      // This ensures users can still access the dashboard
      
    } catch (err) {
      console.error('Middleware error:', err)
      // Don't block the request on middleware errors
    }
  }
  
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 