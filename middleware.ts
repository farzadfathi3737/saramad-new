import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const isProtected = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/protected')


    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', req.url))
    }


    return NextResponse.next()
}


export const config = { matcher: ['/dashboard/:path*'] }