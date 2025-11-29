import { NextResponse } from 'next/server'


export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body

    const externalRes = await fetch(`${process.env.NEXT_PUBLIC_EXTERNAL_API}/api/Membership/User/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })


    const result = await externalRes.json()


    if (!externalRes.ok) {
        return NextResponse.json({ error: result?.message || 'Login failed' }, { status: externalRes.status })
    }

    const token = JSON.stringify(result.token);

    console.log(token);
    if (!token) {
        return NextResponse.json({ error: 'No token from external service' }, { status: 500 })
    }

    const res = NextResponse.json({ message: 'ok' })
    res.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 // 1 hour — تنظیم بر اساس نیاز
    })


    return res
}