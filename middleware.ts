import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const pathname = req.nextUrl.pathname

    // اگر صفحه login است، بدون بررسی token اجازه دسترسی بده
    if (pathname === '/login' || pathname.startsWith('/login/')) {
        return NextResponse.next()
    }

    // // برای صفحات protected بررسی token
    // if (!token) {
    //     return NextResponse.redirect(new URL('/login', req.url))
    // }

    return NextResponse.next()
}


export const config = { matcher: ['/((?!api|_next|public).*)'] }