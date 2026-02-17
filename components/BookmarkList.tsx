'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, ExternalLink, Globe, Bookmark, Search } from 'lucide-react'
import { deleteBookmark } from '@/app/actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

interface Bookmark {
    id: string
    title: string
    url: string
    user_id: string
    created_at: string
}

export function BookmarkList({ initialBookmarks, userId }: { initialBookmarks: Bookmark[], userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const searchParams = useSearchParams()
    const router = useRouter()
    const searchQuery = searchParams.get('q') || ""
    const supabase = createClient()

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel(`user-bookmarks-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log('Realtime event received:', payload)
                    if (payload.eventType === 'INSERT') {
                        const newBookmark = payload.new as Bookmark
                        setBookmarks((prev) => {
                            if (prev.find(b => b.id === newBookmark.id)) return prev
                            return [newBookmark, ...prev]
                        })
                        router.refresh()
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                        router.refresh()
                    }
                }
            )
            .subscribe((status) => {
                console.log('Realtime status:', status)
            })

        return () => {
            console.log('Cleaning up subscription')
            supabase.removeChannel(channel)
        }
    }, [supabase, router, userId])

    const handleDelete = async (id: string) => {
        const previous = bookmarks
        setBookmarks(bookmarks.filter(b => b.id !== id))

        const result = await deleteBookmark(id)
        if (result?.error) {
            setBookmarks(previous)
            toast.error(result.error)
        } else {
            toast.success("Bookmark deleted")
            router.refresh()
        }
    }

    const filteredBookmarks = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gray-100 p-4 rounded-xl mb-4 text-gray-400">
                    <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">No bookmarks yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                    Add your first bookmark above to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredBookmarks.map((bookmark, index) => (
                        <motion.div
                            key={bookmark.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="flex items-center p-4 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md transition-shadow group">
                                {/* Icon */}
                                <div className="shrink-0 mr-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 mr-4">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group-hover:text-indigo-600 transition-colors"
                                    >
                                        <h3 className="text-base font-bold text-gray-900 truncate" title={bookmark.title}>
                                            {bookmark.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-gray-400 truncate font-medium">
                                                {new URL(bookmark.url).hostname}
                                            </p>
                                            <span className="text-[10px] text-gray-300">•</span>
                                            <p
                                                className="text-xs text-gray-400 whitespace-nowrap"
                                                suppressHydrationWarning={true}
                                            >
                                                {formatRelativeTime(bookmark.created_at)}
                                            </p>
                                        </div>
                                    </a>
                                </div>

                                {/* Actions */}
                                <div className="shrink-0 flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => handleDelete(bookmark.id)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredBookmarks.length === 0 && searchQuery && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                        <p>No bookmarks found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
}
