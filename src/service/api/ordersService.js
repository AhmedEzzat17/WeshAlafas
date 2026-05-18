import axiosClient from "./axiosClient";

/**
 * Get the orders endpoint based on user role
 */
const getEndpoint = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.toUpperCase();
    
    if (role === "ADMIN") return "/admin/orders";
    if (role === "FARMER") return "/farmer/orders";
    return "/trader/orders";
  } catch (e) {
    return "/trader/orders";
  }
};

const ordersService = {
  /**
   * Get all orders
   */
  getAll: (params = {}) => {
    return axiosClient.get(getEndpoint(), { params });
  },

  /**
   * Get a single order details
   */
  getById: (id) => {
    return axiosClient.get(`${getEndpoint()}/${id}`);
  },

  /**
   * Create a new order (usually via checkout)
   */
  create: (data) => {
    return axiosClient.post("/trader/orders", data); // Usually traders create orders
  },

  /**
   * Update order status
   */
  updateStatus: (id, status) => {
    return axiosClient.put(`${getEndpoint()}/${id}`, { status });
  },

  /**
   * Cancel an order
   */
  cancel: (id) => {
    return axiosClient.put(`${getEndpoint()}/${id}`, { status: "CANCELLED" });
  }
};

export default ordersService;
