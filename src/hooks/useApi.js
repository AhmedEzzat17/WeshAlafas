/**
 * useApi.js – Generic API request hook
 * ======================================
 * 
 * A low-level hook that wraps any async API call with:
 *  • loading state
 *  • data state
 *  • error state (normalised)
 *  • an execute() function for on-demand calls
 * 
 * WHY: Avoids duplicating loading/error logic across every component
 * that talks to an API.
 * 
 * USAGE:
 *   const { data, loading, error, execute } = useApi(cropsService.getAll);
 *   useEffect(() => { execute(); }, []);
 * 
 *   // Or with params:
 *   const { execute: createCrop } = useApi(cropsService.create);
 *   createCrop(formData);
 */

import { useState, useCallback } from "react";

export default function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute the API call.
   * Returns the resolved data or throws so the caller can react.
   */
  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        // err is already normalised by our interceptor
        const errorObj = {
          message: err?.message || "An unexpected error occurred",
          errors: err?.errors || {},
          status: err?.status || 0,
        };
        setError(errorObj);
        throw errorObj; // re-throw so callers can handle per-call logic
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  /** Reset all state (useful when navigating away) */
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}
