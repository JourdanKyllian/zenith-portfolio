import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // On récupère tous les cookies
  const cookies = req.cookies.getAll();
  // On cherche s'il y a un cookie Supabase Auth (il commence par "sb-")
  const hasAuthCookie = cookies.some(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));

  const isAuthPage = req.nextUrl.pathname === '/admin/login'
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  // 1. S'il n'est pas connecté et essaie d'aller sur /admin/dashboard -> Redirection vers /login
  if (!hasAuthCookie && isAdminRoute && !isAuthPage) {
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. S'il est DÉJÀ connecté et essaie d'aller sur /admin/login -> Redirection vers /dashboard
  if (hasAuthCookie && isAuthPage) {
    const dashboardUrl = new URL('/admin/dashboard', req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return res
}

// On indique au middleware de ne s'exécuter QUE sur les routes /admin (pour ne pas ralentir le site public)
export const config = {
  matcher: ['/admin/:path*'],
}
