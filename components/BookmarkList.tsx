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
import { useSearchParams } from 'next/navigation'

interface Bookmark {
    id: string
    title: string
    url: string
    user_id: string
    created_at: string
}

export function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('q') || ""
    const supabase = createClient()

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setBookmarks((prev) => {
                        if (prev.find(b => b.id === payload.new.id)) return prev
                        return [payload.new as Bookmark, ...prev]
                    })
                } else if (payload.eventType === 'DELETE') {
                    setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    const handleDelete = async (id: string) => {
        const previous = bookmarks
        setBookmarks(bookmarks.filter(b => b.id !== id))

        const result = await deleteBookmark(id)
        if (result?.error) {
            setBookmarks(previous)
            toast.error(result.error)
        } else {
            toast.success("Bookmark deleted")
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
                                        <p className="text-sm text-gray-500 truncate font-medium">
                                            {new URL(bookmark.url).hostname}
                                        </p>
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
