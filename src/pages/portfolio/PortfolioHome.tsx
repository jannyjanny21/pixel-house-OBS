import { ArrowRight, Camera, Eye, Images, Sparkles } from 'lucide-react'
import { useState } from 'react'
import PortfolioViewDialog from '@/components/portfolio/PortfolioViewDialog'
import type { GetPortfolioDto } from '@/types/portfolios/GetPortfolioDto'
import { useNavigate } from 'react-router-dom'
import HomeLayout from '@/layout/HomeLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import heroBanner from '@/assets/hero.png'
import { usePortfolios } from '@/hooks/usePortfolios'
import { toImageSrc } from '@/lib/portfolioImage'


const accentClasses = [
   'from-slate-950/85 via-slate-950/35 to-transparent',
   'from-cyan-950/85 via-cyan-900/35 to-transparent',
   'from-orange-950/85 via-orange-900/30 to-transparent',
   'from-amber-950/85 via-amber-900/30 to-transparent',
   'from-fuchsia-950/85 via-fuchsia-900/30 to-transparent',
]

export default function PortfolioHome() {
   const navigate = useNavigate()
   const { portfolios, isLoading, error } = usePortfolios()
   const [viewTarget, setViewTarget] = useState<GetPortfolioDto | null>(null)
   const [isViewOpen, setIsViewOpen] = useState(false)

   const openView = (portfolio: GetPortfolioDto) => {
      setViewTarget(portfolio)
      setIsViewOpen(true)
   }

   return (
      <HomeLayout>
         <main className="bg-slate-100">
            <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
               <div className="relative overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                  <div className="absolute inset-0">
                     <img
                        src={heroBanner}
                        alt="Portfolio banner"
                        className="h-full w-full object-cover"
                     />
                     <div className="absolute inset-0 bg-[#203b62]/75" />
                  </div>

                  <div className="relative flex min-h-[260px] flex-col items-center justify-center px-6 py-16 text-center text-white sm:min-h-[300px]">
                     <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] backdrop-blur-sm">
                        <Camera className="h-4 w-4" />
                        Portfolio
                     </div>
                     <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        Our Portfolio
                     </h1>
                     <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                        A collection of our best moments captured in time.
                     </p>
                  </div>
               </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
               <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                     <h2 className="mt-2 text-2xl font-black tracking-tight text-[#1f3a60] sm:text-3xl">
                        Featured Collections
                     </h2>
                  </div>

                  <Button
                     onClick={() => navigate('/book-appointments')}
                     className="rounded-full bg-[#ff6b2d] px-5 font-semibold text-white hover:bg-[#ff5a17]"
                  >
                     Book Now
                     <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </div>

               {isLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {Array.from({ length: 6 }).map((_, index) => (
                        <Card
                           key={index}
                           className="h-[420px] animate-pulse rounded-[24px] border-0 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]"
                        />
                     ))}
                  </div>
               ) : error ? (
                  <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700">
                     {error}
                  </div>
               ) : portfolios.length === 0 ? (
                  <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-600 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
                     No portfolios found.
                  </div>
               ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     {portfolios.map((portfolio, index) => {
                        const cover = portfolio.images[0]

                        return (
                           <Card
                              key={portfolio.id}
                              className="group overflow-hidden rounded-[24px] border-0 bg-white p-0 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(15,23,42,0.16)]"
                           >
                              <div className="relative aspect-[4/5] overflow-hidden">
                                 <img
                                    src={cover ? toImageSrc(cover) : '/portfolio/fallback.jpg'}
                                    alt={portfolio.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:blur-[2px] group-focus-within:scale-110 group-focus-within:blur-[2px]"
                                 />

                                 {/* Accent gradient — fades out on hover */}
                                 <div
                                    className={`absolute inset-0 bg-gradient-to-t ${accentClasses[index % accentClasses.length]} opacity-90 transition duration-300 group-hover:opacity-0 group-focus-within:opacity-0`}
                                 />

                                 {/* Dark veil — fades in on hover */}
                                 <div className="absolute inset-0 bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/55 group-focus-within:bg-slate-950/55" />

                                 {portfolio.images.length > 1 && (
                                    <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md transition duration-300 group-hover:opacity-0 group-focus-within:opacity-0">
                                       <Images className="h-3.5 w-3.5" />
                                       {portfolio.images.length}
                                    </div>
                                 )}

                                 {/* Text — slides down and disappears on hover */}
                                 <div className="absolute inset-x-0 bottom-0 p-5 text-white transition duration-300 group-hover:translate-y-4 group-hover:opacity-0 group-focus-within:translate-y-4 group-focus-within:opacity-0">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md">
                                       <Sparkles className="h-3.5 w-3.5" />
                                       {portfolio.category}
                                    </div>

                                    <h3 className="text-xl font-extrabold tracking-tight">
                                       {portfolio.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-white/85">
                                       {portfolio.description ?? 'Studio portfolio collection'}
                                    </p>
                                 </div>

                                 {/* View button — appears in the center on hover */}
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <Button
                                       onClick={() => openView(portfolio)}
                                       className="translate-y-3 scale-95 rounded-full bg-white px-6 font-semibold text-[#1f3a60] opacity-0 shadow-xl transition duration-300 hover:bg-[#ff6b2d] hover:text-white group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:scale-100 focus-visible:opacity-100"
                                    >
                                       <Eye className="mr-2 h-4 w-4" />
                                       View
                                    </Button>
                                 </div>
                              </div>
                           </Card>
                        )
                     })}
                  </div>
               )}
            </section>
            <PortfolioViewDialog
               open={isViewOpen}
               onOpenChange={setIsViewOpen}
               portfolio={viewTarget}
            />
         </main>
      </HomeLayout>
   )
}