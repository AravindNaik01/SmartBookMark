import { createClient } from '@/utils/supabase/server'
import { BookmarkList } from '@/components/BookmarkList'
import { AddBookmark } from '@/components/AddBookmark'

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            SmartMark
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
            The professional way to manage your links. <br />
            Secure, Real-time, and Beautiful.
          </p>
        </div>
        {/* The Header AuthButton handles login interaction */}
        <div className="p-4 rounded-lg bg-card border shadow-sm text-sm text-muted-foreground">
          <p>Sign in with Google to start bookmarking.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section className="max-w-2xl mx-auto">
        <AddBookmark />
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Your Bookmarks</h2>
          <span className="text-sm text-muted-foreground">{bookmarks.length} saved</span>
        </div>
        <BookmarkList initialBookmarks={bookmarks} />
      </section>
    </div>
  )
}
