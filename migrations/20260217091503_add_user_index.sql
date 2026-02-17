
-- Performance: Add an index on user_id and created_at
-- This matches the typical query pattern: SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created_at 
ON public.bookmarks (user_id, created_at DESC);
