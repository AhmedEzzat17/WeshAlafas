import axiosClient from "./axiosClient";

const dashboardService = {
  getStats: () => {
    return axiosClient.get("/dashboard/stats");
  }
};

export default dashboardService;
