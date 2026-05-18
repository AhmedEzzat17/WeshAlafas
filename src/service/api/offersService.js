import axiosClient from "./axiosClient";

const ENDPOINT = "/offers";
const FARMER_ENDPOINT = "/farmer/offers";

const offersService = {
  /**
   * Get all offers (public or tenant-based depending on auth)
   */
  getAll: (params = {}) => {
    return axiosClient.get(FARMER_ENDPOINT, { params });
  },

  /**
   * Get a single offer details
   */
  getById: (id) => {
    return axiosClient.get(`${FARMER_ENDPOINT}/${id}`);
  },

  /**
   * Create a new offer
   */
  create: (data) => {
    return axiosClient.post(FARMER_ENDPOINT, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update an existing offer
   */
  update: (id, data) => {
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axiosClient.post(`${FARMER_ENDPOINT}/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return axiosClient.put(`${FARMER_ENDPOINT}/${id}`, data);
  },

  /**
   * Delete an offer
   */
  delete: (id) => {
    return axiosClient.delete(`${FARMER_ENDPOINT}/${id}`);
  }
};

export default offersService;
