import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { listingsService, categoriesService, cropsService, dashboardService } from "../../service/api";

/* ================================================================
   Data Mapping Helpers
   ================================================================ */

const mapListingToProduct = (listing) => ({
  id: listing.id,
  // We use the crop name if available, fallback to listing title
  nameEn: listing.crop?.name_en || listing.title,
  nameAr: listing.crop?.name_ar || listing.title,
  price: listing.price_per_unit,
  oldPrice: listing.comparison_price,
  // Formatting weight/quantity
  weightEn: `${listing.quantity} ${listing.crop?.standard_unit || 'TON'}`,
  weightAr: `${listing.quantity} ${listing.crop?.standard_unit === 'TON' ? 'طن' : (listing.crop?.standard_unit === 'KG' ? 'كيلو' : 'وحدة')}`,
  image: listing.image,
  images: listing.images?.length > 0 ? listing.images.map(img => img.image_path) : [listing.image],
  descriptionEn: listing.description,
  descriptionAr: listing.description,
  storageEn: listing.storage_information,
  storageAr: listing.storage_information,
  usageEn: listing.usage,
  usageAr: listing.usage,
  originEn: "Premium Sourced",
  originAr: "مصدر متميز",
  category: listing.crop?.category, // Added for filtering
  categorySlug: listing.crop?.category_slug, // If available
  badgeEn: listing.quality_grade === 'A+' ? 'Premium' : (listing.comparison_price ? 'Sale' : ''),
  badgeAr: listing.quality_grade === 'A+' ? 'ممتاز' : (listing.comparison_price ? 'تخفيض' : ''),
  badgeColor: listing.quality_grade === 'A+' ? 'bg-cta' : 'bg-primary',
  rating: 5,
  reviews: Math.floor(Math.random() * 50) + 10,
});

const mapCategory = (cat) => ({
  id: cat.id,
  nameEn: cat.name.en,
  nameAr: cat.name.ar,
  slug: cat.slug,
  icon: cat.icon,
  image: cat.image,
  productsCount: cat.crops_count || 0,
  children: cat.children?.map(mapCategory) || [],
});

/* ================================================================
   Dashboard Data Context
   ================================================================ */

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [crops, setCrops] = useState([]); // List of available crops (for selection)
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Categories
  const refreshCategories = useCallback(async () => {
    try {
      const response = await categoriesService.getAll();
      if (response.success) {
        setCategories(response.data.map(mapCategory));
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // 2. Fetch Products (Listings)
  const refreshProducts = useCallback(async () => {
    try {
      const response = await listingsService.getAll();
      if (response.success) {
        setProducts(response.data.map(mapListingToProduct));
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  }, []);

  // 3. Fetch Dashboard Stats
  const refreshStats = useCallback(async () => {
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    const fetchCropsList = async () => {
      try {
        const response = await cropsService.getAll();
        if (response.success) {
          setCrops(response.data.map(c => ({
            id: c.id,
            nameEn: c.name?.en || c.name,
            nameAr: c.name?.ar || c.name,
            category: c.category,
          })));
        }
      } catch (error) {
        console.error("Fetch crops error:", error);
      }
    };

    const refreshData = async () => {
      setLoading(true);
      await Promise.all([
        refreshProducts(), 
        refreshCategories(), 
        fetchCropsList(),
        refreshStats()
      ]);
      setLoading(false);
    };
    refreshData();
  }, [refreshCategories, refreshProducts, refreshStats]);

  /* --- Categories CRUD (Optimistic updates or refresh) --- */
  const addCategory = useCallback(async (cat) => {
    await refreshCategories();
  }, [refreshCategories]);

  const updateCategory = useCallback(async (id, data) => {
    await refreshCategories();
  }, [refreshCategories]);

  const deleteCategory = useCallback(async (id) => {
    await refreshCategories();
  }, [refreshCategories]);

  const getCategoryById = useCallback((id) => {
    return categories.find((c) => c.id === id);
  }, [categories]);


  /* --- Products CRUD --- */
  const addProduct = async (form) => {
    try {
      // Map frontend form to backend Listing payload
      const payload = {
        crop_id: form.cropId,
        type: form.type || "FARMER_LISTING", // Default type
        title: form.nameEn,
        description: form.descEn,
        price_per_unit: parseFloat(form.price),
        quantity: parseFloat(form.stock),
        min_order_quantity: 1,
        quality_grade: form.qualityGrade || "A",
        status: "active",
        storage_information: form.descAr, // Using as placeholder
        usage: form.descAr,
      };

      const response = await listingsService.create(payload);
      if (response.success) {
        await refreshProducts();
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      console.error("Add product error:", error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (id, form) => {
    try {
      const payload = {
        title: form.nameEn,
        description: form.descEn,
        price_per_unit: parseFloat(form.price),
        quantity: parseFloat(form.stock),
        quality_grade: form.qualityGrade,
      };

      const response = await listingsService.update(id, payload);
      if (response.success) {
        await refreshProducts();
        return { success: true };
      }
      return { success: false, error: response.message };
    } catch (error) {
      console.error("Update product error:", error);
      return { success: false, error: error.message };
    }
  };

  const patchProduct = useCallback(async (id, data) => {
    return updateProduct(id, data);
  }, [updateProduct]);

  const deleteProduct = useCallback(async (id) => {
    try {
      const response = await listingsService.delete(id);
      if (response.success) {
        await refreshProducts();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [refreshProducts]);

  const getProductById = useCallback(
    (id) => {
      return products.find((p) => String(p.id) === String(id));
    },
    [products]
  );
  
  const fetchCropById = useCallback(async (id) => {
    const p = getProductById(id);
    if (p) return { success: true, data: p };
    return { success: false, error: "Not found" };
  }, [getProductById]);


  /* --- Users CRUD (Minimal placeholder) --- */
  const addUser = useCallback((u) => {
    setUsers((prev) => [...prev, { ...u, id: Date.now() }]);
  }, []);

  const updateUser = useCallback((id, data) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const getUserById = useCallback((id) => {
    return users.find((u) => u.id === id);
  }, [users]);


  return (
    <DashboardDataContext.Provider
      value={{
        categories, addCategory, updateCategory, deleteCategory, getCategoryById,
        products, addProduct, updateProduct, deleteProduct, getProductById,
        patchProduct, fetchCropById, refreshProducts, refreshStats,
        loading,
        users, addUser, updateUser, deleteUser, getUserById,
        crops, stats
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
