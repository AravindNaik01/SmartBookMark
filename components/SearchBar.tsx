'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState, useEffect } from "react"

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [value, setValue] = useState(searchParams.get('q') || "")

    // Update local state immediately
    const handleChange = (val: string) => {
        setValue(val)
        updateUrl(val)
    }

    // Debounce the URL update
    const updateUrl = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        router.replace(`${pathname}?${params.toString()}`)
    }, [searchParams, router, pathname])

    return (
        <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
                placeholder="Search bookmarks..."
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus-visible:ring-indigo-500 transition-all font-medium"
            />
        </div>
    )
}
