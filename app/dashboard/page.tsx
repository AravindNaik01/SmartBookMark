import { createClient } from '@/utils/supabase/server'
import { BookmarkList } from '@/components/BookmarkList'
import { AddBookmark } from '@/components/AddBookmark'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('user_id', user.id)

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-10">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold font-serif text-gray-900">Your Bookmarks</h1>
                    <p className="text-lg text-gray-500">Save and organize your favorite links.</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <AddBookmark />
                </div>

                <div className="max-w-5xl mx-auto">
                    <Suspense fallback={<div>Loading...</div>}>
                        <BookmarkList initialBookmarks={bookmarks || []} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
