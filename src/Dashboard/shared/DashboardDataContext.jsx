import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { mockProducts as initialProducts } from "../../utils/mockProducts";

/* ================================================================
   Mock Data Context (No API for now)
   ================================================================ */

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  // Load initial data from localStorage or use mock defaults
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("mock_categories");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("mock_products");
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("mock_users");
      // Add fake admin mapped to what we have in auth
      const defaultUsers = [{ id: 1, name: "Admin User", email: "admin@admin.com", role: "admin", status: "active", joinedEn: "Jan 1, 2024", joinedAr: "1 يناير 2024" }];
      return saved ? JSON.parse(saved) : defaultUsers;
    } catch {
      return [];
    }
  });

  const [cropsLoading, setCropsLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("mock_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("mock_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("mock_users", JSON.stringify(users));
  }, [users]);

  // Mock fetchCrops to just return true since we are local
  const fetchCrops = useCallback(async () => {
    setCropsLoading(true);
    setTimeout(() => {
      setCropsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  /* --- Categories CRUD --- */
  const addCategory = useCallback((cat) => {
    const colors = ["#FF6B6B", "#51CF66", "#FCC419", "#74C0FC", "#63E6BE", "#F97316", "#845EF7"];
    setCategories((prev) => [...prev, { ...cat, id: Date.now(), productsCount: 0, status: "active", color: colors[Math.floor(Math.random() * colors.length)] }]);
  }, []);

  const updateCategory = useCallback((id, data) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCategoryById = useCallback((id) => {
    return categories.find((c) => c.id === Number(id));
  }, [categories]);


  /* --- Products CRUD --- */
  const addProduct = useCallback(async (prod) => {
    // Make sure we store it in a format identical to mockProducts
    // Map whatever input the dashboard uses to the frontend format if needed
    // But since API is off, if the ProductForm produces `nameEn`, we just add id
    const newProduct = { ...prod, id: Date.now() };
    setProducts((prev) => [...prev, newProduct]);
    return { success: true, data: newProduct };
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    let updatedProduct = null;
    setProducts((prev) => prev.map((p) => {
      if (p.id === id) {
        updatedProduct = { ...p, ...data };
        return updatedProduct;
      }
      return p;
    }));
    return { success: true, data: updatedProduct };
  }, []);

  const patchProduct = useCallback(async (id, data) => {
    return updateProduct(id, data);
  }, [updateProduct]);

  const deleteProduct = useCallback(async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  }, []);

  const getProductById = useCallback(
    (id) => {
      return products.find((p) => p.id === Number(id));
    },
    [products]
  );
  
  const fetchCropById = useCallback(async (id) => {
    const p = getProductById(id);
    if (p) return { success: true, data: p };
    return { success: false, error: "Not found" };
  }, [getProductById]);


  /* --- Users CRUD --- */
  const addUser = useCallback((u) => {
    setUsers((prev) => [...prev, { ...u, id: Date.now(), ordersCount: 0, status: "active", joinedEn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), joinedAr: new Date().toLocaleDateString("ar-EG", { month: "long", day: "numeric", year: "numeric" }) }]);
  }, []);

  const updateUser = useCallback((id, data) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const getUserById = useCallback((id) => {
    return users.find((u) => u.id === Number(id));
  }, [users]);


  return (
    <DashboardDataContext.Provider
      value={{
        categories, addCategory, updateCategory, deleteCategory, getCategoryById,
        products, addProduct, updateProduct, deleteProduct, getProductById,
        patchProduct, fetchCropById, fetchCrops,
        cropsLoading,
        users, addUser, updateUser, deleteUser, getUserById,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error("useDashboardData must be within DashboardDataProvider");
  return ctx;
}
