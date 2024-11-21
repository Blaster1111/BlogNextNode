// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/token-utils'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Define public paths
  const publicPaths = ['/login', '/signup']
  const isPublicPath = publicPaths.includes(path)

  // If trying to access login/signup while already authenticated, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For protected routes
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.includes(path)

  if (isProtectedPath) {
    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verify token
    try {
      const validToken = await verifyToken(token)
      if (!validToken) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/login', 
    '/signup'
  ]
}