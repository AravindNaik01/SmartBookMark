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
        <Card className="border border-gray-200 shadow-sm bg-white rounded-xl overflow-hidden">
            <CardContent className="p-2 sm:p-3">
                <form ref={formRef} action={clientAction} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <Input
                            id="title"
                            name="title"
                            placeholder="Title"
                            required
                            className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-lg font-medium"
                        />
                    </div>
                    <div className="flex-[2]">
                        <Input
                            id="url"
                            name="url"
                            placeholder="https://example.com"
                            type="url"
                            required
                            className="h-12 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all rounded-lg font-medium"
                        />
                    </div>
                    <Button type="submit" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all hover:shadow hover:scale-[1.02]">
                        <Plus className="w-5 h-5 mr-2" />
                        <span>Add</span>
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
