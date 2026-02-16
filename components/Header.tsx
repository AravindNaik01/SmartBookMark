import { createClient } from "@/utils/supabase/server"
import { AuthButton } from "./AuthButton"
import Link from "next/link"
import { Bookmark } from "lucide-react"
import { SearchBar } from "./SearchBar"
import PillNav from "./PillNav"

export async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 py-2 sticky top-0 z-[100]">
            <div className="container mx-auto px-4 max-w-7xl">
                <PillNav
                    user={user}
                    items={[
                        { label: 'Home', href: '/' },
                        ...(user ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
                    ]}
                />
            </div>
        </header>
    )
}
