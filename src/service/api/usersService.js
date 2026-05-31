import axiosClient from "./axiosClient";

const ENDPOINT = "/admin/users";

const usersService = {
  /**
   * Get all users (Admin only)
   */
  getAll: (params = {}) => {
    return axiosClient.get(ENDPOINT, { params });
  },

  /**
   * Get a single user details
   */
  getById: (id) => {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  /**
   * Create a new user
   */
  create: (data) => {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * Update user details
   */
  update: (id, data) => {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * Toggle user status (Active/Inactive)
   */
  toggleStatus: (id) => {
    return axiosClient.post(`${ENDPOINT}/${id}/toggle-status`);
  },

  /**
   * Delete user
   */
  delete: (id) => {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  }
};

export default usersService;
