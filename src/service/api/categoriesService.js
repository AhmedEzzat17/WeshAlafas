import axiosClient from "./axiosClient";

const PUBLIC_ENDPOINT = "/categories";
const ADMIN_ENDPOINT = "/admin/categories";

const categoriesService = {
  getAll: (params = {}) => {
    return axiosClient.get(PUBLIC_ENDPOINT, { params });
  },
  all: () => {
    return axiosClient.get(`${PUBLIC_ENDPOINT}/all`);
  },
  getById: (id) => {
    return axiosClient.get(`${PUBLIC_ENDPOINT}/${id}`);
  },
  getBySlug: (slug) => {
    return axiosClient.get(`${PUBLIC_ENDPOINT}/slug/${slug}`);
  },
  getWithCrops: () => {
    return axiosClient.get(`${PUBLIC_ENDPOINT}/with-crops`);
  },
  create: (data) => {
    return axiosClient.post(ADMIN_ENDPOINT, data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      data.append("_method", "PUT");
      return axiosClient.post(`${ADMIN_ENDPOINT}/${id}`, data);
    }
    return axiosClient.put(`${ADMIN_ENDPOINT}/${id}`, data);
  },
  delete: (id) => {
    return axiosClient.delete(`${ADMIN_ENDPOINT}/${id}`);
  },
};

export default categoriesService;
