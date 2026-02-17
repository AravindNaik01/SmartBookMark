'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const bookmarkSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Must be a valid URL"),
})

export async function addBookmark(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const title = formData.get('title')
    const url = formData.get('url')

    const parsed = bookmarkSchema.safeParse({ title, url })

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message }
    }

    const { error } = await supabase
        .from('bookmarks')
        .insert({
            title: parsed.data.title,
            url: parsed.data.url,
            user_id: user.id,
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}
