import { createClient } from "@/utils/supabase/server"
import { AuthButton } from "./AuthButton"
import Link from "next/link"
import { Bookmark } from "lucide-react"
import { SearchBar } from "./SearchBar"

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="w-full bg-white border-b border-gray-100 py-4">
            <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 group shrink-0">
                    <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors text-indigo-600">
                        <Bookmark className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-bold text-xl text-gray-900 font-serif tracking-tight">Markly</span>
                </Link>

                <div className="flex-1 flex justify-center mx-4">
                    <SearchBar />
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    {user && (
                        <span className="text-sm text-gray-500 font-medium hidden sm:block">
                            {user.email}
                        </span>
                    )}
                    <AuthButton user={user} className="text-gray-500 hover:text-gray-900 font-medium" variant="ghost" />
                </div>
            </div>
        </header>
    )
}
