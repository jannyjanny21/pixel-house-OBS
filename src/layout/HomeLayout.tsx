// HomeLayout.tsx
import { useState, type ReactNode } from 'react'
import { Menu, ShieldUser, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import Footer from '@/components/Footer/Footer.tsx'
import pixelHouseLogo from '@/assets/pixelhouselogo.jpg'
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from '@/components/ui/collapsible'

type HomeLayoutProps = {
   children: ReactNode
}

const navItems = [
   { label: 'Home', href: '/' },
   { label: 'Portfolio', href: '#packages' },
]

export default function HomeLayout({ children }: HomeLayoutProps) {
   const navigate = useNavigate()
   const [isMenuOpen, setIsMenuOpen] = useState(false)

   function handleNavigate(path: string) {
      setIsMenuOpen(false)
      navigate(path)
   }

   return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
         <header className="sticky top-0 z-50 border-b border-white/10 bg-[#203b62] text-white shadow-sm">
            <Collapsible open={isMenuOpen} onOpenChange={setIsMenuOpen}>
               <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                  <a href="#home" className="flex items-center gap-3">
                     <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-white/10">
                        <img
                           src={pixelHouseLogo}
                           alt="Pixel House Studio"
                           className="h-10 w-10 object-contain"
                        />
                     </span>
                     <span className="text-lg font-bold tracking-tight">
                        Pixel House Studio
                     </span>
                  </a>

                  <div className="hidden items-center gap-4 md:flex">
                     <nav className="flex items-center gap-6">
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

                     <Button className="rounded-full bg-[#ff6b2d] px-5 font-semibold text-white hover:bg-[#ff5a17]">
                        Book Now
                     </Button>

                     <button
                        type="button"
                        onClick={() => handleNavigate('/login')}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/15"
                        aria-label="Account"
                     >
                        <ShieldUser className="h-7 w-7" />
                     </button>
                  </div>

                  <CollapsibleTrigger className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 md:hidden">
                     {isMenuOpen ? (
                        <X className="h-5 w-5" />
                     ) : (
                        <Menu className="h-5 w-5" />
                     )}
                  </CollapsibleTrigger>
               </div>

               <CollapsibleContent className="md:hidden">
                  <nav className="flex flex-col items-center gap-1 border-t border-white/10 px-4 pb-6 pt-4">
                     {navItems.map((item) => (
                        <a
                           key={item.label}
                           href={item.href}
                           onClick={() => setIsMenuOpen(false)}
                           className="w-full rounded-md py-3 text-center text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-white"
                        >
                           {item.label}
                        </a>
                     ))}

                     <Button
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-2 w-full rounded-full bg-[#ff6b2d] font-semibold text-white hover:bg-[#ff5a17]"
                     >
                        Book Now
                     </Button>

                     <button
                        type="button"
                        onClick={() => handleNavigate('/login')}
                        className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/15"
                        aria-label="Account"
                     >
                        <ShieldUser className="h-7 w-7" />
                     </button>
                  </nav>
               </CollapsibleContent>
            </Collapsible>
         </header>

         <main>{children}</main>

         <Footer />
      </div>
   )
}