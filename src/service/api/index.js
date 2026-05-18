/**
 * src/service/api/index.js – Barrel export
 * ======================================
 * 
 * Single import point for all API services.
 * Usage:
 *   import { authService, cropsService, listingsService } from "../service/api";
 */

export { default as axiosClient } from "./axiosClient";
export { default as authService } from "./authService";
export { default as cropsService } from "./cropsService";
export { default as listingsService } from "./listingsService";
export { default as categoriesService } from "./categoriesService";
export { default as ordersService } from "./ordersService";
export { default as checkoutService } from "./checkoutService";
export { default as negotiationsService } from "./negotiationsService";
export { default as usersService } from "./usersService";
export { default as offersService } from "./offersService";
export { default as dashboardService } from "./dashboardService";
