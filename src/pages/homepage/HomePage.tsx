// HomePage.tsx
import {
   CheckCircle2,
   Camera,
   Users2,
   Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import HomeLayout from '@/layout/HomeLayout.tsx'

const packages = [
   {
      name: 'SOLO',
      price: '₱799',
      description: 'Self shoot solo session with professional editing',
      duration: '15 mins session',
      features: ['Unlimited edited photos', 'Online gallery'],
      people: 'Max 1 person',
   },
   {
      name: 'TRIO',
      price: '₱1,000',
      description: 'Self shoot 3-person group session',
      duration: '15 mins session',
      features: ['Unlimited edited photos', 'Online gallery'],
      people: 'Max 3 persons',
   },
   {
      name: 'FAMILY',
      price: '₱1,200',
      description: 'Self shoot 4–8 person group session',
      duration: '20 mins session',
      features: ['Unlimited edited photos', 'Online gallery'],
      people: 'Max 8 persons',
   },
]

export default function HomePage() {
   return (
      <HomeLayout>
         <section
            id="home"
            className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
         >
            <div className="relative overflow-hidden rounded-[20px] bg-[#304866] px-6 py-16 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] sm:px-10">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%),linear-gradient(135deg,rgba(16,24,40,0.35),rgba(18,36,58,0.78))]" />
               <div className="absolute -left-12 top-6 h-40 w-32 rotate-[-10deg] rounded-2xl border border-white/10 bg-white/10 opacity-60" />
               <div className="absolute right-6 top-0 h-28 w-40 rotate-[12deg] rounded-2xl border border-white/10 bg-white/10 opacity-50" />
               <div className="absolute bottom-0 left-1/2 h-24 w-56 -translate-x-1/2 rounded-full bg-[#ff6b2d]/20 blur-3xl" />

               <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100/90">
                     <Camera className="h-4 w-4" />
                     Pixel House Booking Studio
                  </div>

                  <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                     Capture Your Best Moments
                  </h1>

                  <p className="mt-5 max-w-3xl text-base leading-7 text-slate-100/85 sm:text-lg">
                     Professional photography services tailored for every occasion.
                     Create timeless memories with our expert team.
                  </p>

                  <div className="mt-8">
                     <Button className="h-14 rounded-full bg-[#ff6b2d] px-8 text-base font-bold text-white shadow-[0_12px_24px_rgba(255,107,45,0.35)] hover:bg-[#ff5a17]">
                        View Portfolio
                     </Button>
                  </div>
               </div>
            </div>
         </section>

         <section id="packages" className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8">
            <div className="text-center">
               <h2 className="text-3xl font-black tracking-tight text-[#1f3a60] sm:text-4xl">
                  Our Packages
               </h2>
               <p className="mt-3 text-sm text-slate-500 sm:text-base">
                  Choose the perfect package for your needs
               </p>
               <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#ff6b2d]" />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
               {packages.map((pkg) => (
                  <Card
                     key={pkg.name}
                     className="rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
                  >
                     <CardContent className="flex h-full flex-col p-6">
                        <div className="flex justify-center">
                           <span className="rounded-full border border-[#c9dafd] bg-[#f5f9ff] px-4 py-1 text-xs font-bold tracking-[0.2em] text-[#4577cc]">
                              {pkg.name}
                           </span>
                        </div>

                        <div className="mt-6 text-center">
                           <div className="text-sm font-semibold text-slate-500">₱</div>
                           <div className="text-5xl font-black tracking-tight text-slate-900">
                              {pkg.price.replace('₱', '')}
                           </div>
                           <p className="mt-4 text-sm text-slate-500">{pkg.description}</p>
                        </div>

                        <div className="mt-8 space-y-3 text-sm text-slate-700">
                           <div className="flex items-center gap-3">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>{pkg.duration}</span>
                           </div>
                           {pkg.features.map((feature) => (
                              <div key={feature} className="flex items-center gap-3">
                                 <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                 <span>{feature}</span>
                              </div>
                           ))}
                           <div className="flex items-center gap-3">
                              <Users2 className="h-4 w-4 text-cyan-500" />
                              <span>{pkg.people}</span>
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

            <div className="mt-12 flex justify-center">
               <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
                  <Star className="h-4 w-4 text-[#ff6b2d]" />
                  Trusted by clients for fast booking and smooth scheduling
               </div>
            </div>
         </section>
      </HomeLayout>
   )
}