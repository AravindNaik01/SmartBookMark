
-- Add a unique constraint on (user_id, url)
ALTER TABLE public.bookmarks
ADD CONSTRAINT unique_user_bookmark_url UNIQUE (user_id, url);

-- Add a unique constraint on (user_id, title)
ALTER TABLE public.bookmarks
ADD CONSTRAINT unique_user_bookmark_title UNIQUE (user_id, title);
