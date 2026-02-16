"use client"

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface AuthButtonProps {
    user: any;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function AuthButton({ user, className, variant = "outline" }: AuthButtonProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return user ? (
        <Button variant={variant} onClick={handleLogout} className={className}>
            Sign Out <span className="ml-2 opacity-50 text-[10px]">→</span>
        </Button>
    ) : (
        <Button onClick={handleLogin}>
            Sign In with Google
        </Button>
    )
}
