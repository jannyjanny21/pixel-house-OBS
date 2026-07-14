import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/auth.service";
import type { LogInUserDto } from "@/types/auth/LogInUserDto";

/**
 * Centralized localStorage keys for auth data.
 * Exported so other modules (e.g. an API client's auth interceptor)
 * can read the same keys without duplicating string literals.
 */
export const AUTH_STORAGE_KEYS = {
   token: "token",
   refreshToken: "refreshToken",
   tokenExpiresAt: "tokenExpiresAt",
   user: "user",
} as const;

type StoredUser = {
   username: string;
   rolename: string;
};

/**
 * Single hook for all authentication concerns: logging in, logging out,
 * and checking session validity. Consolidates what used to be split
 * across useAuth + useLogin so there's one source of truth for auth state.
 */
export function useAuth() {
   const navigate = useNavigate();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const login = useCallback(async (dto: LogInUserDto) => {
      setIsSubmitting(true);
      setError(null);

      try {
         const result = await loginUser(dto);

         if (!result?.token) {
            setError("Invalid username or password.");
            return null;
         }

         const expiresAt = Date.now() + result.expiresIn * 1000;
         const user: StoredUser = {
            username: result.username,
            rolename: result.rolename,
         };

         localStorage.setItem(AUTH_STORAGE_KEYS.token, result.token);
         localStorage.setItem(
            AUTH_STORAGE_KEYS.tokenExpiresAt,
            String(expiresAt),
         );
         localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));

         return result;
      } catch (err: any) {
         const message =
            err?.response?.data?.message ||
            err?.response?.data ||
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
   }, []);

   const clearSession = useCallback(() => {
      localStorage.removeItem(AUTH_STORAGE_KEYS.token);
      localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken);
      localStorage.removeItem(AUTH_STORAGE_KEYS.tokenExpiresAt);
      localStorage.removeItem(AUTH_STORAGE_KEYS.user);
      sessionStorage.clear();
   }, []);

   const logout = useCallback(() => {
      clearSession();
      navigate("/login", { replace: true });
   }, [clearSession, navigate]);

   /**
    * Returns true only if a token exists AND has not expired.
    * An expired token is treated as unauthenticated and is
    * proactively cleared so stale data doesn't linger in storage.
    */
   const isAuthenticated = useCallback(() => {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
      const expiresAt = localStorage.getItem(AUTH_STORAGE_KEYS.tokenExpiresAt);

      if (!token || !expiresAt) {
         return false;
      }

      const isExpired = Date.now() >= Number(expiresAt);
      if (isExpired) {
         clearSession();
         return false;
      }

      return true;
   }, [clearSession]);

   return {
      login,
      logout,
      isAuthenticated,
      isSubmitting,
      error,
      setError,
   };
}
