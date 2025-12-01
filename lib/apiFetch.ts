export async function apiFetch(url: string, options: RequestInit = {}) {
    const _url = url.replace('/cloud/', 'api/proxy/')

    // اگر client-side است، کوکی ها اتوماتیک فرستاده می‌شود
    // اگر server-side است، نیازی به credentials نیست
    const fetchOptions: RequestInit = {
        ...options,
        // Client-side credentials
        ...(typeof window !== 'undefined' && { credentials: 'include' })
    }

    const res = await fetch(_url, fetchOptions)

    if (res.status === 401) {
        // تنها client-side redirect کنید
        if (typeof window !== 'undefined') {
            window.location.href = '/login'
        }
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
        let payload: { error?: string; message?: string } | null = null
        try { payload = await res.json() }
        catch { payload = { message: await res.text() } }
        throw new Error(payload?.error || payload?.message || 'Something went wrong')
    }

    return res;
}