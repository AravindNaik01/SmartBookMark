# Smart Bookmark App

A professional, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: Secure sign-up and login without passwords.
- **Private Bookmarks**: Each user's data is isolated and secure using Row Level Security (RLS).
- **Real-time Sync**: Bookmarks update instantly across all open tabs and devices.
- **Responsive Design**: Beautiful UI with dark/light mode support (system default).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Setup & Run Locally

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd smart-bookmark-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Database Setup**:
    Run the SQL commands in `supabase_schema.sql` in your Supabase SQL Editor to create the table and policies.

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy easily to Vercel:
1.  Push this code to a GitHub repository.
2.  Import the project in Vercel.
3.  Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in Vercel settings.
4.  Deploy!

## Implementation Details & Challenges

### Real-time Updates
One of the requirements was: *"Bookmark list updates in real-time without page refresh (if you open two tabs and add a bookmark in one, it should appear in the other)"*.

**Solution**:
I verified this using Supabase's Realtime functionality. By subscribing to `postgres_changes` on the `bookmarks` table in the client component, the app listens for `INSERT` and `DELETE` events. 
Since Row Level Security (RLS) is enabled, Supabase ensures that a user only receives events for *their own* data. This fulfills both the privacy requirement and the real-time syncing requirement.

### RLS Policies
To ensure privacy, I implemented strict RLS policies:
- `SELECT`, `INSERT`, `DELETE`: All restricted with `auth.uid() = user_id`.
This guarantees that API requests cannot access another user's data.
