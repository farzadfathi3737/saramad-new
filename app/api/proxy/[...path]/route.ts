// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Token } from '@/lib/types'

type Params = {
    params: {
        path: string[]
    }
}

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

async function proxyHandlerOLD(req: NextRequest, path: string) {
    const tokenStr = req.cookies.get('token')?.value
    if (!tokenStr) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let token: Token
    try {
        token = JSON.parse(tokenStr)
    } catch {
        return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
    }
    console.log('Token:', token)
    const targetUrl = `${process.env.NEXT_PUBLIC_EXTERNAL_API}/${path}`

    const headers: Record<string, string> = {}
    req.headers.forEach((v, k) => {
        if (k !== 'host' && k !== 'cookie') headers[k] = v
    })
    headers['Authorization'] = `Bearer ${token.accessToken}`

    if (req.headers.get('content-type')) {
        headers['Content-Type'] = req.headers.get('content-type')!
    }

    const method = req.method || 'GET'
    const body =
        method === 'GET' || method === 'HEAD' ? undefined : await req.text()

    // ⛔ اولین درخواست
    let externalRes = await fetch(targetUrl, { method, headers, body })

    console.log("1-1");
    console.log(externalRes && token.refreshToken)
    // اگر توکن منقضی شده بود:
    if (externalRes.status === 401 && token.refreshToken) {
        const newToken = await refreshToken(token)
        if (newToken) {
            // کوکی جدید ذخیره شود
            const res = NextResponse.next()
            res.cookies.set('token', JSON.stringify(newToken), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            })

            // دوباره با accessToken جدید درخواست بده
            headers['Authorization'] = `Bearer ${newToken.accessToken}`
            externalRes = await fetch(targetUrl, { method, headers, body })
        } else {
            const resp = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            resp.cookies.delete('token')
            return resp
        }
    }

    const text = await externalRes.text()

    const responseHeaders: Record<string, string> = {}
    externalRes.headers.forEach((value, key) => {
        responseHeaders[key] = value
    })

    return new NextResponse(text, {
        status: externalRes.status,
        headers: responseHeaders,
    })
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

    console.log('✅ Current token:', token)

    const targetUrl = `${process.env.NEXT_PUBLIC_EXTERNAL_API}/${path}`
    const headers: Record<string, string> = {}

    req.headers.forEach((v, k) => {
        if (k !== 'host' && k !== 'cookie') headers[k] = v
    })
    headers['Authorization'] = `Bearer ${token.accessToken}`

    const method = req.method || 'GET'
    const body =
        method === 'GET' || method === 'HEAD' ? undefined : await req.text()

    console.log(`🌍 Calling external API: ${targetUrl}`)
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
    return new NextResponse(text, { status: externalRes.status })
}


// ==== Routes =====
export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
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
