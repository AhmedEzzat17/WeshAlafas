/**
 * useCrud.js – Reusable CRUD hook
 * =================================
 * 
 * Wraps a service object (cropsService, listingsService) and provides:
 *  • items[], loading, error  (list state)
 *  • fetchAll(), fetchById(), create(), update(), remove()
 * 
 * WHY: Eliminates repeated CRUD boilerplate across dashboard pages.
 * 
 * USAGE:
 *   const crud = useCrud(cropsService);
 *   useEffect(() => { crud.fetchAll(); }, []);
 * 
 *   <button onClick={() => crud.remove(id)}>Delete</button>
 */

import { useState, useCallback } from "react";

export default function useCrud(service) {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // ── Fetch all items (with optional params) ──────────────────────────
  const fetchAll = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getAll(params);
        // Handle different response shapes:
        //   { data: [...] }  or  { data: { data: [...], meta: {...} } }
        const list = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
          ? result.data.data
          : [];

        setItems(list);

        // Extract pagination meta if present
        if (result.data?.meta || result.meta) {
          setPagination(result.data?.meta || result.meta);
        }

        return list;
      } catch (err) {
        setError(err.message || "Failed to fetch items");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  // ── Fetch single item by ID ─────────────────────────────────────────
  const fetchById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getById(id);
        const data = result.data || result;
        setItem(data);
        return data;
      } catch (err) {
        setError(err.message || "Failed to fetch item");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  // ── Create ──────────────────────────────────────────────────────────
  const create = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.create(data);
        const newItem = result.data || result;
        // Append to local list for optimistic UI
        setItems((prev) => [newItem, ...prev]);
        return { success: true, data: newItem };
      } catch (err) {
        setError(err.message || "Failed to create item");
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  // ── Update ──────────────────────────────────────────────────────────
  const update = useCallback(
    async (id, data) => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.update(id, data);
        const updated = result.data || result;
        // Update in local list for optimistic UI
        setItems((prev) =>
          prev.map((item) =>
            (item.id || item._id) === id ? { ...item, ...updated } : item
          )
        );
        return { success: true, data: updated };
      } catch (err) {
        setError(err.message || "Failed to update item");
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  // ── Delete ──────────────────────────────────────────────────────────
  const remove = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await service.delete(id);
        // Remove from local list for optimistic UI
        setItems((prev) =>
          prev.filter((item) => (item.id || item._id) !== id)
        );
        return { success: true };
      } catch (err) {
        setError(err.message || "Failed to delete item");
        return { success: false, error: err };
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return {
    items,
    item,
    loading,
    error,
    pagination,
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    setItems,
    setItem,
    setError,
  };
}
