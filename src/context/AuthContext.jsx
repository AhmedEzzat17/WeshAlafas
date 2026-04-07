import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authService } from "../service/api";

/**
 * AuthContext – Refactored
 * =========================
 * 
 * Now uses the centralized authService (which uses axiosClient with interceptors).
 * 
 * CHANGES from previous version:
 *  • No more raw axios or ApiFunctions import
 *  • Token is auto-attached via axiosClient interceptor (no manual header building)
 *  • Server errors (422) are properly parsed and displayed
 *  • Added fetchUser() to get current profile from /user endpoint
 *  • Cleaner role detection from API response
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── State ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────

  /**
   * Persist user to localStorage.
   * We store token + user data together for simplicity.
   */
  const persistUser = (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch {
      // localStorage might be unavailable (private browsing, quota)
    }
  };

  /**
   * Extract and normalise user from API response.
   * The API might return data in different shapes; this handles them all.
   */
  const normaliseUserResponse = (apiResponse, emailFallback = "") => {
    // The interceptor has already unwrapped response.data,
    // so apiResponse IS the { success, message, data, token, user } object.
    const token =
      apiResponse.token ||
      apiResponse.data?.token ||
      apiResponse.access_token;

    const userData =
      apiResponse.user ||
      apiResponse.data?.user ||
      apiResponse.data ||
      apiResponse;

    const userEmail = (
      userData.email ||
      emailFallback ||
      ""
    ).toLowerCase();

    // Determine role from API response or fallback
    let role = userData.role || "user";
    if (
      userEmail === "admin@gmail.com" ||
      userEmail === "admin@admin.com"
    ) {
      role = "admin";
    }

    return {
      ...userData,
      email: userEmail,
      token,
      role,
    };
  };

  // ── Login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const userToStore = normaliseUserResponse(response, credentials.email);

      setUser(userToStore);
      persistUser(userToStore);

      return { success: true, user: userToStore };
    } catch (err) {
      console.error("Login Error:", err);
      let errorMsg = "فشل تسجيل الدخول. تأكد من صحة البيانات.";

      if (err.errors && Object.keys(err.errors).length > 0) {
        // 422 validation errors – show the first one
        errorMsg = Object.values(err.errors)[0];
      } else if (err.message) {
        errorMsg = err.message;
      }

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ──────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      // Payload matching the Laravel backend's expected fields
      const payload = {
        name: formData.fullName || formData.name || "User",
        email: formData.email,
        phone: formData.phone || formData.phone_number || "",
        password: formData.password,
        password_confirmation:
          formData.confirmPassword || formData.password_confirmation,
        account_type: formData.account_type || "FARMER",
      };

      const response = await authService.register(payload);
      const userToStore = normaliseUserResponse(response, formData.email);

      setUser(userToStore);
      persistUser(userToStore);

      return { success: true, user: userToStore };
    } catch (err) {
      console.error("Register Error:", err);
      let errorMsg =
        "فشل إنشاء الحساب. تأكد من صحة البيانات أو ربما الإيميل مستخدم مسبقاً.";

      if (err.errors && Object.keys(err.errors).length > 0) {
        // Show the first validation error
        errorMsg = Object.values(err.errors)[0];
      } else if (err.message) {
        errorMsg = err.message;
      }

      return { success: false, error: errorMsg, errors: err.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Get current user ──────────────────────────────────────────────────
  const fetchUser = useCallback(async () => {
    if (!user?.token) return null;
    try {
      const response = await authService.getUser();
      const freshUser = response.data || response.user || response;
      const merged = { ...user, ...freshUser };
      setUser(merged);
      persistUser(merged);
      return merged;
    } catch {
      // Token might be expired – interceptor handles 401 redirect
      return null;
    }
  }, [user]);

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    // Try server-side logout (invalidate token). Don't block on failure.
    try {
      await authService.logout();
    } catch {
      // Ignore – we clear local state regardless
    }
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch {
      // localStorage might be unavailable
    }
  }, []);

  // ── Optional: fetch user profile on mount if token exists ─────────
  useEffect(() => {
    if (user?.token && !user?.name) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Provider ──────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        fetchUser,
        loading,
        isAuthenticated: !!user?.token,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
