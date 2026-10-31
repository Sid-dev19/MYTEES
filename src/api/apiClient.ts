import axios from "axios";

/**
 * Centralised Axios client. Components must never import this directly —
 * all calls live inside src/services. Swap the mock bodies in services for
 * `apiClient.get/post(...)` once the Node backend is ready.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("mytees.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);
