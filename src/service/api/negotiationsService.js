import axiosClient from "./axiosClient";

const ENDPOINT_FARMER = "/farmer/negotiations";
const ENDPOINT_TRADER = "/trader/negotiations";

const negotiationsService = {
  /**
   * Get negotiations as a Trader (sent offers)
   */
  getSent: (params = {}) => {
    return axiosClient.get(ENDPOINT_TRADER, { params });
  },

  /**
   * Get negotiations as a Farmer (received offers)
   */
  getReceived: (params = {}) => {
    return axiosClient.get(ENDPOINT_FARMER, { params });
  },

  /**
   * Create a new negotiation (Make an Offer)
   */
  create: (data) => {
    return axiosClient.post(ENDPOINT_TRADER, data);
  },

  /**
   * Respond to an offer (Farmer side)
   * @param {string} id 
   * @param {"AGREED"|"REJECTED"} status 
   */
  respond: (id, status) => {
    return axiosClient.put(`${ENDPOINT_FARMER}/${id}`, { status });
  },

  /**
   * Get all negotiations (Admin side)
   */
  getAll: (params = {}) => {
    return axiosClient.get("/admin/negotiations", { params });
  }
};

export default negotiationsService;
