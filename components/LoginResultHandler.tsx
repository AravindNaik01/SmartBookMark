'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { toast } from 'sonner'

function LoginResultHandlerContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    useEffect(() => {
        if (error) {
            // Decode the error description if present, otherwise use a generic message
            const message = errorDescription
                ? decodeURIComponent(errorDescription.replace(/\+/g, ' '))
                : "Login failed or was cancelled."

            toast.error(message)

            // Optional: Clean up the URL
            const newUrl = new URL(window.location.href)
            newUrl.searchParams.delete('error')
            newUrl.searchParams.delete('error_description')
            newUrl.searchParams.delete('error_code')
            router.replace(newUrl.toString())
        }
    }, [error, errorDescription, router])

    return null
}

export function LoginResultHandler() {
    return (
        <Suspense fallback={null}>
            <LoginResultHandlerContent />
        </Suspense>
    )
}
