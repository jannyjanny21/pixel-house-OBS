// HomeLayout.tsx
import type { ReactNode } from 'react'
import { User2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

type HomeLayoutProps = {
   children: ReactNode
}

const navItems = [
   { label: 'Home', href: '#home' },
   { label: 'Portfolio', href: '#packages' },
]

export default function HomeLayout({ children }: HomeLayoutProps) {
   const navigate = useNavigate()
   return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
         <header className="sticky top-0 z-50 border-b border-white/10 bg-[#203b62] text-white shadow-sm">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
               <a href="#home" className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white/10">
                     <img src="/favicon.svg" alt="Pixel House Studio" className="h-8 w-8" />
                  </span>
                  <span className="text-lg font-extrabold tracking-tight">
                     Pixel House Studio
                  </span>
               </a>

               <nav className="hidden items-center gap-8 md:flex">
                  {navItems.map((item) => (
                     <a
                        key={item.label}
                        href={item.href}
                        className="text-sm font-medium text-slate-200 transition hover:text-white"
                     >
                        {item.label}
                     </a>
                  ))}
               </nav>

               <div className="flex items-center gap-3">
                  <Button className="rounded-full bg-[#ff6b2d] px-5 font-semibold text-white hover:bg-[#ff5a17]">
                     Book Now
                  </Button>
                  <button
                     type="button"
                     onClick={() => navigate('/login')}
                     className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
                     aria-label="Account"
                  >
                     <User2 className="h-4 w-4" />
                  </button>
               </div>
            </div>
         </header>

         <main>{children}</main>
      </div>
   )
}