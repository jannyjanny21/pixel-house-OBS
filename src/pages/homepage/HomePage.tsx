// HomePage.tsx
import {
   CheckCircle2,
   Camera,
   Users2,
   Sparkles,
   ChevronDown,
   Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import HomeLayout from '@/layout/HomeLayout.tsx'
import { useState } from 'react'
import { usePackages } from '@/hooks/usePackages'
import {
   formatMaxPeople,
   formatPrice,
} from '@/lib/packageFormatters'

const stats = [
   { label: 'Sessions booked', value: '500+' },
   { label: 'Package sizes', value: '3' },
   { label: 'Minutes per shoot', value: '15–20' },
]

export default function HomePage() {
   const [showMore, setShowMore] = useState(false)
   const {
      isLoading,
      error,
      featuredPackage,
      compactPackages,
      morePackages,
      refetch,
   } = usePackages()

   return (
      <HomeLayout>
         <section
            id="home"
            className="mt-10 mb-10 shadow-xl/5 relative mx-auto max-w-7xl overflow-hidden px-4 py-16 text-center sm:px-6 lg:px-8"
         >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(69,119,204,0.14),transparent_90%),radial-gradient(circle_at_75%_70%,rgba(255,107,45,0.14),transparent_90%)]" />

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
               <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm">
                  <Camera className="h-4 w-4" />
                  Pixel House - Self Shoot Studio
               </div>

               <h1 className="text-4xl font-black tracking-tight text-[#1f3a60] sm:text-5xl">
                  Capture Your Best Moments
               </h1>

               <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                  Professional photography services tailored for every occasion. Create timeless memories with our expert team.
               </p>

               <div className="mt-8">
                  <Button className="h-14 rounded-full bg-[#ff6b2d] px-8 text-base font-bold text-white shadow-[0_12px_24px_rgba(255,107,45,0.35)] hover:bg-[#ff5a17]">
                     View Portfolio
                  </Button>
               </div>

               <div className="mt-12 flex items-center gap-8 sm:gap-12">
                  {stats.map((stat, index) => (
                     <div key={stat.label} className="flex items-center gap-8 sm:gap-12">
                        <div className="text-center">
                           <div className="text-2xl font-black tracking-tight text-[#1f3a60]">
                              {stat.value}
                           </div>
                           <div className="mt-1 text-xs text-slate-500">
                              {stat.label}
                           </div>
                        </div>
                        {index < stats.length - 1 && (
                           <div className="h-8 w-px bg-slate-200" />
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section id="packages" className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
            <div className="text-center">
               <h2 className="text-3xl font-black tracking-tight text-[#1f3a60] sm:text-4xl">
                  Choose Your Session
               </h2>
               <p className="mt-3 text-sm text-slate-500 sm:text-base">
                  Choose the perfect package for your needs
               </p>
               <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#ff6b2d]" />
            </div>

            {isLoading && (
               <div className="mt-16 flex flex-col items-center gap-3 text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin text-[#ff6b2d]" />
                  <p className="text-sm">Loading our packages...</p>
               </div>
            )}

            {!isLoading && error && (
               <div className="mt-16 flex flex-col items-center gap-4 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                  <button
                     type="button"
                     onClick={refetch}
                     className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-bold text-[#1f3a60] shadow-sm transition hover:shadow-md"
                  >
                     Try again
                  </button>
               </div>
            )}

            {!isLoading && !error && (
               <>
                  <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                     {featuredPackage && (
                        <Card className="flex rounded-[24px] border-0 bg-[#304866] text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                           <CardContent className="flex h-full w-full flex-col justify-between p-8">
                              <div>
                                 <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-bold tracking-[0.2em] text-slate-100">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    MOST POPULAR
                                 </div>

                                 <div className="mt-6">
                                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold tracking-[0.2em] text-slate-100">
                                       {featuredPackage.type}
                                    </span>
                                 </div>

                                 <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-sm font-semibold text-slate-300">₱</span>
                                    <span className="text-5xl font-black tracking-tight text-white">
                                       {formatPrice(featuredPackage.price)}
                                    </span>
                                 </div>
                                 <p className="mt-3 text-sm text-slate-300">
                                    {featuredPackage.description}
                                 </p>

                                 <div className="mt-6 space-y-3 text-sm text-slate-200">
                                    {/* <div className="flex items-center gap-3">
                                       <CalendarDays className="h-4 w-4 text-slate-300" />
                                       <span>{formatDuration(featuredPackage.durationMinutes)}</span>
                                    </div> */}
                                    {featuredPackage.inclusion.map((feature) => (
                                       <div key={feature} className="flex items-center gap-3">
                                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                          <span>{feature}</span>
                                       </div>
                                    ))}
                                    <div className="flex items-center gap-3">
                                       <Users2 className="h-4 w-4 text-cyan-300" />
                                       <span>{formatMaxPeople(featuredPackage.maxPersons)}</span>
                                    </div>
                                 </div>
                              </div>

                              <Button className="mt-8 h-12 rounded-full bg-white text-base font-bold text-[#304866] hover:bg-slate-100">
                                 Select Package
                              </Button>
                           </CardContent>
                        </Card>
                     )}

                     <div className="flex flex-col gap-6">
                        {compactPackages.map((pkg) => (
                           <Card
                              key={pkg.id}
                              className="flex flex-1 rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                           >
                              <CardContent className="flex h-full w-full flex-col justify-between p-6">
                                 <div>
                                    <div className="flex items-center justify-between">
                                       <span className="rounded-full border border-[#c9dafd] bg-[#f5f9ff] px-4 py-1 text-xs font-bold tracking-[0.2em] text-[#4577cc]">
                                          {pkg.type}
                                       </span>
                                       <div className="flex items-baseline gap-1">
                                          <span className="text-xs font-semibold text-slate-500">₱</span>
                                          <span className="text-2xl font-black tracking-tight text-slate-900">
                                             {formatPrice(pkg.price)}
                                          </span>
                                       </div>
                                    </div>

                                    <p className="mt-3 text-sm text-slate-500">
                                       {pkg.description}
                                    </p>

                                    <div className="mt-4 space-y-2 text-xs text-slate-600">
                                       {pkg.inclusion?.map((feature) => (
                                          <div key={feature} className="flex items-center gap-2">
                                             <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                             <span>{feature}</span>
                                          </div>
                                       ))}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
                                       {/* <div className="flex items-center gap-1.5">
                                          <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                                          <span>{formatDuration(pkg.durationMinutes)}</span>
                                       </div> */}
                                       <div className="flex items-center gap-1.5">
                                          <Users2 className="h-3.5 w-3.5 text-cyan-500" />
                                          <span>{formatMaxPeople(pkg.maxPersons)}</span>
                                       </div>
                                    </div>
                                 </div>

                                 <Button
                                    variant="outline"
                                    className="mt-4 h-10 rounded-full border-[#ff6b2d] text-sm font-bold text-[#ff6b2d] hover:bg-[#ff6b2d] hover:text-white"
                                 >
                                    Select Package
                                 </Button>
                              </CardContent>
                           </Card>
                        ))}
                     </div>
                  </div>

                  {morePackages.length > 0 && (
                     <>
                        <div
                           className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-in-out ${showMore ? 'grid-rows-[1fr] mt-6' : 'grid-rows-[0fr]'
                              }`}
                        >
                           <div className="min-h-0">
                              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                 {morePackages.map((pkg) => (
                                    <Card
                                       key={pkg.id}
                                       className="rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                                    >
                                       <CardContent className="flex h-full flex-col p-6">
                                          <div className="flex justify-center">
                                             <span className="rounded-full border border-[#c9dafd] bg-[#f5f9ff] px-4 py-1 text-xs font-bold tracking-[0.2em] text-[#4577cc]">
                                                {pkg.type}
                                             </span>
                                          </div>

                                          <div className="mt-6 text-center">
                                             <div className="text-sm font-semibold text-slate-500">₱</div>
                                             <div className="text-5xl font-black tracking-tight text-slate-900">
                                                {formatPrice(pkg.price)}
                                             </div>
                                             <p className="mt-4 text-sm text-slate-500">{pkg.description}</p>
                                          </div>

                                          <div className="mt-8 space-y-3 text-sm text-slate-700">
                                             {/* <div className="flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span>{formatDuration(pkg.durationMinutes)}</span>
                                             </div> */}
                                             {pkg.inclusion.map((feature) => (
                                                <div key={feature} className="flex items-center gap-3">
                                                   <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                   <span>{feature}</span>
                                                </div>
                                             ))}
                                             <div className="flex items-center gap-3">
                                                <Users2 className="h-4 w-4 text-cyan-500" />
                                                <span>{formatMaxPeople(pkg.maxPersons)}</span>
                                             </div>
                                          </div>

                                          <Button
                                             variant="outline"
                                             className="mt-8 h-12 rounded-full border-[#ff6b2d] text-base font-bold text-[#ff6b2d] hover:bg-[#ff6b2d] hover:text-white"
                                          >
                                             Select Package
                                          </Button>
                                       </CardContent>
                                    </Card>
                                 ))}
                              </div>
                           </div>
                        </div>

                        <div className="mt-10 flex justify-center">
                           <button
                              type="button"
                              onClick={() => setShowMore((prev) => !prev)}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#1f3a60] shadow-[0_8px_20px_rgba(15,23,42,0.08)] transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
                           >
                              {showMore ? 'Show fewer packages' : 'See more packages'}
                              <ChevronDown
                                 className={`h-4 w-4 transition-transform duration-300 ${showMore ? 'rotate-180' : ''
                                    }`}
                              />
                           </button>
                        </div>
                     </>
                  )}
               </>
            )}
         </section>
      </HomeLayout>
   )
}