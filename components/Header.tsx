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
        <header className="w-full bg-white border-b border-gray-100 py-4">
            <div className="container mx-auto px-4 max-w-5xl">
                <PillNav
                    user={user}
                    items={[
                        { label: 'Home', href: '/' },
                        // Added dummy items just to show off the pill effect as requested
                        { label: 'About', href: '#' },
                    ]}
                />
            </div>
        </header>
    )
}
