import axios, {
   AxiosError,
   type AxiosInstance,
   type InternalAxiosRequestConfig,
} from "axios";

const AUTH_TOKEN_STORAGE_KEY = "pixelhouse_auth_token";

const api: AxiosInstance = axios.create({
   baseURL: import.meta.env.VITE_API_BASE_URL,
   headers: {
      "Content-Type": "application/json",
   },
   // If your ASP.NET Core API uses cookie-based auth instead of JWT bearer
   // tokens, set this to true and remove the request interceptor below.
   withCredentials: false,
});

// Attaches the stored JWT to every outgoing request, if one exists.
api.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error: AxiosError) => Promise.reject(error),
);

// Normalizes error handling and reacts to expired/invalid sessions.
api.interceptors.response.use(
   (response) => response,
   (error: AxiosError) => {
      if (error.response?.status === 401) {
         localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);

         if (window.location.pathname !== "/login") {
            window.location.href = "/login";
         }
      }

      return Promise.reject(error);
   },
);

export function setAuthToken(token: string): void {
   localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken(): void {
   localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

export default api;
