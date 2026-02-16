import { createClient } from "@/utils/supabase/server"
import { AuthButton } from "./AuthButton"
import Link from "next/link"
import { BookmarkIcon } from "lucide-react"

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto h-16 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <BookmarkIcon className="w-6 h-6" />
                    <span>SmartMark</span>
                </Link>
                <AuthButton user={user} />
            </div>
        </header>
    )
}
