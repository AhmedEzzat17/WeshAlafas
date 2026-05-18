/**
 * authService.js – Authentication API Service
 * =============================================
 * 
 * Handles register, login, logout, and "get current user" endpoints.
 * 
 * WHY separated:
 *  • Single Responsibility – auth logic stays in one file.
 *  • Easy to extend: add social login, password reset, email verification.
 *  • Consumed by AuthContext and useAuth hook.
 */

import axiosClient from "./axiosClient";

const authService = {
  /**
   * Register a new user
   * @param {{ name: string, email: string, phone: string, password: string, password_confirmation: string }} data
   * @returns {Promise<{ success: boolean, message: string, data: object }>}
   */
  register: (data) => {
    // No token needed – this is a public endpoint
    return axiosClient.post("/auth/register", data, { skipAuth: true });
  },

  /**
   * Login with email & password
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ success: boolean, message: string, data: { user: object, token: string } }>}
   */
  login: (credentials) => {
    // No token needed – this is a public endpoint
    return axiosClient.post("/auth/login", credentials, { skipAuth: true });
  },

  /**
   * Get current authenticated user profile
   * Token is auto-attached via the interceptor
   * @returns {Promise<{ success: boolean, data: object }>}
   */
  getUser: () => {
    return axiosClient.get("/user");
  },

  /**
   * Update current user profile
   */
  updateProfile: (data) => {
    return axiosClient.put("/me/profile", data);
  },

  /**
   * Update user password
   */
  updatePassword: (data) => {
    return axiosClient.put("/me/password", data);
  },

  /**
   * Logout (invalidate token server-side)
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  logout: () => {
    return axiosClient.post("/auth/logout");
  },
};

export default authService;
