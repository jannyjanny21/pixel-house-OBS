import { useState, type SyntheticEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FaFacebookF, FaInstagram } from 'react-icons/fa6'
import HomeLayout from '@/layout/HomeLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactUs() {
   const [submitted, setSubmitted] = useState(false)

   function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
      event.preventDefault()
      setSubmitted(true)
      event.currentTarget.reset()
   }

   return (
      <HomeLayout>
         <main className="bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-7xl">
               <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#ff6b2d]">
                     Pixel House Studio
                  </p>

                  <h1 className="mt-3 text-4xl font-black tracking-tight text-[#1f3a60] sm:text-5xl">
                     Contact Us
                  </h1>

                  <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#ff6b2d]" />
               </div>

               <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                  <aside className="rounded-[24px] bg-[#203b62] p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)] sm:p-10">
                     <h2 className="text-3xl font-black">Get in touch</h2>

                     <p className="mt-4 leading-7 text-slate-300">
                        Have a question about our studio or photography sessions?
                        Send us a message and our team will get back to you.
                     </p>

                     <div className="mt-10 space-y-6">
                        <div className="flex items-start gap-4">
                           <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#ff9b72]" />
                           <div>
                              <p className="font-semibold">Visit our studio</p>
                              <p className="mt-1 text-sm leading-6 text-slate-300">
                                 Tomas Claudio Street, Bagsakan ni Edad,
                                 Dipolog City, ZDN
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <Mail className="h-5 w-5 shrink-0 text-[#ff9b72]" />
                           <div>
                              <p className="font-semibold">Email us</p>
                              <p className="mt-1 text-sm text-slate-300">
                                 Send us a message through this form
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center gap-4">
                           <Phone className="h-5 w-5 shrink-0 text-[#ff9b72]" />
                           <div>
                              <p className="font-semibold">Booking inquiries</p>
                              <p className="mt-1 text-sm text-slate-300">
                                 We respond as soon as possible
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="mt-12 border-t border-white/10 pt-6">
                        <p className="text-sm font-semibold text-slate-200">
                           Follow Pixel House Studio
                        </p>

                        <div className="mt-4 flex gap-3">
                           <a
                              href="https://www.facebook.com/PixelHousePolanco"
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Pixel House Studio on Facebook"
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#ff6b2d]"
                           >
                              <FaFacebookF className="h-5 w-5" />
                           </a>

                           <a
                              href="https://www.instagram.com/pixelhousestudioph/"
                              target="_blank"
                              rel="noreferrer"
                              aria-label="Pixel House Studio on Instagram"
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#ff6b2d]"
                           >
                              <FaInstagram className="h-5 w-5" />
                           </a>
                        </div>
                     </div>
                  </aside>

                  <section className="rounded-[24px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.1)] sm:p-10">
                     <form onSubmit={handleSubmit} className="space-y-6">
                        {submitted && (
                           <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                              Thank you for reaching out. We will get back to you soon.
                           </div>
                        )}

                        <div className="space-y-2">
                           <Label htmlFor="name">Name</Label>
                           <Input
                              id="name"
                              name="name"
                              placeholder="Your name"
                              required
                           />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="email">Email</Label>
                           <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@example.com"
                              required
                           />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="message">Message</Label>
                           <Textarea
                              id="message"
                              name="message"
                              placeholder="How can we help you?"
                              className="min-h-44 resize-none"
                              required
                           />
                        </div>

                        <Button
                           type="submit"
                           className="h-12 rounded-full bg-[#ff6b2d] px-7 font-bold text-white hover:bg-[#ff5a17]"
                        >
                           Send Message
                        </Button>
                     </form>
                  </section>
               </div>
            </section>
         </main>
      </HomeLayout>
   )
}