export async function apiFetch(url: string, options: RequestInit = {}) {
    const _url = url.replace('/cloud/', 'api/proxy/')
    const res = await fetch(_url, { ...options, credentials: 'include' })

    if (res.status === 401) {
        // redirect to login
        window.location.href = '/login'
        throw new Error('Unauthorized')
    }


    if (!res.ok) {
        let payload: any
        try { payload = await res.json() }
        catch { payload = { message: await res.text() } }
        throw new Error(payload?.error || payload?.message || 'Something went wrong')
    }


    //const contentType = res.headers.get('content-type') || ''
    //if (contentType.includes('application/json')) return res.json()

    return res;
}