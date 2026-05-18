import axiosClient from "./axiosClient";

const checkoutService = {
    /**
     * Create a new order
     * @param {Object} orderData 
     */
    placeOrder: (orderData) => {
        return axiosClient.post("/trader/orders", orderData);
    }
};

export default checkoutService;
