'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink, Globe } from 'lucide-react'
import { deleteBookmark } from '@/app/actions'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Bookmark {
    id: string
    title: string
    url: string
    user_id: string
    created_at: string
}

export function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
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

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-card/50 rounded-lg border border-dashed">
                <Globe className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No bookmarks yet</p>
                <p className="text-sm">Add one above to get started!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
                {bookmarks.map((bookmark) => (
                    <motion.div
                        key={bookmark.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="h-full flex flex-col group hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-start justify-between gap-2">
                                    <CardTitle className="text-lg leading-tight line-clamp-2" title={bookmark.title}>{bookmark.title}</CardTitle>
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                                </a>
                            </CardHeader>
                            <CardContent className="pb-2 flex-1">
                                <p className="text-xs text-muted-foreground break-all line-clamp-2">{bookmark.url}</p>
                            </CardContent>
                            <CardFooter className="justify-end pt-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(bookmark.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
