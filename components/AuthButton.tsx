"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function AuthButton({ user }: { user: any }) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return user ? (
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden sm:inline-block">
                {user.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
                Sign Out
            </Button>
        </div>
    ) : (
        <Button onClick={handleLogin}>
            Sign In with Google
        </Button>
    )
}
