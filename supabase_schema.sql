-- Create bookmarks table
create table if not exists public.bookmarks (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  title text not null,
  url text not null,
  created_at timestamp with time zone not null default now(),
  constraint bookmarks_pkey primary key (id),
  constraint bookmarks_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint unique_user_bookmark_url unique (user_id, url),
  constraint unique_user_bookmark_title unique (user_id, title)
);

-- Enable RLS
alter table public.bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks" on public.bookmarks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks" on public.bookmarks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks" on public.bookmarks
  for delete
  using (auth.uid() = user_id);

-- Enable realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table public.bookmarks;
commit;
