import AdminLayout from '@/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Booking {
   id: string
   customer: string
   package: string
   date: string
   status: 'Pending' | 'Confirmed'
   amount: string
}

const recentBookings: Booking[] = [
   {
      id: '#154',
      customer: 'NURAISA GACO',
      package: 'Trio',
      date: 'Jul 03, 2026',
      status: 'Pending',
      amount: '₱1,000.00'
   },
   {
      id: '#153',
      customer: 'Arth Erick Jay Layan',
      package: 'Trio',
      date: 'Jul 07, 2026',
      status: 'Pending',
      amount: '₱1,000.00'
   },
   {
      id: '#152',
      customer: 'Mary Claudine Kay Angcog',
      package: 'Trio',
      date: 'Jul 03, 2026',
      status: 'Confirmed',
      amount: '₱1,000.00'
   },
   {
      id: '#151',
      customer: 'Cristine M. Apilan',
      package: 'Solo',
      date: 'Jul 01, 2026',
      status: 'Confirmed',
      amount: '₱799.00'
   },
   {
      id: '#150',
      customer: 'ailene mae alberio',
      package: 'Professional Photographer',
      date: 'Jul 14, 2026',
      status: 'Pending',
      amount: '₱3,500.00'
   },
]

export default function Dashboard() {
   return (
      <AdminLayout>
         <div className="space-y-8">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {/* Daily Sales */}
               <div className="bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Daily Sales</p>
                        <p className="text-3xl font-bold mt-3">₱5,500.00</p>
                     </div>
                     <div className="text-4xl opacity-75">📅</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">Jul 03, 2026</p>
               </div>

               {/* Monthly Sales */}
               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Monthly Sales</p>
                        <p className="text-3xl font-bold mt-3">₱15,098.00</p>
                     </div>
                     <div className="text-4xl opacity-75">📊</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">July 2026</p>
               </div>

               {/* Yearly Sales */}
               <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Yearly Sales</p>
                        <p className="text-3xl font-bold mt-3">₱175,762.00</p>
                     </div>
                     <div className="text-4xl opacity-75">📈</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">2026</p>
               </div>

               {/* Pending Requests */}
               <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Pending Requests</p>
                        <p className="text-4xl font-bold mt-3">14</p>
                     </div>
                     <div className="text-4xl opacity-75">⏰</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">Action needed</p>
               </div>
            </div>

            {/* Total Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-800 text-white rounded-2xl p-8 flex items-center gap-6">
                  <div className="bg-white/10 p-4 rounded-xl">
                     💰
                  </div>
                  <div>
                     <p className="text-slate-400 text-sm">TOTAL LIFETIME REVENUE</p>
                     <p className="text-4xl font-bold mt-1">₱175,762.00</p>
                  </div>
               </div>

               <div className="bg-slate-800 text-white rounded-2xl p-8 flex items-center gap-6">
                  <div className="bg-white/10 p-4 rounded-xl">
                     📸
                  </div>
                  <div>
                     <p className="text-slate-400 text-sm">TOTAL BOOKINGS</p>
                     <p className="text-4xl font-bold mt-1">154</p>
                  </div>
               </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b px-8 py-5">
                  <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
                  <Button variant="outline" className="rounded-full">
                     View All
                  </Button>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead>
                        <tr className="border-b bg-slate-50 text-left text-sm text-slate-600">
                           <th className="px-8 py-4 font-medium">ID</th>
                           <th className="px-8 py-4 font-medium">Customer</th>
                           <th className="px-8 py-4 font-medium">Package</th>
                           <th className="px-8 py-4 font-medium">Date</th>
                           <th className="px-8 py-4 font-medium">Status</th>
                           <th className="px-8 py-4 font-medium text-right">Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y">
                        {recentBookings.map((booking) => (
                           <tr key={booking.id} className="hover:bg-slate-50 transition">
                              <td className="px-8 py-5 font-medium text-slate-900">{booking.id}</td>
                              <td className="px-8 py-5 text-slate-700">{booking.customer}</td>
                              <td className="px-8 py-5">
                                 <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                                    {booking.package}
                                 </span>
                              </td>
                              <td className="px-8 py-5 text-slate-600">{booking.date}</td>
                              <td className="px-8 py-5">
                                 <Badge
                                    variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}
                                    className={booking.status === 'Confirmed'
                                       ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                       : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                    }
                                 >
                                    {booking.status}
                                 </Badge>
                              </td>
                              <td className="px-8 py-5 text-right font-medium text-slate-900">
                                 {booking.amount}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </AdminLayout>
   )
}