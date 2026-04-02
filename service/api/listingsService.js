/**
 * listingsService.js – Listings CRUD API Service
 * ================================================
 * 
 * Handles marketplace listings (products/offers posted by farmers or traders).
 * Same pattern as cropsService for consistency.
 * 
 * Listings may belong to different roles (farmer listings vs trader requests).
 * The API differentiates via the payload; the service stays role-agnostic.
 */

import axiosClient from "./axiosClient";

const ENDPOINT = "/listings";

const listingsService = {
  /**
   * Get all listings (with optional pagination, search, filters)
   * @param {{ page?: number, search?: string, type?: string, category?: string }} params
   */
  getAll: (params = {}) => {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * Get a single listing by ID
   * @param {number|string} id
   */
  getById: (id) => {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new listing
   * @param {object|FormData} data
   */
  create: (data) => {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * Update a listing
   * @param {number|string} id
   * @param {object|FormData} data
   */
  update: (id, data) => {
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axiosClient.post(`${ENDPOINT}/${id}`, data);
    }
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Delete a listing
   * @param {number|string} id
   */
  delete: (id) => {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },

  /**
   * Get listings for the current authenticated user (my listings)
   */
  getMine: (params = {}) => {
    return axiosClient.get(`${ENDPOINT}/my-profile`, { params });
  },
};

export default listingsService;
