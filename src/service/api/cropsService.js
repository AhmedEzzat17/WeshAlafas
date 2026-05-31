/**
 * cropsService.js – Crops CRUD API Service
 * ==========================================
 * 
 * Full CRUD operations for crop resources.
 * Supports both JSON and FormData payloads (for image uploads).
 * 
 * PATTERN:
 *  • Each method returns the raw API response (already unwrapped by interceptor).
 *  • Pagination support via query params.
 *  • Search support by appending `?search=term`.
 */

import axiosClient from "./axiosClient";

const ENDPOINT = "/crops";
const ADMIN_ENDPOINT = "/admin/crops";

const cropsService = {
  /**
   * Get all crops (with optional pagination & search)
   * @param {{ page?: number, search?: string }} params
   */
  getAll: (params = {}) => {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * Get a single crop by ID
   * @param {number|string} id
   */
  getById: (id) => {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new crop
   * @param {object|FormData} data – use FormData when uploading images
   */
  create: (data) => {
    return axiosClient.post(ADMIN_ENDPOINT, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update an existing crop (full update)
   * NOTE: Laravel expects POST + _method=PUT for FormData file uploads.
   * If data is FormData, we use the POST + _method trick.
   * @param {number|string} id
   * @param {object|FormData} data
   */
  update: (id, data) => {
    if (data instanceof FormData) {
      // Laravel trick: POST with _method=PUT for file uploads
      data.append("_method", "PUT");
      return axiosClient.post(`${ADMIN_ENDPOINT}/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return axiosClient.put(`${ADMIN_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a crop
   * @param {number|string} id
   */
  delete: (id) => {
    return axiosClient.delete(`${ADMIN_ENDPOINT}/${id}`);
  },
};

export default cropsService;
