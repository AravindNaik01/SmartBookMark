'use client'

import { addBookmark } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRef } from 'react'
import { Plus } from 'lucide-react'

export function AddBookmark() {
    const formRef = useRef<HTMLFormElement>(null)

    const clientAction = async (formData: FormData) => {
        const result = await addBookmark(formData)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Bookmark added!")
            formRef.current?.reset()
        }
    }

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-secondary/30">
            <CardContent className="pt-6">
                <form ref={formRef} action={clientAction} className="flex flex-col gap-4">
                    <h3 className="font-semibold text-lg">Add New Bookmark</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input name="title" placeholder="Title" required className="flex-1" />
                        <Input name="url" placeholder="https://example.com" type="url" required className="flex-[2]" />
                        <Button type="submit" size="icon" className="shrink-0">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
