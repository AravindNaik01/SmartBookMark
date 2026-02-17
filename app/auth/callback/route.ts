import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error) {
        return NextResponse.redirect(`${origin}?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || 'Authentication failed')}`)
    }

    if (code) {
        const supabase = await createClient()
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        if (!sessionError) {
            // Redirect to the intended page after successful login
            return NextResponse.redirect(`${origin}${next}`)
        }
        return NextResponse.redirect(`${origin}?error=SessionError&error_description=${encodeURIComponent(sessionError.message)}`)
    }

    // Return the user to the home page with a generic error if no code or error provided
    return NextResponse.redirect(`${origin}?error=NoCode&error_description=No+authentication+code+returned`)
}
