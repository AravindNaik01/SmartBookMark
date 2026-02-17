# Smart Bookmark App

A professional, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google Authentication**: Secure sign-up and login without passwords.
- **Private Bookmarks**: Each user's data is isolated and secure using Row Level Security (RLS).
- **Real-time Sync**: Bookmarks update instantly across all open tabs and devices.
- **Responsive Design**: Beautiful UI with dark/light mode support (system default).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS v4
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
    Run the SQL commands in `supabase_schema.sql` (and `migrations/`) in your Supabase SQL Editor to create the table and policies.

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

### 1. Google OAuth Redirect to Dashboard
**Problem:** By default, Supabase Auth redirected users to the home page (`/`) after login, but the requirement was to land them on the dashboard.
**Solution:**
- Modified the authentication callback (`app/auth/callback/route.ts`) to default to `/dashboard` if no specific `next` parameter is provided.
- This ensures users are immediately taken to their protected area upon successful sign-in.

### 2. Preventing Duplicate Bookmarks
**Problem:** Users could accidentally save the same URL multiple times, cluttering their list.
**Solution:**
- Added a **unique constraint** in the PostgreSQL database on `(user_id, url)` and `(user_id, title)`.
- Updated the server action (`app/actions.ts`) to catch the specific Postgres error code `23505` (Foreign Key Violation).
- Retained a user-friendly error message ("You have already saved a bookmark with this title or URL") instead of crashing or showing a generic "Server Error".

### 3. Handling "Login Cancelled" UX
**Problem:** If a user started the Google login flow but clicked "Cancel" on the consent screen, Supabase would redirect them to a callback URL with `error=access_denied`. Without handling, this showed a blank screen or 404.
**Solution:**
- Implemented a `LoginResultHandler` client component that listens for `?error` query parameters.
- If an error is detected, it displays a toast notification explaining what happened and cleans up the URL, keeping the user on the home page instead of a broken error page.

### 4. Build Errors & Dependency Issues
**Problem:** The deployment to Vercel initially failed due to two issues:
1.  **Zod Version Conflict:** The project uses a newer/beta version of Zod where `.errors` was replaced by `.issues`.
2.  **Missing Dependency:** The UI library required `@radix-ui/react-slot` which wasn't explicitly installed.
**Solution:**
- Updated the error handling code to access `parsed.error.issues[0].message`.
- Explicitly installed the missing `@radix-ui/react-slot` package.

### 5. Security: Open Redirect Vulnerability
**Problem:** The login callback accepted a `next` parameter from the URL query string. A malicious actor could potentially craft a link like `myapp.com/auth/callback?next=//evil-site.com` to redirect users after login.
**Solution:**
- Added strict validation in the callback route to ensure the `next` path starts with `/` and does NOT start with `//` (protocol-relative URL).
- Any invalid redirect attempt defaults safely to `/dashboard`.

### 6. Real-time Sync across Tabs
**Problem:** Ensuring that adding a bookmark in one tab instantly updates another open tab without refreshing.
**Solution:**
- Leveraged Supabase's Realtime subscription model.
- The `BookmarkList` component subscribes to `postgres_changes` on the `bookmarks` table.
- When an `INSERT` or `DELETE` event occurs, the local React state is updated immediately, creating a seamless sync experience.

### 7. RLS Policies
To ensure privacy, I implemented strict RLS policies:
- `SELECT`, `INSERT`, `DELETE`: All restricted with `auth.uid() = user_id`.
- This guarantees that API requests cannot access another user's data.
