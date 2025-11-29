// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Token } from "./../../../../lib/types"

type Params = {
    params: {
        path: string[]
    }
}



async function proxyHandler(req: NextRequest, path: string) {

    const token: Token = JSON.parse(req.cookies.get('token')?.value ?? '')

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    const externalRes = await fetch(targetUrl, { method, headers, body })

    if (externalRes.status === 401) {
        const resp = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        resp.cookies.delete('token')
        return resp
    }

    const text = await externalRes.text()

    // 👇 تبدیل Headers به Record<string,string>
    const responseHeaders: Record<string, string> = {}
    externalRes.headers.forEach((value, key) => {
        responseHeaders[key] = value
    })

    return new NextResponse(text, {
        status: externalRes.status,
        headers: responseHeaders,
    })
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params
    return proxyHandler(req, path.join('/'))
}

