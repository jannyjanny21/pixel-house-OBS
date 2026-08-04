import AdminLayout from '@/layout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDashboard } from "@/hooks/useDashboard"
import { formatCurrency, formatMonthYear, formatShortDate } from "@/lib/salesFormatters"
import { useNavigate } from "react-router-dom"


const STATUS_BADGE_CLASSES: Record<string, string> = {
   Confirmed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
   Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
   Cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
   Completed: "bg-slate-100 text-slate-700 hover:bg-slate-100",
};

const DEFAULT_BADGE_CLASS = "bg-slate-100 text-slate-700 hover:bg-slate-100";

function badgeClassForStatus(status: string): string {
   return STATUS_BADGE_CLASSES[status] ?? DEFAULT_BADGE_CLASS;
}



export default function Dashboard() {
   const navigate = useNavigate();
   const {
      dailySales,
      monthlySales,
      yearlySales,
      pendingRequestsCount,
      totalLifetimeRevenue,
      totalBookings,
      recentBookings,
      isLoading,
      error,
      refetch,
   } = useDashboard();

   const now = new Date();

   if (isLoading) {
      return (
         <AdminLayout>
            <div className="flex h-64 items-center justify-center text-slate-500">
               Loading dashboard...
            </div>
         </AdminLayout>
      );
   }

   if (error) {
      return (
         <AdminLayout>
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-slate-500">
               <p>{error}</p>
               <Button variant="outline" onClick={refetch}>
                  Try Again
               </Button>
            </div>
         </AdminLayout>
      );
   }



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
                        <p className="text-3xl font-bold mt-3">
                           {formatCurrency(dailySales)}
                        </p>
                     </div>
                     <div className="text-4xl opacity-75">📅</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">{formatShortDate(now)}</p>
               </div>

               {/* Monthly Sales */}
               <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Monthly Sales</p>
                        <p className="text-3xl font-bold mt-3">
                           {formatCurrency(monthlySales)}
                        </p>
                     </div>
                     <div className="text-4xl opacity-75">📊</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">{formatMonthYear(now)}</p>
               </div>

               {/* Yearly Sales */}
               <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Yearly Sales</p>
                        <p className="text-3xl font-bold mt-3">
                           {formatCurrency(yearlySales)}
                        </p>
                     </div>
                     <div className="text-4xl opacity-75">📈</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">{now.getFullYear()}</p>
               </div>

               {/* Pending Requests */}
               <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-sm font-medium opacity-90">Pending Requests</p>
                        <p className="text-4xl font-bold mt-3">{pendingRequestsCount}</p>
                     </div>
                     <div className="text-4xl opacity-75">⏰</div>
                  </div>
                  <p className="text-sm mt-4 opacity-90">Action needed</p>
               </div>
            </div>

            {/* Total Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-800 text-white rounded-2xl p-8 flex items-center gap-6">
                  <div className="bg-white/10 p-4 rounded-xl">💰</div>
                  <div>
                     <p className="text-slate-400 text-sm">TOTAL LIFETIME REVENUE</p>
                     <p className="text-4xl font-bold mt-1">
                        {formatCurrency(totalLifetimeRevenue)}
                     </p>
                  </div>
               </div>

               <div className="bg-slate-800 text-white rounded-2xl p-8 flex items-center gap-6">
                  <div className="bg-white/10 p-4 rounded-xl">📸</div>
                  <div>
                     <p className="text-slate-400 text-sm">TOTAL CONFIRMED BOOKINGS</p>
                     <p className="text-4xl font-bold mt-1">{totalBookings}</p>
                  </div>
               </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
               <div className="flex items-center justify-between border-b px-8 py-5">
                  <h2 className="text-xl font-semibold text-slate-900">Recent Bookings</h2>
                  <Button variant="outline" className="rounded-full" onClick={() => navigate("/admin/bookings")}>
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
                        {recentBookings.length === 0 ? (
                           <tr>
                              <td
                                 colSpan={6}
                                 className="px-8 py-8 text-center text-slate-500"
                              >
                                 No recent bookings found.
                              </td>
                           </tr>
                        ) : (
                           recentBookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-slate-50 transition">
                                 <td className="px-8 py-5 font-medium text-slate-900">
                                    {booking.id}
                                 </td>
                                 <td className="px-8 py-5 text-slate-700 font-semibold">
                                    {booking.customer}
                                 </td>
                                 <td className="px-8 py-5">
                                    <div className="flex flex-wrap gap-2">
                                       {booking.package.map((pkg, index) => (
                                          <span
                                             key={index}
                                             className="inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 italic"
                                          >
                                             {pkg}
                                          </span>
                                       ))}
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-slate-600">{booking.date}</td>
                                 <td className="px-8 py-5">
                                    <Badge className={badgeClassForStatus(booking.status)}>
                                       {booking.status}
                                    </Badge>
                                 </td>
                                 <td className="px-8 py-5 text-right font-medium text-slate-900">
                                    {formatCurrency(booking.amount)}
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </AdminLayout>
   );
}