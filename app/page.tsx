import { createClient } from '@/utils/supabase/server'
import { BookmarkList } from '@/components/BookmarkList'
import { AddBookmark } from '@/components/AddBookmark'
import { Suspense } from 'react'

export default async function Home() {
  const supabase = await createClient()

  // Gracefully handle missing env vars or connection errors for initial render
  let user = null
  let bookmarks = []

  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u

    if (user) {
      const { data: b } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
      bookmarks = b || []
    }
  } catch (e) {
    console.error("Supabase connection error:", e)
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <div className="bg-indigo-50 p-6 rounded-full ring-1 ring-indigo-100 mb-4 animate-in fade-in zoom-in duration-700">
          <BookmarkIcon className="w-16 h-16 text-indigo-600 fill-current" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold font-serif text-gray-900 tracking-tight">
          Markly
        </h1>

        <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
          The elegant way to save and organize your internet. <br />
          Simple, fast, and beautiful.
        </p>

        <div className="pt-4">
          <div className="flex items-center gap-2 text-indigo-600 font-medium">
            <span>Sign in above to get started</span>
            <span className="animate-bounce">↑</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-serif text-gray-900">Your Bookmarks</h1>
        <p className="text-lg text-gray-500">Save and organize your favorite links.</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <AddBookmark />
      </div>

      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <BookmarkList initialBookmarks={bookmarks} />
        </Suspense>
      </div>
    </div>
  )
}

function BookmarkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}
