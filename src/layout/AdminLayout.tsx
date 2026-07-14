import { useState, type ReactNode } from 'react'
import {
   LayoutDashboard,
   Calendar,
   BookOpen,
   BarChart3,
   KeyRound,
   LogOut,
   Menu,
   X
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import pixelHouseLogo from '@/assets/pixelhouselogo.jpg'

type ALProps = {
   children: ReactNode
}

const navItems = [
   {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      isActive: true
   },
   {
      label: 'Bookings',
      icon: BookOpen,
      href: '/admin/bookings'
   },
   {
      label: 'Calendar',
      icon: Calendar,
      href: '/admin/calendar'
   },
   {
      label: 'Reports',
      icon: BarChart3,
      href: '/admin/reports'
   },
   {
      label: 'Accounts',
      icon: KeyRound,
      href: '/admin/accounts'
   },
]

export default function AdminLayout({ children }: ALProps) {
   const navigate = useNavigate()
   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

   const handleLogout = () => {
      // TODO: Add logout logic here (clear tokens, etc.)
      navigate('/')
   }

   return (
      <div className="flex h-screen bg-slate-100 overflow-hidden">
         {/* Sidebar */}
         <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1e2a44] text-white transition-transform duration-300
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
            <div className="flex h-full flex-col">
               {/* Logo/Header */}
               <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                     <img
                        src={pixelHouseLogo}
                        alt="Pixel House Studio"
                        className="h-9 w-9 object-contain"
                     />
                  </div>
                  <div>
                     <div className="font-bold tracking-tight">Pixel House</div>
                     <div className="text-xs text-slate-400">Admin Panel</div>
                  </div>
               </div>

               {/* Navigation */}
               <nav className="flex-1 overflow-y-auto px-3 py-6">
                  <div className="space-y-1">
                     {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = item.isActive || window.location.pathname === item.href

                        return (
                           <a
                              key={item.label}
                              href={item.href}
                              onClick={() => setIsSidebarOpen(false)}
                              className={`
                      flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                      ${isActive
                                    ? 'bg-[#ff6b2d] text-white shadow-md'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                 }
                    `}
                           >
                              <Icon className="h-5 w-5" />
                              {item.label}
                           </a>
                        )
                     })}
                  </div>
               </nav>

               {/* Logout */}
               <div className="border-t border-white/10 p-4">
                  <Button
                     onClick={handleLogout}
                     variant="ghost"
                     className="w-full justify-start gap-3 text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                     <LogOut className="h-5 w-5" />
                     Logout
                  </Button>
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 border-b bg-white px-6 flex items-center justify-between shadow-sm z-40">
               <div className="flex items-center gap-4">
                  <button
                     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                     className="md:hidden text-slate-600 hover:text-slate-900"
                  >
                     {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>

                  <div className="font-semibold text-slate-800">
                     Dashboard
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  {/* You can add user avatar, notifications, etc. here */}
                  <div className="text-sm text-slate-500">
                     Welcome back, Admin
                  </div>
               </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6">
               {children}
            </main>
         </div>

         {/* Mobile Sidebar Backdrop */}
         {isSidebarOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-40 md:hidden"
               onClick={() => setIsSidebarOpen(false)}
            />
         )}
      </div>
   )
}