import { useEffect, useMemo, useState } from "react"
import {
   AlertCircle,
   ArrowDown,
   ArrowUp,
   ArrowUpDown,
   Check,
   Clock3,
   Loader2,
   Mail,
   Phone,
   RefreshCw,
   Trash2,
   X,
} from "lucide-react";
import AdminLayout from "@/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
   Alert,
   AlertDescription,
   AlertTitle,
} from "@/components/ui/alert";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination"
import {
   deleteAppointment,
   getAppointments,
   updateAppointmentStatus,
} from "@/services/appointments.service"
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { GetAppointmentResponseDto } from "@/types/appointments/GetAppointmentResponseDto"
import { formatCurrency, formatShortDate } from "@/lib/salesFormatters"

const ITEMS_PER_PAGE = 8;

const STATUS_STYLES: Record<
   string,
   { label: string; className: string }
> = {
   pending: {
      label: "Pending",
      className:
         "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
   },
   confirmed: {
      label: "Confirmed",
      className:
         "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
   },
   rejected: {
      label: "Rejected",
      className:
         "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50",
   },
   cancelled: {
      label: "Cancelled",
      className:
         "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100",
   },
};

type ActionMessage =
   | {
      type: "success" | "error";
      text: string;
   }
   | null;

type SortKey =
   | "bookingType"
   | "package"
   | "preferredDate"
   | "status"
   | "totalPrice"
   | "serviceType";

type SortDirection = "asc" | "desc";

type SortConfig = {
   key: SortKey;
   direction: SortDirection;
} | null;

function normalizeStatus(status: string): string {
   return status.trim().toLowerCase();
}

function getStatusMeta(status: string) {
   return (
      STATUS_STYLES[normalizeStatus(status)] ?? {
         label: status,
         className:
            "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100",
      }
   );
}

function formatDisplayTime(timeValue: string): string {
   const trimmed = timeValue.trim();

   if (!trimmed) return "—";

   if (/[ap]m$/i.test(trimmed)) {
      return trimmed.toUpperCase();
   }

   const [hourPartRaw = "0", minutePartRaw = "0"] = trimmed.split(":");
   const hourPart = Number(hourPartRaw);
   const minutePart = Number(minutePartRaw);

   if (Number.isNaN(hourPart) || Number.isNaN(minutePart)) {
      return trimmed;
   }

   const period = hourPart >= 12 ? "PM" : "AM";
   const hour12 = hourPart % 12 || 12;
   const paddedMinute = String(minutePart).padStart(2, "0");

   return `${hour12}:${paddedMinute} ${period}`;
}

/**
 * Converts a preferredTime string (either "HH:mm" 24-hour format or
 * "h:mm AM/PM") into minutes-since-midnight so it can be combined with a
 * calendar date for accurate chronological sorting.
 */
function parseTimeToMinutes(timeValue: string): number {
   const trimmed = timeValue.trim();

   if (!trimmed) return 0;

   const meridiemMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);

   if (meridiemMatch) {
      const [, hourRaw, minuteRaw, meridiem] = meridiemMatch;
      let hour = Number(hourRaw) % 12;
      const minute = Number(minuteRaw);

      if (meridiem.toLowerCase() === "pm") {
         hour += 12;
      }

      return hour * 60 + minute;
   }

   const [hourPartRaw = "0", minutePartRaw = "0"] = trimmed.split(":");
   const hourPart = Number(hourPartRaw);
   const minutePart = Number(minutePartRaw);

   if (Number.isNaN(hourPart) || Number.isNaN(minutePart)) {
      return 0;
   }

   return hourPart * 60 + minutePart;
}

/**
 * Resolves the comparable "natural" ordering between two appointments for a
 * given sort key. Always returns ascending order (a - b style); callers flip
 * the sign for descending order.
 */
function compareAppointments(
   a: GetAppointmentResponseDto,
   b: GetAppointmentResponseDto,
   key: SortKey,
): number {
   switch (key) {
      case "bookingType": {
         return (a.bookingType ?? "")
            .toLowerCase()
            .localeCompare((b.bookingType ?? "").toLowerCase());
      }

      case "package": {
         const aPackage = a.packages?.[0]?.type?.toLowerCase() ?? "";
         const bPackage = b.packages?.[0]?.type?.toLowerCase() ?? "";
         return aPackage.localeCompare(bPackage);
      }

      case "preferredDate": {
         const aTimestamp =
            new Date(a.preferredDate).getTime() +
            parseTimeToMinutes(a.preferredTime) * 60_000;
         const bTimestamp =
            new Date(b.preferredDate).getTime() +
            parseTimeToMinutes(b.preferredTime) * 60_000;
         return aTimestamp - bTimestamp;
      }

      case "status": {
         return normalizeStatus(a.status).localeCompare(
            normalizeStatus(b.status),
         );
      }

      case "totalPrice": {
         return (a.totalPrice ?? 0) - (b.totalPrice ?? 0);
      }

      case "serviceType": {
         const aService = (a.serviceType || "Studio").toLowerCase();
         const bService = (b.serviceType || "Studio").toLowerCase();
         return aService.localeCompare(bService);
      }

      default: {
         return 0;
      }
   }
}

function getPageItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
   if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
   }

   const items: Array<number | "ellipsis"> = [1];

   const leftSibling = Math.max(2, currentPage - 1);
   const rightSibling = Math.min(totalPages - 1, currentPage + 1);

   if (leftSibling > 2) {
      items.push("ellipsis");
   }

   for (let page = leftSibling; page <= rightSibling; page += 1) {
      items.push(page);
   }

   if (rightSibling < totalPages - 1) {
      items.push("ellipsis");
   }

   items.push(totalPages);

   return items;
}

function SortIndicator({
   isActive,
   direction,
}: {
   isActive: boolean;
   direction: SortDirection;
}) {
   if (!isActive) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />;
   }

   return direction === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-slate-700" />
   ) : (
      <ArrowDown className="h-3.5 w-3.5 text-slate-700" />
   );
}

function SortableHeaderButton({
   label,
   sortKey,
   sortConfig,
   onSort,
   align = "start",
}: {
   label: string;
   sortKey: SortKey;
   sortConfig: SortConfig;
   onSort: (key: SortKey) => void;
   align?: "start" | "end";
}) {
   const isActive = sortConfig?.key === sortKey;

   return (
      <button
         type="button"
         onClick={() => onSort(sortKey)}
         className={`inline-flex items-center gap-1.5 font-semibold text-slate-600 transition hover:text-slate-900 ${align === "end" ? "w-full justify-end" : ""
            }`}
      >
         {label}
         <SortIndicator
            isActive={isActive}
            direction={isActive ? sortConfig!.direction : "asc"}
         />
      </button>
   );
}

export default function Booking() {
   const [appointments, setAppointments] = useState<GetAppointmentResponseDto[]>(
      [],
   );
   const [isLoading, setIsLoading] = useState(true);
   const [isRefreshing, setIsRefreshing] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [message, setMessage] = useState<ActionMessage>(null);
   const [refreshToken, setRefreshToken] = useState(0);
   const [currentPage, setCurrentPage] = useState(1);
   const [sortConfig, setSortConfig] = useState<SortConfig>(null);
   const [busyAppointmentId, setBusyAppointmentId] = useState<number | null>(
      null,
   );
   const [busyAction, setBusyAction] = useState<
      "confirm" | "reject" | "delete" | null
   >(null);

   useEffect(() => {
      let isCancelled = false;

      async function loadAppointments() {
         if (appointments.length === 0) {
            setIsLoading(true);
         } else {
            setIsRefreshing(true);
         }

         setError(null);

         try {
            const result = await getAppointments();

            if (!isCancelled) {
               setAppointments(result);
               setMessage(null);
            }
         } catch {
            if (!isCancelled) {
               setError("We couldn't load bookings right now. Please try again.");
            }
         } finally {
            if (!isCancelled) {
               setIsLoading(false);
               setIsRefreshing(false);
            }
         }
      }

      loadAppointments();

      return () => {
         isCancelled = true;
      };
   }, [refreshToken]);

   const sortedAppointments = useMemo(() => {
      if (!sortConfig) return appointments;

      const directionMultiplier = sortConfig.direction === "asc" ? 1 : -1;

      return [...appointments].sort(
         (a, b) => compareAppointments(a, b, sortConfig.key) * directionMultiplier,
      );
   }, [appointments, sortConfig]);

   const totalPages = Math.max(
      1,
      Math.ceil(sortedAppointments.length / ITEMS_PER_PAGE),
   );

   useEffect(() => {
      if (currentPage > totalPages) {
         setCurrentPage(totalPages);
      }
   }, [currentPage, totalPages]);

   const pageAppointments = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      return sortedAppointments.slice(start, start + ITEMS_PER_PAGE);
   }, [currentPage, sortedAppointments]);

   const counts = useMemo(() => {
      const pending = appointments.filter(
         (appointment) => normalizeStatus(appointment.status) === "pending",
      ).length;
      const confirmed = appointments.filter(
         (appointment) => normalizeStatus(appointment.status) === "confirmed",
      ).length;
      const rejected = appointments.filter((appointment) => {
         const status = normalizeStatus(appointment.status);
         return status === "rejected" || status === "cancelled";
      }).length;

      return {
         total: appointments.length,
         pending,
         confirmed,
         rejected,
      };
   }, [appointments]);

   async function refetch() {
      setRefreshToken((current) => current + 1);
   }

   function handleSort(key: SortKey) {
      setSortConfig((current) => {
         if (current?.key === key) {
            return {
               key,
               direction: current.direction === "asc" ? "desc" : "asc",
            };
         }

         return { key, direction: "asc" };
      });

      setCurrentPage(1);
   }

   function handleResetSort() {
      setSortConfig(null);
      setCurrentPage(1);
   }

   async function handleStatusUpdate(
      appointmentId: number,
      statusLabel: "confirm" | "reject",
   ) {
      setBusyAppointmentId(appointmentId);
      setBusyAction(statusLabel);
      setError(null);
      setMessage(null);

      try {
         await updateAppointmentStatus(appointmentId, {
            status: statusLabel === "confirm" ? 1 : 2,
         });

         setMessage({
            type: "success",
            text:
               statusLabel === "confirm"
                  ? "Booking marked as confirmed."
                  : "Booking marked as rejected.",
         });

         await refetch();
      } catch {
         setError("Unable to update this booking. Please try again.");
      } finally {
         setBusyAppointmentId(null);
         setBusyAction(null);
      }
   }

   // --- state additions (alongside your existing busyAppointmentId/busyAction/error/message state) ---
   const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

   function openDeleteDialog(appointmentId: number) {
      setPendingDeleteId(appointmentId);
   }

   function closeDeleteDialog() {
      setPendingDeleteId(null);
   }

   async function handleDelete(appointmentId: number) {
      setBusyAppointmentId(appointmentId);
      setBusyAction("delete");
      setError(null);
      setMessage(null);

      try {
         await deleteAppointment(appointmentId);

         setMessage({
            type: "success",
            text: "Booking deleted successfully.",
         });

         await refetch();
      } catch {
         setError("Unable to delete this booking. Please try again.");
      } finally {
         setBusyAppointmentId(null);
         setBusyAction(null);
         setPendingDeleteId(null);
      }
   }

   const bookingTypeStyles: Record<string, string> = {
      "Walk-In": "bg-orange-100 text-amber-800",
      "Online Booking": "bg-cyan-100 text-cyan-800",
   };

   return (
      <AdminLayout>
         <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
               <div>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                     Bookings Management
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                     Review appointments, confirm or reject requests.
                  </p>
               </div>

               <Button
                  variant="outline"
                  className="rounded-full border-slate-200 bg-white"
                  onClick={refetch}
                  disabled={isLoading || isRefreshing}
               >
                  {isRefreshing ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
               </Button>
            </div>

            {error && (
               <Alert
                  variant="destructive"
                  className="border-rose-200 bg-rose-50 text-rose-700"
               >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
               </Alert>
            )}

            {message && (
               <Alert
                  className={
                     message.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                  }
               >
                  <Check className="h-4 w-4" />
                  <AlertTitle>{message.type === "success" ? "Success" : "Notice"}</AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
               </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
               <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Total Bookings</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">
                     {counts.total}
                  </p>
               </div>

               <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
                  <p className="text-sm font-medium text-amber-700">Pending</p>
                  <p className="mt-3 text-3xl font-bold text-amber-700">
                     {counts.pending}
                  </p>
               </div>

               <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
                  <p className="text-sm font-medium text-emerald-700">Confirmed</p>
                  <p className="mt-3 text-3xl font-bold text-emerald-700">
                     {counts.confirmed}
                  </p>
               </div>

               <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
                  <p className="text-sm font-medium text-rose-700">Rejected</p>
                  <p className="mt-3 text-3xl font-bold text-rose-700">
                     {counts.rejected}
                  </p>
               </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
               <div className="border-b border-slate-200 px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                     <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                           Bookings Table
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                           Showing {pageAppointments.length} of {sortedAppointments.length} records
                        </p>
                     </div>

                     <div className="flex items-center gap-2">
                        {sortConfig && (
                           <button
                              type="button"
                              onClick={handleResetSort}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                           >
                              <X className="h-3.5 w-3.5" />
                              Clear sort
                           </button>
                        )}
                     </div>
                  </div>
               </div>

               {isLoading ? (
                  <div className="flex h-64 items-center justify-center text-slate-500">
                     Loading bookings...
                  </div>
               ) : pageAppointments.length === 0 ? (
                  <div className="flex h-64 items-center justify-center text-slate-500">
                     No bookings found.
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="min-w-full text-left">
                        <thead className="bg-slate-50 text-sm text-slate-600">
                           <tr className="border-b border-slate-200">
                              <th className="px-6 py-4 font-semibold">ID</th>
                              <th className="px-6 py-4">
                                 <SortableHeaderButton
                                    label="Type"
                                    sortKey="bookingType"
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                 />
                              </th>
                              <th className="px-6 py-4 font-semibold">Customer</th>
                              <th className="px-6 py-4 font-semibold">Contact</th>
                              <th className="px-6 py-4">
                                 <SortableHeaderButton
                                    label="Package"
                                    sortKey="package"
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                 />
                              </th>
                              <th className="px-6 py-4">
                                 <SortableHeaderButton
                                    label="Date & Time"
                                    sortKey="preferredDate"
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                 />
                              </th>
                              <th className="px-6 py-4">
                                 <SortableHeaderButton
                                    label="Service Type"
                                    sortKey="serviceType"
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                 />
                              </th>
                              <th className="px-6 py-4">
                                 <SortableHeaderButton
                                    label="Status"
                                    sortKey="status"
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                 />
                              </th>
                              <th className="px-6 py-4 text-right">
                                 <SortableHeaderButton
                                    label="Amount"
                                    sortKey="totalPrice"
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                    align="end"
                                 />
                              </th>
                              <th className="px-6 py-4 font-semibold text-right">Actions</th>
                           </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                           {pageAppointments.map((appointment) => {
                              const statusMeta = getStatusMeta(appointment.status);
                              const isBusy =
                                 busyAppointmentId === appointment.id && busyAction !== null;

                              return (
                                 <tr
                                    key={appointment.id}
                                    className="transition hover:bg-slate-50"
                                 >
                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                                       #{appointment.id}
                                    </td>

                                    <td className="px-6 py-4">
                                       <span
                                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${bookingTypeStyles[appointment.bookingType] ??
                                             "bg-gray-100 text-gray-800"
                                             }`}
                                       >
                                          {appointment.bookingType}
                                       </span>
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="space-y-1">
                                          <p className="font-semibold text-slate-900">
                                             {appointment.fullName}
                                          </p>
                                       </div>
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="space-y-1 text-sm text-slate-600">
                                          <div className="flex items-center gap-2">
                                             <Phone className="h-4 w-4 text-slate-400" />
                                             <span>{appointment.contactNumber}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                             <Mail className="h-4 w-4 text-slate-400" />
                                             <span>{appointment.email}</span>
                                          </div>
                                       </div>
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="flex flex-wrap gap-2">
                                          {appointment.packages.length > 0 ? (
                                             appointment.packages.map((pkg, index) => (
                                                <span
                                                   key={index}
                                                   className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
                                                >
                                                   {pkg.type}
                                                </span>
                                             ))
                                          ) : (
                                             <span>—</span>
                                          )}
                                       </div>
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="space-y-1 text-sm text-slate-700">
                                          <p className="font-semibold text-slate-900">
                                             {formatShortDate(new Date(appointment.preferredDate))}
                                          </p>
                                          <p className="text-slate-500">
                                             {formatDisplayTime(appointment.preferredTime)}
                                          </p>
                                       </div>
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-2 text-sm text-slate-600">
                                          <span>{appointment.serviceType || "Studio"}</span>
                                       </div>
                                    </td>

                                    <td className="px-6 py-4">
                                       <Badge
                                          variant="outline"
                                          className={statusMeta.className}
                                       >
                                          {statusMeta.label}
                                       </Badge>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-slate-900">
                                       {formatCurrency(appointment.totalPrice)}
                                    </td>

                                    <td className="px-6 py-4">
                                       <div className="flex items-center justify-end gap-2">
                                          <Button
                                             variant="outline"
                                             size="icon-sm"
                                             className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                             onClick={() => handleStatusUpdate(appointment.id, "confirm")}
                                             disabled={isBusy}
                                             title="Confirm booking"
                                          >
                                             {busyAppointmentId === appointment.id &&
                                                busyAction === "confirm" ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                             ) : (
                                                <Check className="h-4 w-4" />
                                             )}
                                          </Button>

                                          <Button
                                             variant="outline"
                                             size="icon-sm"
                                             className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                             onClick={() => handleStatusUpdate(appointment.id, "reject")}
                                             disabled={isBusy}
                                             title="Reject booking"
                                          >
                                             {busyAppointmentId === appointment.id &&
                                                busyAction === "reject" ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                             ) : (
                                                <X className="h-4 w-4" />
                                             )}
                                          </Button>

                                          <Button
                                             variant="outline"
                                             size="icon-sm"
                                             className="border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                             onClick={() => openDeleteDialog(appointment.id)}
                                             disabled={isBusy}
                                             title="Delete booking"
                                          >
                                             {busyAppointmentId === appointment.id && busyAction === "delete" ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                             ) : (
                                                <Trash2 className="h-4 w-4" />
                                             )}
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })}
                           <AlertDialog
                              open={pendingDeleteId !== null}
                              onOpenChange={(open) => {
                                 // Prevent closing the dialog mid-delete (e.g. via ESC or overlay click)
                                 if (!open && busyAction !== "delete") {
                                    closeDeleteDialog();
                                 }
                              }}
                           >
                              <AlertDialogContent>
                                 <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                       This action cannot be undone. This will permanently delete the
                                       booking from the schedule.
                                    </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                    <AlertDialogCancel disabled={busyAction === "delete"}>
                                       Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                       className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                                       disabled={busyAction === "delete"}
                                       onClick={(e) => {
                                          // Prevent AlertDialogAction's default auto-close;
                                          // handleDelete controls closing via setPendingDeleteId(null)
                                          e.preventDefault();
                                          if (pendingDeleteId !== null) {
                                             handleDelete(pendingDeleteId);
                                          }
                                       }}
                                    >
                                       {busyAction === "delete" ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                       ) : (
                                          "Delete"
                                       )}
                                    </AlertDialogAction>
                                 </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </tbody>
                     </table>
                  </div>
               )}

               {!isLoading && totalPages > 1 && (
                  <div className="border-t border-slate-200 px-6 py-4">
                     <Pagination>
                        <PaginationContent>
                           <PaginationItem>
                              <PaginationPrevious
                                 href="#"
                                 onClick={(event) => {
                                    event.preventDefault();
                                    setCurrentPage((page) => Math.max(page - 1, 1));
                                 }}
                                 aria-disabled={currentPage === 1}
                                 className={currentPage === 1 ? "pointer-events-none opacity-40" : ""}
                              />
                           </PaginationItem>

                           {getPageItems(currentPage, totalPages).map((item, index) =>
                              item === "ellipsis" ? (
                                 <PaginationItem key={`ellipsis-${index}`}>
                                    <PaginationEllipsis />
                                 </PaginationItem>
                              ) : (
                                 <PaginationItem key={item}>
                                    <PaginationLink
                                       href="#"
                                       isActive={item === currentPage}
                                       onClick={(event) => {
                                          event.preventDefault();
                                          setCurrentPage(item);
                                       }}
                                    >
                                       {item}
                                    </PaginationLink>
                                 </PaginationItem>
                              ),
                           )}

                           <PaginationItem>
                              <PaginationNext
                                 href="#"
                                 onClick={(event) => {
                                    event.preventDefault();
                                    setCurrentPage((page) => Math.min(page + 1, totalPages));
                                 }}
                                 aria-disabled={currentPage === totalPages}
                                 className={
                                    currentPage === totalPages ? "pointer-events-none opacity-40" : ""
                                 }
                              />
                           </PaginationItem>
                        </PaginationContent>
                     </Pagination>
                  </div>
               )}
            </div>
         </div>
      </AdminLayout>
   );
}