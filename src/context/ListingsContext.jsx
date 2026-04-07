import { createContext, useContext, useCallback } from "react";
import { listingsService } from "../service/api";
import useCrud from "../hooks/useCrud";

/**
 * ListingsContext
 * ================
 * 
 * Provides listings CRUD to all components.
 * Uses the reusable useCrud hook for zero boilerplate.
 * 
 * Listings represent marketplace entries – crops/products that farmers
 * post for sale or that traders request to purchase.
 */

const ListingsContext = createContext(null);

export function ListingsProvider({ children }) {
  const crud = useCrud(listingsService);

  /**
   * Fetch the current user's own listings.
   * Uses the /listings/mine endpoint.
   */
  const fetchMyListings = useCallback(async (params = {}) => {
    try {
      const result = await listingsService.getMine(params);
      const list = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];
      crud.setItems(list);
      return list;
    } catch (err) {
      crud.setError(err.message || "Failed to fetch your listings");
      return [];
    }
  }, [crud]);

  return (
    <ListingsContext.Provider
      value={{
        listings: crud.items,
        listing: crud.item,
        loading: crud.loading,
        error: crud.error,
        pagination: crud.pagination,
        fetchListings: crud.fetchAll,
        fetchListingById: crud.fetchById,
        createListing: crud.create,
        updateListing: crud.update,
        deleteListing: crud.remove,
        fetchMyListings,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
}
