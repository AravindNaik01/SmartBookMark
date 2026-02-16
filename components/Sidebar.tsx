import { createClient } from "@/utils/supabase/server"
import { AuthButton } from "./AuthButton"
import Link from "next/link"
import { BookmarkIcon, Home, Star, Settings, ExternalLink } from "lucide-react"

export async function Sidebar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    return (
        <aside className="hidden lg:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <BookmarkIcon className="w-6 h-6" />
                    <span>SmartMark</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md bg-secondary/50 text-secondary-foreground">
                    <Home className="w-4 h-4" />
                    Home
                </Link>
                <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 cursor-not-allowed opacity-60">
                    <Star className="w-4 h-4" />
                    Favorites
                </div>
                <div className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 cursor-not-allowed opacity-60">
                    <Settings className="w-4 h-4" />
                    Settings
                </div>
            </nav>

            <div className="p-4 border-t bg-muted/20">
                <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Signed in as</p>
                    <p className="text-sm font-semibold truncate" title={user.email}>{user.email}</p>
                </div>
                <AuthButton user={user} variant="ghost" className="w-full justify-start pl-0 text-destructive hover:text-destructive hover:bg-destructive/10" />
            </div>
        </aside>
    )
}
