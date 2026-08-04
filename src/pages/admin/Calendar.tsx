import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, Phone, Mail } from "lucide-react";

import AdminLayout from "@/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";

import { getAppointments } from "@/services/appointments.service";
import type { GetAppointmentResponseDto } from "@/types/appointments/GetAppointmentResponseDto";
import "@/styles/calendar.css"; // Import the CSS file for FullCalendar

export default function Calendar() {
   const [appointments, setAppointments] = useState<
      GetAppointmentResponseDto[]
   >([]);

   const [selectedAppointment, setSelectedAppointment] =
      useState<GetAppointmentResponseDto | null>(null);

   const [loading, setLoading] = useState(true);

   const statusStyles: Record<string, string> = {
      pending:
         "bg-[oklch(0.924_0.12_95.746)] text-[oklch(0.42_0.12_70)] border-transparent hover:bg-[oklch(0.924_0.12_95.746)]",

      confirmed:
         "bg-green-100 text-green-700 border-transparent hover:bg-green-100",

      rejected:
         "bg-red-100 text-red-700 border-transparent hover:bg-red-100",

      cancelled:
         "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-100",
   };

   useEffect(() => {
      async function load() {
         try {
            const result = await getAppointments();
            setAppointments(result);
         } finally {
            setLoading(false);
         }
      }

      load();
   }, []);

   const events = useMemo(() => {
      return appointments.map((appointment) => ({
         id: String(appointment.id),

         title: appointment.fullName,

         start: `${appointment.preferredDate}T${appointment.preferredTime}`,

         extendedProps: {
            appointment,
         },
      }));
   }, [appointments]);

   if (loading) {
      return (
         <AdminLayout>
            <div className="p-8">
               Loading...
            </div>
         </AdminLayout>
      );
   }



   return (
      <AdminLayout>
         <Card className="border-0 shadow-md">
            <CardContent className="p-6">
               <FullCalendar
                  plugins={[
                     dayGridPlugin,
                     timeGridPlugin,
                     interactionPlugin,
                     listPlugin,
                  ]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                     left: "prev,next today",
                     center: "title",
                     right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                  }}
                  buttonText={{
                     today: "Today",
                     month: "Month",
                     week: "Week",
                     day: "Day",
                     list: "List",
                  }}
                  height="80vh"
                  events={events}
                  dayMaxEvents
                  eventContent={(info) => {
                     const appointment =
                        info.event.extendedProps.appointment as GetAppointmentResponseDto;

                     const status = appointment.status.toLowerCase();

                     const styles =
                        status === "confirmed"
                           ? {
                              bg: "bg-emerald-50",
                              border: "border-emerald-500",
                              dot: "bg-emerald-500",
                           }
                           : status === "pending"
                              ? {
                                 bg: "bg-amber-50",
                                 border: "border-amber-500",
                                 dot: "bg-amber-500",
                              }
                              : {
                                 bg: "bg-rose-50",
                                 border: "border-rose-500",
                                 dot: "bg-rose-500",
                              };

                     return (
                        <div
                           className={`flex w-full items-center gap-2 rounded-sm border-l-4 px-2 py-1 ${styles.bg} ${styles.border}`}
                        >
                           <span
                              className={`h-2 w-2 rounded-full ${styles.dot}`}
                           />

                           <span className="text-xs text-slate-600">
                              {info.timeText}
                           </span>

                           <span className="truncate text-xs font-semibold text-slate-700">
                              {appointment.fullName}
                           </span>
                        </div>
                     );
                  }} // ← Add the code above here
                  eventClick={(info) => {
                     setSelectedAppointment(
                        info.event.extendedProps.appointment
                     );
                  }}
               />
            </CardContent>
         </Card>
         <Dialog
            open={selectedAppointment !== null}
            onOpenChange={(open) => {
               if (!open) {
                  setSelectedAppointment(null);
               }
            }}
         >
            <DialogContent className="sm:max-w-xl">

               <DialogHeader>
                  <DialogTitle>
                     Appointment Details
                  </DialogTitle>

                  <DialogDescription>
                     View the booking information.
                  </DialogDescription>
               </DialogHeader>

               {selectedAppointment && (
                  <div className="space-y-6">

                     <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">
                           {selectedAppointment.fullName}
                        </h2>

                        <Badge
                           className={
                              statusStyles[selectedAppointment.status.toLowerCase()] ??
                              "bg-gray-100 text-gray-700"
                           }
                        >
                           {selectedAppointment.status}
                        </Badge>
                     </div>

                     <div className="grid gap-4">

                        <div className="flex items-center gap-3">
                           <User className="h-4 w-4 text-slate-500" />
                           <span>{selectedAppointment.fullName}</span>
                        </div>

                        <div className="flex items-center gap-3">
                           <Phone className="h-4 w-4 text-slate-500" />
                           <span>{selectedAppointment.contactNumber}</span>
                        </div>

                        <div className="flex items-center gap-3">
                           <Mail className="h-4 w-4 text-slate-500" />
                           <span>{selectedAppointment.email}</span>
                        </div>

                        <div className="flex items-center gap-3">
                           <CalendarDays className="h-4 w-4 text-slate-500" />
                           <span>{selectedAppointment.preferredDate}</span>
                        </div>

                        <div className="flex items-center gap-3">
                           <Clock className="h-4 w-4 text-slate-500" />
                           <span>{selectedAppointment.preferredTime}</span>
                        </div>

                     </div>

                     <div>
                        <h3 className="mb-2 font-semibold">
                           Packages
                        </h3>

                        <div className="flex flex-wrap gap-2">
                           {selectedAppointment.packages.map((pkg) => (
                              <Badge
                                 key={pkg.id}
                                 variant="secondary"
                              >
                                 {pkg.type}
                              </Badge>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">

                        <div>
                           <p className="text-sm text-slate-500">
                              Booking Type
                           </p>

                           <p className="font-semibold">
                              {selectedAppointment.bookingType}
                           </p>
                        </div>

                        <div>
                           <p className="text-sm text-slate-500">
                              Service Type
                           </p>

                           <p className="font-semibold">
                              {selectedAppointment.serviceType}
                           </p>
                        </div>

                        <div>
                           <p className="text-sm text-slate-500">
                              Total Price
                           </p>

                           <p className="font-semibold">
                              ₱{selectedAppointment.totalPrice.toLocaleString()}
                           </p>
                        </div>

                     </div>

                  </div>
               )}

            </DialogContent>
         </Dialog>
      </AdminLayout>
   );
}