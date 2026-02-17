import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BookmarkIcon, Star, Zap, Shield, ChevronDown } from 'lucide-react'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="relative overflow-hidden w-full h-[calc(100vh-64px)]">
      {/* Background Gradients (Fixed Full Screen) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-50" />

      {/* Scroll Container - fit to screen minus header height (approx 80px) */}
      <ScrollStack className="h-full w-full scroll-stack-container" itemDistance={120} itemStackDistance={20}>

        {/* Hero Section Card (First Item) */}
        <ScrollStackItem itemClassName="!bg-transparent !shadow-none !border-none !p-0 !h-auto !my-0">
          <div className="container mx-auto px-4 flex flex-col items-center text-center pt-0 min-h-[calc(100vh-100px)] relative">
            <div className="flex flex-col items-center gap-4 w-full max-w-none py-12">
              <h1 className="whitespace-nowrap text-4xl sm:text-6xl md:text-[8rem] font-bold font-serif text-gray-900 tracking-tighter leading-tight">
                Bookmark the web,
              </h1>
              <h1 className="whitespace-nowrap text-4xl sm:text-6xl md:text-[8rem] font-bold font-serif tracking-tighter leading-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 py-2">
                intelligent & simple.
              </h1>
            </div>

            <p className="max-w-3xl text-xl md:text-3xl text-gray-500 mb-12 leading-tight font-light tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Markly transforms how you save and organize links. <br className="hidden md:block" />
              A distraction-free experience built for pure speed.
            </p>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mb-12">
              {!user && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
                    Sign in with Google above to get started
                  </p>
                </div>
              )}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-gray-300">
              <ChevronDown className="w-10 h-10" />
            </div>
          </div>
        </ScrollStackItem>

        {/* Content Cards */}
        <ScrollStackItem itemClassName="bg-white border-indigo-100">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold font-serif text-gray-900">Uses</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              • Save articles for later reading without cluttering tabs.<br />
              • Organize research papers and documentation links.<br />
              • Keep track of shopping wishlists across sites.<br />
              • Maintain a curated list of design inspiration.
            </p>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-indigo-50 border-indigo-200">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-indigo-200 rounded-xl text-indigo-700">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold font-serif text-indigo-900">Importance</h2>
            </div>
            <p className="text-lg text-indigo-800 leading-relaxed">
              Information overload is real. By offloading links from your brain (and browser tabs) to a dedicated space, you reclaim mental clarity and browser performance. Never lose a valuable resource again.
            </p>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-gray-900 text-white border-gray-800">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gray-800 rounded-xl text-white">
                <Star className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold font-serif text-white">Why Markly?</h2>
            </div>
            <p className="text-lg text-gray-300 leading-relaxed">
              Most bookmark managers are bloated with social features or ads. Markly focuses purely on speed and simplicity. It's designed to be invisible until you need it, then instantly helpful when you do.
            </p>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-2xl">
          <div className="flex flex-col gap-4 h-full justify-center text-center">
            <h2 className="text-4xl font-bold font-serif text-white mb-4">How it works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-indigo-100 font-medium text-lg">
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">1</span>
                <span>Capture</span>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">2</span>
                <span>Curate</span>
              </div>
              <div className="h-12 w-px bg-white/20"></div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">3</span>
                <span>Rediscover</span>
              </div>
            </div>
            <p className="mt-8 text-indigo-200">Start building your library today.</p>
          </div>
        </ScrollStackItem>

      </ScrollStack>
    </div>
  )
}
