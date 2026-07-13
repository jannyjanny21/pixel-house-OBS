import { useState } from "react";
import { isAxiosError } from "axios";
import { createAppointment } from "@/services/appointments.service";
import type { CreateAppointmentDto } from "@/types/appointments/CreateAppointmentDto";

type ValidationProblemDetails = {
   errors?: Record<string, string[]>;
   title?: string;
};

export function useCreateAppointment() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   async function submitAppointment(dto: CreateAppointmentDto) {
      setIsSubmitting(true);
      setError(null);

      try {
         const result = await createAppointment(dto);
         return result;
      } catch (err: any) {
         setError(extractErrorMessage(err));
         return null;
      } finally {
         setIsSubmitting(false);
      }
   }

   return {
      submitAppointment,
      isSubmitting,
      error,
      setError,
   };
}

function extractErrorMessage(err: unknown): string {
   if (!isAxiosError(err)) {
      return "Unable to create appointment. Please try again.";
   }

   const data = err.response?.data;

   // ASP.NET Core ModelState validation errors (BadRequest(ModelState))
   if (data && typeof data === "object" && "errors" in data) {
      const problemDetails = data as ValidationProblemDetails;
      const firstFieldErrors = Object.values(problemDetails.errors ?? {})[0];
      if (firstFieldErrors?.length) {
         return firstFieldErrors[0];
      }
   }

   // Plain string body (e.g. BadRequest(result.ErrorMessage) from your PackageIDs check)
   if (typeof data === "string") {
      return data;
   }

   // Object with a "message" field
   if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string") {
         return message;
      }
   }

   return "Unable to create appointment. Please try again.";
}
