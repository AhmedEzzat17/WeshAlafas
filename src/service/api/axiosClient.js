/**
 * axiosClient.js – Centralized Axios Instance
 * ============================================
 * 
 * WHY: Instead of importing raw axios everywhere and manually attaching
 * headers/tokens, we create ONE configured instance.  Every service file
 * imports THIS client, so behaviour changes (base URL, interceptors,
 * error handling) are applied globally in a single place.
 * 
 * DECISIONS:
 *  • Token is stored under `localStorage.user.token` (matches existing AuthContext).
 *  • 401 errors auto-clear the stored session and redirect to /login.
 *  • 422 validation errors are normalised into a flat `errors` object.
 *  • The response interceptor unwraps `response.data` so callers get
 *    the API payload directly (no `res.data.data` chains).
 */

import axios from "axios";

// ─── Base Configuration (Single Source of Truth) ───────────────────────────
// ⚠️ قم بتغيير الدومين هنا وسينعكس التغيير على جميع الـ APIs والصور في المشروع.
export const DOMAIN_URL = import.meta.env.VITE_API_DOMAIN || "https://weshelafasapi.fikriti.com"; // <-- السب دومين الخاص بك
export const API_BASE_URL = `${DOMAIN_URL}/api/v1`;
export const STORAGE_BASE_URL = DOMAIN_URL; // Changed to point directly to the public root

// ─── Create the instance ───────────────────────────────────────────────────
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds – generous for file uploads
});

// ─── Helper: read stored token ─────────────────────────────────────────────
const getStoredToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ?? null;
  } catch {
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
//  REQUEST INTERCEPTOR
//  • Attaches Bearer token when present (unless `skipAuth: true` is set)
//  • Strips Content-Type for FormData (browser sets multipart boundary)
//
//  USAGE: To skip auth on a specific request, pass { skipAuth: true }
//         e.g. axiosClient.get("/crops", { skipAuth: true })
// ═══════════════════════════════════════════════════════════════════════════
axiosClient.interceptors.request.use(
  (config) => {
    // Allow individual requests to opt-out of automatic token attachment.
    // This prevents stale tokens from turning public endpoints into 401s.
    if (!config.skipAuth) {
      const token = getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Let browser set Content-Type for FormData (includes boundary)
    if (config.data instanceof FormData) {
      if (config.headers) {
        if (typeof config.headers.delete === 'function') {
          config.headers.delete("Content-Type");
          config.headers.delete("content-type");
        } else {
          delete config.headers["Content-Type"];
          delete config.headers["content-type"];
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ═══════════════════════════════════════════════════════════════════════════
//  RESPONSE INTERCEPTOR
//  • Unwraps successful responses to return `response.data`
//  • Handles 401, 422, 500 globally
// ═══════════════════════════════════════════════════════════════════════════
axiosClient.interceptors.response.use(
  (response) => {
    // Return the API payload directly (the `{ success, message, data }` object)
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const status = response.status;
      const requestUrl = error.config?.url || "";

      // ── 401 Unauthorized ────────────────────────────────────────────
      // IMPORTANT: Do NOT redirect when the 401 comes from:
      //  1. Auth endpoints (login/register) – means "wrong credentials"
      //  2. Requests with skipAuth – no token was sent, so nothing expired
      if (status === 401) {
        const isAuthEndpoint =
          requestUrl.includes("/auth/login") ||
          requestUrl.includes("/auth/register");
        const wasSkippedAuth = error.config?.skipAuth === true;
        const hadToken = !!localStorage.getItem("user");

        if (!isAuthEndpoint && !wasSkippedAuth) {
          // Expired/invalid token → clear session & redirect
          localStorage.removeItem("user");
          if (hadToken && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      // ── 422 Validation ──────────────────────────────────────────────
      if (status === 422) {
        const apiErrors = response.data?.errors || {};
        const message = response.data?.message || "Validation failed";
        // Build a normalised error object that matches form field names
        const normalised = {};
        Object.entries(apiErrors).forEach(([field, messages]) => {
          normalised[field] = Array.isArray(messages) ? messages[0] : messages;
        });

        return Promise.reject({
          status: 422,
          message,
          errors: normalised,
          raw: response.data,
        });
      }

      // ── 500 Server Error ────────────────────────────────────────────
      if (status >= 500) {
        console.error("[API] Server error:", response.data);
        return Promise.reject({
          status,
          message: response.data?.message || "Internal server error. Please try again later.",
          raw: response.data,
        });
      }

      // ── Other errors (403, 404, etc.) ───────────────────────────────
      return Promise.reject({
        status,
        message: response.data?.message || "Something went wrong.",
        raw: response.data,
      });
    }

    // Network / timeout errors
    return Promise.reject({
      status: 0,
      message: "Network error. Please check your internet connection.",
    });
  }
);

export default axiosClient;
