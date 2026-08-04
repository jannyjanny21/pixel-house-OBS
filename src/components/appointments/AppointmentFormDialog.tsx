import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { getAllPackages } from "@/services/packages.service";
import type { GetAppointmentResponseDto } from "@/types/appointments/GetAppointmentResponseDto";
import type { UpdateAppointmentDto } from "@/types/appointments/UpdateAppointmentDto";
import type { GetPackageDto } from "@/types/packages/GetPackageDto";

type AppointmentFormDialogProps = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   appointment: GetAppointmentResponseDto | null;
   onSubmit: (id: number, dto: UpdateAppointmentDto) => Promise<void>;
};

type FormState = {
   fullName: string;
   contactNumber: string;
   email: string;
   bookingType: string;
   serviceType: string;
   preferredDate: string;
   preferredTime: string;
};

type FormErrors = Partial<
   Record<
      | "fullName"
      | "contactNumber"
      | "email"
      | "bookingType"
      | "preferredDate"
      | "preferredTime"
      | "packages",
      string
   >
>;

const EMPTY_FORM: FormState = {
   fullName: "",
   contactNumber: "",
   email: "",
   bookingType: "Walk-In",
   serviceType: "Studio",
   preferredDate: "",
   preferredTime: "",
};

const BOOKING_TYPE_OPTIONS = ["Walk-In", "Online Booking"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Converts an ISO-ish date string into the yyyy-MM-dd format required by
 * <input type="date">, using local date components to avoid UTC off-by-one
 * shifts near midnight.
 */
function toDateInputValue(value: string): string {
   const date = new Date(value);

   if (Number.isNaN(date.getTime())) return "";

   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");

   return `${year}-${month}-${day}`;
}

/**
 * Normalizes either "HH:mm" (24-hour) or "h:mm AM/PM" into the "HH:mm"
 * format required by <input type="time">.
 */
function toTimeInputValue(value: string): string {
   const trimmed = value.trim();

   if (!trimmed) return "";

   const meridiemMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);

   if (meridiemMatch) {
      const [, hourRaw, minuteRaw, meridiem] = meridiemMatch;
      let hour = Number(hourRaw) % 12;

      if (meridiem.toLowerCase() === "pm") {
         hour += 12;
      }

      return `${String(hour).padStart(2, "0")}:${minuteRaw}`;
   }

   const [hourPart, minutePart] = trimmed.split(":");

   if (hourPart === undefined || minutePart === undefined) return "";

   return `${hourPart.padStart(2, "0")}:${minutePart.padStart(2, "0")}`;
}

export default function AppointmentFormDialog({
   open,
   onOpenChange,
   appointment,
   onSubmit,
}: AppointmentFormDialogProps) {
   const [form, setForm] = useState<FormState>(EMPTY_FORM);
   const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([]);
   const [availablePackages, setAvailablePackages] = useState<GetPackageDto[]>(
      [],
   );
   const [isLoadingPackages, setIsLoadingPackages] = useState(false);
   const [packagesError, setPackagesError] = useState<string | null>(null);
   const [errors, setErrors] = useState<FormErrors>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState<string | null>(null);

   // Re-seed the form from the selected appointment every time the dialog
   // opens, so stale state from a previously edited appointment never leaks
   // into the next one.
   useEffect(() => {
      if (!open || !appointment) return;

      setForm({
         fullName: appointment.fullName,
         contactNumber: appointment.contactNumber,
         email: appointment.email,
         bookingType: appointment.bookingType,
         serviceType: appointment.serviceType || "Studio",
         preferredDate: toDateInputValue(appointment.preferredDate),
         preferredTime: toTimeInputValue(appointment.preferredTime),
      });
      setSelectedPackageIds(appointment.packages.map((pkg) => pkg.id));
      setErrors({});
      setSubmitError(null);
   }, [open, appointment]);

   // Load the full package catalog whenever the dialog opens, so the admin
   // can re-assign packages beyond whatever the appointment already has.
   useEffect(() => {
      if (!open) return;

      let isCancelled = false;

      async function loadPackages() {
         setIsLoadingPackages(true);
         setPackagesError(null);

         try {
            const result = await getAllPackages();

            if (!isCancelled) {
               setAvailablePackages(result);
            }
         } catch {
            if (!isCancelled) {
               setPackagesError("Couldn't load packages. Please try again.");
            }
         } finally {
            if (!isCancelled) {
               setIsLoadingPackages(false);
            }
         }
      }

      loadPackages();

      return () => {
         isCancelled = true;
      };
   }, [open]);

   function togglePackage(packageId: number) {
      setSelectedPackageIds((current) =>
         current.includes(packageId)
            ? current.filter((id) => id !== packageId)
            : [...current, packageId],
      );
   }

   function validate(): boolean {
      const nextErrors: FormErrors = {};

      if (!form.fullName.trim()) {
         nextErrors.fullName = "Full name is required.";
      }
      if (!form.contactNumber.trim()) {
         nextErrors.contactNumber = "Contact number is required.";
      }
      if (!form.email.trim() || !EMAIL_PATTERN.test(form.email.trim())) {
         nextErrors.email = "Enter a valid email address.";
      }
      if (!form.bookingType) {
         nextErrors.bookingType = "Booking type is required.";
      }
      if (!form.preferredDate) {
         nextErrors.preferredDate = "Preferred date is required.";
      }
      if (!form.preferredTime) {
         nextErrors.preferredTime = "Preferred time is required.";
      }
      if (selectedPackageIds.length === 0) {
         nextErrors.packages = "Select at least one package.";
      }

      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
   }

   async function handleSubmit(event: FormEvent) {
      event.preventDefault();

      if (!appointment) return;
      if (!validate()) return;

      const payload: UpdateAppointmentDto = {
         fullName: form.fullName.trim(),
         contactNumber: form.contactNumber.trim(),
         email: form.email.trim(),
         bookingType: form.bookingType,
         serviceType: form.serviceType.trim() || "Studio",
         packageIDs: selectedPackageIds,
         preferredDate: form.preferredDate,
         preferredTime: form.preferredTime,
         status: appointment.status,
      };

      setIsSubmitting(true);
      setSubmitError(null);

      try {
         await onSubmit(appointment.id, payload);
         onOpenChange(false);
      } catch {
         setSubmitError(
            "Something went wrong while saving this booking. Please try again.",
         );
      } finally {
         setIsSubmitting(false);
      }
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Edit Booking</DialogTitle>
               <DialogDescription>
                  Update the customer and scheduling details for this booking.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                     id="fullName"
                     value={form.fullName}
                     onChange={(e) =>
                        setForm((prev) => ({ ...prev, fullName: e.target.value }))
                     }
                     placeholder="Juan Dela Cruz"
                  />
                  {errors.fullName && (
                     <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="contactNumber">Contact Number</Label>
                     <Input
                        id="contactNumber"
                        value={form.contactNumber}
                        onChange={(e) =>
                           setForm((prev) => ({
                              ...prev,
                              contactNumber: e.target.value,
                           }))
                        }
                        placeholder="09xxxxxxxxx"
                     />
                     {errors.contactNumber && (
                        <p className="text-sm text-red-500">
                           {errors.contactNumber}
                        </p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                           setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="juan@example.com"
                     />
                     {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="bookingType">Booking Type</Label>
                     <select
                        id="bookingType"
                        value={form.bookingType}
                        onChange={(e) =>
                           setForm((prev) => ({
                              ...prev,
                              bookingType: e.target.value,
                           }))
                        }
                        className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                     >
                        {BOOKING_TYPE_OPTIONS.map((option) => (
                           <option key={option} value={option}>
                              {option}
                           </option>
                        ))}
                     </select>
                     {errors.bookingType && (
                        <p className="text-sm text-red-500">
                           {errors.bookingType}
                        </p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="serviceType">Service Type</Label>
                     <Input
                        id="serviceType"
                        value={form.serviceType}
                        onChange={(e) =>
                           setForm((prev) => ({
                              ...prev,
                              serviceType: e.target.value,
                           }))
                        }
                        placeholder="Studio"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="preferredDate">Preferred Date</Label>
                     <Input
                        id="preferredDate"
                        type="date"
                        value={form.preferredDate}
                        onChange={(e) =>
                           setForm((prev) => ({
                              ...prev,
                              preferredDate: e.target.value,
                           }))
                        }
                     />
                     {errors.preferredDate && (
                        <p className="text-sm text-red-500">
                           {errors.preferredDate}
                        </p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="preferredTime">Preferred Time</Label>
                     <Input
                        id="preferredTime"
                        type="time"
                        value={form.preferredTime}
                        onChange={(e) =>
                           setForm((prev) => ({
                              ...prev,
                              preferredTime: e.target.value,
                           }))
                        }
                     />
                     {errors.preferredTime && (
                        <p className="text-sm text-red-500">
                           {errors.preferredTime}
                        </p>
                     )}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Packages</Label>

                  {packagesError && (
                     <p className="text-sm text-red-500">{packagesError}</p>
                  )}

                  {isLoadingPackages ? (
                     <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading packages...
                     </div>
                  ) : (
                     <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
                        {availablePackages.length === 0 ? (
                           <p className="text-sm text-slate-500">
                              No packages available.
                           </p>
                        ) : (
                           availablePackages.map((pkg) => (
                              <label
                                 key={pkg.id}
                                 className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                              >
                                 <input
                                    type="checkbox"
                                    checked={selectedPackageIds.includes(pkg.id)}
                                    onChange={() => togglePackage(pkg.id)}
                                    className="h-4 w-4 rounded border-slate-300"
                                 />
                                 <span>
                                    {pkg.type}{" "}
                                    <span className="text-slate-400">
                                       (₱{pkg.price})
                                    </span>
                                 </span>
                              </label>
                           ))
                        )}
                     </div>
                  )}

                  {errors.packages && (
                     <p className="text-sm text-red-500">{errors.packages}</p>
                  )}
               </div>

               {submitError && (
                  <p className="text-sm text-red-500">{submitError}</p>
               )}

               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}