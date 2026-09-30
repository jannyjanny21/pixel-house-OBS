import { useEffect, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, ImageOff, Sparkles } from 'lucide-react'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'
import { toImageSrc } from '@/lib/portfolioImage'
import type { GetPortfolioDto } from '@/types/portfolios/GetPortfolioDto'

const AUTOPLAY_MS = 4000

type PortfolioViewDialogProps = {
   open: boolean
   onOpenChange: (open: boolean) => void
   portfolio: GetPortfolioDto | null
}

export default function PortfolioViewDialog({
   open,
   onOpenChange,
   portfolio,
}: PortfolioViewDialogProps) {
   const [index, setIndex] = useState(0)
   const [isPaused, setIsPaused] = useState(false)

   const images = portfolio?.images ?? []
   const count = images.length

   // Start from the cover every time a portfolio is opened
   useEffect(() => {
      if (open) setIndex(0)
   }, [open, portfolio?.id])

   // Autoplay; restarts the timer after every slide change
   useEffect(() => {
      if (!open || count <= 1 || isPaused) return
      const timer = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
      return () => clearTimeout(timer)
   }, [open, index, count, isPaused])

   const goTo = (next: number) => setIndex((next + count) % count)

   const handleKeyDown = (event: KeyboardEvent) => {
      if (count <= 1) return
      if (event.key === 'ArrowLeft') goTo(index - 1)
      if (event.key === 'ArrowRight') goTo(index + 1)
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            onKeyDown={handleKeyDown}
            className="max-h-[92vh] gap-0 overflow-y-auto rounded-[24px] border-0 p-0 sm:max-w-3xl [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-black/50 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-black/70"
         >
            {portfolio && (
               <div>
                  {/* Slideshow */}
                  <div
                     className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950"
                     onMouseEnter={() => setIsPaused(true)}
                     onMouseLeave={() => setIsPaused(false)}
                  >
                     {count === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                           <ImageOff className="h-10 w-10" />
                           <p className="text-sm">No images for this portfolio yet.</p>
                        </div>
                     ) : (
                        images.map((image, i) => (
                           <img
                              key={image.id}
                              src={toImageSrc(image)}
                              alt={`${portfolio.title} — image ${i + 1}`}
                              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'
                                 }`}
                           />
                        ))
                     )}

                     {count > 1 && (
                        <>
                           <button
                              type="button"
                              onClick={() => goTo(index - 1)}
                              aria-label="Previous image"
                              className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-lg transition hover:bg-white"
                           >
                              <ChevronLeft className="h-5 w-5" />
                           </button>
                           <button
                              type="button"
                              onClick={() => goTo(index + 1)}
                              aria-label="Next image"
                              className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-slate-900 shadow-lg transition hover:bg-white"
                           >
                              <ChevronRight className="h-5 w-5" />
                           </button>

                           <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
                              {images.map((image, i) => (
                                 <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                                       }`}
                                 />
                              ))}
                           </div>

                           <div className="absolute left-3 top-3 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
                              {index + 1} / {count}
                           </div>
                        </>
                     )}
                  </div>

                  {/* Thumbnails */}
                  {count > 1 && (
                     <div className="flex gap-2 overflow-x-auto bg-slate-100 px-4 py-3">
                        {images.map((image, i) => (
                           <button
                              key={image.id}
                              type="button"
                              onClick={() => goTo(i)}
                              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === index
                                 ? 'border-[#ff6b2d]'
                                 : 'border-transparent opacity-60 hover:opacity-100'
                                 }`}
                           >
                              <img src={toImageSrc(image)} alt="" className="h-full w-full object-cover" />
                           </button>
                        ))}
                     </div>
                  )}

                  {/* Information */}
                  <DialogHeader className="space-y-3 p-6 text-left">
                     <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ff6b2d]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff6b2d]">
                        <Sparkles className="h-3.5 w-3.5" />
                        {portfolio.category}
                     </div>
                     <DialogTitle className="text-2xl font-black tracking-tight text-[#1f3a60]">
                        {portfolio.title}
                     </DialogTitle>
                     <DialogDescription className="text-sm leading-6 text-slate-600">
                        {portfolio.description ?? 'Studio portfolio collection'}
                     </DialogDescription>
                  </DialogHeader>
               </div>
            )}
         </DialogContent>
      </Dialog>
   )
}