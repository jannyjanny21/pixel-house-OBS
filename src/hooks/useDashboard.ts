import { useEffect, useMemo, useState } from "react";
import {
   getSalesByMonth,
   getSalesByYear,
   getTotalLifetimeSales,
} from "@/services/sales.service";
import { getAppointments } from "@/services/appointments.service";
import type { MonthlySalesDto } from "@/types/sales/MonthlySalesDto";
import type { YearlySalesDto } from "@/types/sales/YearlySalesDto";
import type { LifetimeSalesDto } from "@/types/sales/LifetimeSalesDto";
import type { GetAppointmentResponseDto } from "@/types/appointments/GetAppointmentResponseDto";
import { formatShortDate } from "@/lib/salesFormatters";
import type { GetPackageDto } from "@/types/packages/GetPackageDto";

const RECENT_BOOKINGS_LIMIT = 5;

export type DashboardBooking = {
   id: string;
   customer: string;
   package: GetPackageDto["type"][];
   date: string;
   status: GetAppointmentResponseDto["status"];
   amount: number;
};

type DashboardStats = {
   dailySales: number;
   monthlySales: number;
   yearlySales: number;
   pendingRequestsCount: number;
   totalLifetimeRevenue: number;
   totalBookings: number;
   recentBookings: DashboardBooking[];
};

type UseDashboardResult = DashboardStats & {
   isLoading: boolean;
   error: string | null;
   refetch: () => void;
};

const EMPTY_STATS: DashboardStats = {
   dailySales: 0,
   monthlySales: 0,
   yearlySales: 0,
   pendingRequestsCount: 0,
   totalLifetimeRevenue: 0,
   totalBookings: 0,
   recentBookings: [],
};

function isSameCalendarDay(isoDate: string, reference: Date): boolean {
   const date = new Date(isoDate);
   return (
      date.getFullYear() === reference.getFullYear() &&
      date.getMonth() === reference.getMonth() &&
      date.getDate() === reference.getDate()
   );
}

// ASSUMPTION: field names below (customerName, packageName, appointmentDate,
// totalAmount) are inferred from the mock Booking data. Update this mapping
// if your GetAppointmentResponseDto uses different property names.
function mapToDashboardBooking(
   appointment: GetAppointmentResponseDto,
): DashboardBooking {
   return {
      id: `#${appointment.id}`,
      customer: appointment.fullName,
      package: appointment.packages.map((pkg) => pkg.type),
      date: formatShortDate(new Date(appointment.preferredDate)),
      status: appointment.status,
      amount: appointment.totalPrice,
   };
}

export function useDashboard(): UseDashboardResult {
   const [monthlySales, setMonthlySales] = useState<MonthlySalesDto[]>([]);
   const [yearlySales, setYearlySales] = useState<YearlySalesDto[]>([]);
   const [lifetimeSales, setLifetimeSales] = useState<LifetimeSalesDto | null>(
      null,
   );
   const [appointments, setAppointments] = useState<
      GetAppointmentResponseDto[]
   >([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [refetchToken, setRefetchToken] = useState(0);

   useEffect(() => {
      let isCancelled = false;

      async function fetchDashboardData() {
         setIsLoading(true);
         setError(null);

         try {
            const [monthly, yearly, lifetime, appointmentList] =
               await Promise.all([
                  getSalesByMonth(),
                  getSalesByYear(),
                  getTotalLifetimeSales(),
                  getAppointments(),
               ]);

            if (!isCancelled) {
               setMonthlySales(monthly);
               setYearlySales(yearly);
               setLifetimeSales(lifetime);
               setAppointments(appointmentList);
            }
         } catch {
            if (!isCancelled) {
               setError(
                  "We couldn't load the dashboard right now. Please try again.",
               );
            }
         } finally {
            if (!isCancelled) {
               setIsLoading(false);
            }
         }
      }

      fetchDashboardData();

      return () => {
         isCancelled = true;
      };
   }, [refetchToken]);

   const stats = useMemo<DashboardStats>(() => {
      if (!lifetimeSales) {
         return EMPTY_STATS;
      }

      const now = new Date();

      const currentMonthEntry = monthlySales.find(
         (entry) =>
            entry.year === now.getFullYear() &&
            entry.month === now.getMonth() + 1,
      );

      const currentYearEntry = yearlySales.find(
         (entry) => entry.year === now.getFullYear(),
      );

      const dailySales = appointments
         .filter((appointment) =>
            isSameCalendarDay(appointment.preferredDate, now),
         )
         .reduce((sum, appointment) => sum + appointment.totalPrice, 0);

      const pendingRequestsCount = appointments.filter(
         (appointment) => appointment.status === "Pending",
      ).length;

      const recentBookings = [...appointments]
         .sort(
            (a, b) =>
               new Date(b.preferredDate).getTime() -
               new Date(a.preferredDate).getTime(),
         )
         .slice(0, RECENT_BOOKINGS_LIMIT)
         .map(mapToDashboardBooking);

      return {
         dailySales,
         monthlySales: currentMonthEntry?.totalSales ?? 0,
         yearlySales: currentYearEntry?.totalSales ?? 0,
         pendingRequestsCount,
         totalLifetimeRevenue: lifetimeSales.totalLifetimeRevenue,
         totalBookings: lifetimeSales.totalBookings,
         recentBookings,
      };
   }, [appointments, lifetimeSales, monthlySales, yearlySales]);

   function refetch() {
      setRefetchToken((prev) => prev + 1);
   }

   return {
      ...stats,
      isLoading,
      error,
      refetch,
   };
}
