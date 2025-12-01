// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Token } from '@/lib/types'

async function refreshToken(oldToken: Token): Promise<Token | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_EXTERNAL_API}/api/Membership/User/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: oldToken.refreshToken }),
        })

        if (!res.ok) return null

        const newToken = await res.json()
        return newToken.token as Token
    } catch (error) {
        console.error('Error refreshing token:', error)
        return null
    }
}


async function proxyHandler(req: NextRequest, path: string) {
    const tokenStr = req.cookies.get('token')?.value
    if (!tokenStr) {
        console.log('❌ No token in cookies')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let token: Token
    try {
        token = JSON.parse(tokenStr)
    } catch {
        console.log('❌ Invalid token JSON')
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }

    //console.log('✅ Current token:', token)

    // اضافه کردن query string به URL
    const queryString = req.nextUrl.search
    console.log('🔍 Query String in proxy:', queryString, '| Length:', queryString.length)
    const targetUrl = `${process.env.NEXT_PUBLIC_EXTERNAL_API}/${path}${queryString}`
    const headers: Record<string, string> = {}

    req.headers.forEach((v, k) => {
        if (k !== 'host' && k !== 'cookie') headers[k] = v
    })
    headers['Authorization'] = `Bearer ${token.accessToken}`

    const method = req.method || 'GET'
    const body =
        method === 'GET' || method === 'HEAD' ? undefined : await req.text()

    console.log(`🌍 Final target URL: ${targetUrl}`)
    console.log(`📊 Method: ${method}`)
    let externalRes = await fetch(targetUrl, { method, headers, body })

    console.log(`🔁 externalRes.status = ${externalRes.status}`)

    if (externalRes.status === 401 && token.refreshToken) {
        console.log('⚠️ Access token expired, trying to refresh...')

        const newToken = await refreshToken(token)
        console.log('🔄 Refresh result:', newToken)

        if (newToken) {
            const res = NextResponse.next()
            res.cookies.set('token', JSON.stringify(newToken), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            })

            headers['Authorization'] = `Bearer ${newToken.accessToken}`
            console.log('🔁 Retrying original request...')
            externalRes = await fetch(targetUrl, { method, headers, body })
        } else {
            console.log('❌ Refresh failed')
            const resp = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            resp.cookies.delete('token')
            return resp
        }
    }

    const text = await externalRes.text()
    console.log('----/> ', text)
    return new NextResponse(text, { status: externalRes.status })
}


// ==== Routes =====
export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params
    const fullPath = path.join('/')
    const queryStr = req.nextUrl.search
    console.log('📥 GET Request Details:', {
        fullPath,
        queryStr,
        fullUrl: req.nextUrl.toString(),
        pathname: req.nextUrl.pathname
    })
    return proxyHandler(req, fullPath)
}
export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}
export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}
export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}
