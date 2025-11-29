'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')  // هدایت به صفحه لاگین
    }

    return (
        <button onClick={handleLogout} className="border px-3 py-1">
            Logout
        </button>
    )
}
