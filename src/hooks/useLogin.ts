import { useState } from "react";
import { loginUser } from "@/services/auth.service";
import type { LogInUserDto } from "@/types/auth/LogInUserDto";

export function useLogin() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   async function signIn(dto: LogInUserDto) {
      setIsSubmitting(true);
      setError(null);

      try {
         const result = await loginUser(dto);
         return result;
      } catch (err: any) {
         const message =
            err?.response?.data ||
            err?.response?.data?.message ||
            "Invalid username or password.";

         setError(
            typeof message === "string"
               ? message
               : "Invalid username or password.",
         );
         return null;
      } finally {
         setIsSubmitting(false);
      }
   }

   return {
      signIn,
      isSubmitting,
      error,
      setError,
   };
}
