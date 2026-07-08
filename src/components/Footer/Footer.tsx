import { SocialIcon } from 'react-social-icons'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type QuickLink = {
   label: string
   href: string
}

type SocialLink = {
   label: string
   href: string
   url: string
   icon: ReactNode
}

const quickLinks: QuickLink[] = [
   { label: 'Home', href: '/' },
   { label: 'Book Now', href: '/book' },
   { label: 'Portfolio', href: '/#packages' },
   { label: 'Contact Us', href: '/contact' },
]

const socialLinks: SocialLink[] = [
   { label: 'Facebook', href: 'https://www.facebook.com/PixelHousePolanco', url: 'https://facebook.com', icon: <SocialIcon url="https://facebook.com" bgColor='transparent' /> },
   { label: 'Instagram', href: 'https://www.instagram.com/pixelhousestudioph/', url: 'https://instagram.com', icon: <SocialIcon url="https://instagram.com" bgColor='transparent' /> }
]

export default function Footer() {
   const currentYear = new Date().getFullYear()

   return (
      <footer className="bg-[#203b62] text-white">
         <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
               <div className="justify-items-center">
                  <h3 className="text-sm font-bold tracking-[0.14em] text-white">
                     PIXEL HOUSE STUDIO
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                     Capturing life's most precious moments with professional quality and creative vision.
                  </p>
               </div>

               <div className="justify-items-center">
                  <h3 className="text-sm font-bold tracking-[0.14em] text-white">
                     QUICK LINKS
                  </h3>
                  <ul className="mt-4 space-y-1">
                     {quickLinks.map((link) => (
                        <li key={link.label}>
                           <Link
                              to={link.href}
                              reloadDocument
                              className="text-sm text-slate-300 transition hover:text-white"
                           >
                              {link.label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>

               <div className="justify-items-center">
                  <h3 className="text-sm font-bold tracking-[0.14em] text-white">
                     LOCATION
                  </h3>
                  <div className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-300 px-10">
                     <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                     <span>Tomas Claudio Street, Bagsakan ni Edad, Dipolog City ZDN</span>
                  </div>
               </div>

               <div className="justify-items-center">
                  <h3 className="text-sm font-bold tracking-[0.14em] text-white">
                     CONNECT WITH US
                  </h3>
                  <div className="mt-4 flex items-center gap-3">
                     {socialLinks.map((social) => (
                        <SocialIcon
                           key={social.label}
                           url={social.url}
                           href={social.href}
                           target="_blank"
                           rel="noreferrer"
                           aria-label={social.label}
                           bgColor="rgba(255, 255, 255, 0.1)"
                           fgColor="currentColor"
                           style={{ width: 36, height: 36 }}
                           className="text-white transition hover:text-orange-400"
                        />
                     ))}
                  </div>
               </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-6 text-center">
               <p className="text-xs text-slate-400">
                  © {currentYear} Pixel House Studio. All rights reserved.
               </p>
               <p className="mt-1 text-xs text-slate-400">
                  Developed by:{' '}
                  <span className="font-semibold text-slate-300">JanjanGwapo</span>
               </p>
            </div>
         </div>
      </footer >
   )
}