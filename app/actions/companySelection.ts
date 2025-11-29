"use server"

import { cookies } from "next/headers"

export async function getSelection() {
    const cookieStore = cookies()
    const cookie = (await cookieStore).get("currentCompany")
    return cookie?.value || ""
}

export async function setSelection(value: string) {
    (await cookies()).set("currentCompany", value, {
        path: "/",
        maxAge: 60 * 60 * 24, // one day
        httpOnly: false,
    })
}