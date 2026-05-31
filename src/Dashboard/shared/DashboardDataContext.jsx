import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { listingsService, categoriesService, cropsService, dashboardService } from "../../service/api";
import offersService from "../../service/api/offersService";

function parseOrigin(text) {
  if (!text) return { text: "", originAr: "", originEn: "" };
  const arMatch = text.match(/\[originAr:(.*?)\]/);
  const enMatch = text.match(/\[originEn:(.*?)\]/);
  const originAr = arMatch ? arMatch[1] : "";
  const originEn = enMatch ? enMatch[1] : "";
  const cleanedText = text
    .replace(/\[originAr:.*?\]/g, "")
    .replace(/\[originEn:.*?\]/g, "")
    .trim();
  return { text: cleanedText, originAr, originEn };
}

function parseBilingualText(text) {
  if (!text) return { ar: "", en: "", original: "" };
  const arMatch = text.match(/\[ar:(.*?)\]/);
  const enMatch = text.match(/\[en:(.*?)\]/);
  if (arMatch || enMatch) {
    return {
      ar: arMatch ? arMatch[1] : "",
      en: enMatch ? enMatch[1] : "",
      original: text,
    };
  }
  return {
    ar: text,
    en: text,
    original: text,
  };
}

/* ================================================================
   Data Mapping Helpers
   ================================================================ */

const findCategoryPath = (nodes, targetId) => {
  if (!nodes || !targetId) return null;
  const targetIdStr = String(targetId);

  for (const node of nodes) {
    if (String(node.id) === targetIdStr) {
      return [node];
    }
    if (node.children && node.children.length > 0) {
      const childPath = findCategoryPath(node.children, targetId);
      if (childPath) {
        return [node, ...childPath];
      }
    }
  }
  return null;
};

const getRootFromInlineCategory = (catObj) => {
  if (!catObj) return null;
  let current = catObj;
  while (current.parent) {
    current = current.parent;
  }
  return current;
};

const mapListingToProduct = (listing, categories = [], crops = []) => {
  const cropId = listing.crop_id || listing.crop?.id;
  const cropObj = crops?.find(c => String(c.id) === String(cropId));

  // Resolve categoryId
  const categoryId = listing.crop?.category_id || cropObj?.category_id || listing.crop?.category?.id || cropObj?.category?.id || "";

  // 1. Try to find the category path in the tree
  let rootCategory = null;
  let leafCategory = null;

  if (categoryId) {
    const path = findCategoryPath(categories, categoryId);
    if (path && path.length > 0) {
      rootCategory = path[0];
      leafCategory = path[path.length - 1];
    }
  }

  // 2. Fallback to inline crop category climbing
  if (!rootCategory && listing.crop?.category) {
    const inlineRoot = getRootFromInlineCategory(listing.crop.category);
    if (inlineRoot) {
      rootCategory = inlineRoot;
      leafCategory = listing.crop.category;
    }
  }
  if (!rootCategory && cropObj?.category) {
    const inlineRoot = getRootFromInlineCategory(cropObj.category);
    if (inlineRoot) {
      rootCategory = inlineRoot;
      leafCategory = cropObj.category;
    }
  }

  // 3. Fallback to finding by categoryId if not matched in tree
  if (!rootCategory && categoryId) {
    const found = categories?.find(c => String(c.id) === String(categoryId));
    if (found) {
      rootCategory = found;
      leafCategory = found;
    }
  }

  // Resolve categorySlug and category (using root category for correct routing)
  const categorySlug = rootCategory?.slug || leafCategory?.slug || listing.crop?.category?.slug || cropObj?.category?.slug || listing.crop?.category_slug || "";
  const category = categorySlug ? categorySlug.toUpperCase() : "";
  const leafCategorySlug = leafCategory?.slug || categorySlug;
  const leafCategoryId = leafCategory?.id || categoryId;

  const mainImage = listing.image || listing.crop?.image || cropObj?.image || "/placeholder-product.jpg";
  const allImages = [mainImage];
  if (listing.images && listing.images.length > 0) {
    listing.images.forEach(img => {
      const p = img.image_path || img.image || img;
      if (p && p !== mainImage && !allImages.includes(p)) {
        allImages.push(p);
      }
    });
  }

  const parsedStorage = parseOrigin(listing.storage_information || "");
  const resolvedOriginEn = parsedStorage.originEn || cropObj?.origin_en || cropObj?.originEn || cropObj?.origin || listing.crop?.origin_en || listing.crop?.origin || "Premium Sourced";
  const resolvedOriginAr = parsedStorage.originAr || cropObj?.origin_ar || cropObj?.originAr || cropObj?.origin || listing.crop?.origin_ar || listing.crop?.origin || "مصدر متميز";

  const parsedTitle = parseBilingualText(listing.title || "");
  const parsedDesc = parseBilingualText(listing.description || "");
  const parsedStorageText = parseBilingualText(parsedStorage.text);

  return {
    id: listing.id,
    nameEn: parsedTitle.en || listing.crop?.name_en || parsedTitle.original || "",
    nameAr: parsedTitle.ar || listing.crop?.name_ar || parsedTitle.original || "",
    price: listing.price_per_unit,
    oldPrice: listing.comparison_price,
    weightEn: `${listing.quantity} ${listing.crop?.standard_unit || 'TON'}`,
    weightAr: `${listing.quantity} ${listing.crop?.standard_unit === 'TON' ? 'طن' : (listing.crop?.standard_unit === 'KG' ? 'كيلو' : 'وحدة')}`,
    stock: listing.quantity || 9999,
    minOrderQty: listing.minimum_order_quantity || 1,
    image: mainImage,
    images: allImages,
    descriptionEn: parsedDesc.en || listing.description,
    descriptionAr: parsedDesc.ar || listing.description,
    storageEn: parsedStorageText.en || parsedStorageText.original || "",
    storageAr: parsedStorageText.ar || parsedStorageText.original || "",
    usageEn: listing.usage,
    usageAr: listing.usage,
    originEn: resolvedOriginEn,
    originAr: resolvedOriginAr,
    shelfLifeEn: listing.expiry_duration || "",
    shelfLifeAr: listing.expiry_duration || "",
    category,
    categorySlug,
    categoryId,
    rootCategoryId: rootCategory?.id || categoryId,
    badgeEn: listing.quality_grade === 'A+' ? 'Premium' : (listing.comparison_price ? 'Sale' : ''),
    badgeAr: listing.quality_grade === 'A+' ? 'ممتاز' : (listing.comparison_price ? 'تخفيض' : ''),
    badgeColor: listing.quality_grade === 'A+' ? 'bg-cta' : 'bg-primary',
    rating: 5,
    reviews: Math.floor(Math.random() * 50) + 10,
  };
};

const mapCategory = (cat) => ({
  id: cat.id,
  nameEn: cat.name?.en || cat.nameEn || cat.name || "",
  nameAr: cat.name?.ar || cat.nameAr || cat.name || "",
  slug: cat.slug,
  icon: cat.icon,
  image: cat.image,
  parent_id: cat.parent_id || null,
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
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Categories
  const refreshCategories = useCallback(async () => {
    try {
      const response = await categoriesService.getAll();
      if (response.success) {
        const mappedCats = response.data.map(mapCategory);
        setCategories(mappedCats);
        return mappedCats;
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
    return [];
  }, []);

  // 2. Fetch Crops
  const refreshCrops = useCallback(async () => {
    try {
      const cropRes = await cropsService.getAll();
      if (cropRes.success) {
        const loadedCrops = cropRes.data.map(c => ({
          ...c,
          id: c.id,
          nameEn: c.name?.en || c.name,
          nameAr: c.name?.ar || c.name,
          category: c.category,
          category_id: c.category_id || c.category?.id,
        }));
        setCrops(loadedCrops);
        return loadedCrops;
      }
    } catch (err) {
      console.error("Failed to fetch crops:", err);
    }
    return [];
  }, []);

  // 3. Fetch Products (Listings)
  const refreshProducts = useCallback(async () => {
    try {
      // Fetch latest categories, crops and listings in parallel to avoid stale context mappings
      const [catRes, cropRes, response] = await Promise.all([
        categoriesService.getAll(),
        cropsService.getAll(),
        listingsService.getAll()
      ]);

      let loadedCats = categories;
      if (catRes.success) {
        loadedCats = catRes.data.map(mapCategory);
        setCategories(loadedCats);
      }

      let loadedCrops = crops;
      if (cropRes.success) {
        loadedCrops = cropRes.data.map(c => ({
          ...c,
          id: c.id,
          nameEn: c.name?.en || c.name,
          nameAr: c.name?.ar || c.name,
          category: c.category,
          category_id: c.category_id || c.category?.id,
        }));
        setCrops(loadedCrops);
      }

      if (response.success) {
        setProducts(response.data.map(l => mapListingToProduct(l, loadedCats, loadedCrops)));
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    }
  }, [categories, crops]);

  // 4. Fetch Dashboard Stats
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
    let isMounted = true;
    const refreshData = async () => {
      setLoading(true);
      try {
        // Fire all requests concurrently for much faster loading
        const [catRes, cropRes, listingsRes, offersRes, statsRes] = await Promise.allSettled([
          categoriesService.getAll(),
          cropsService.getAll(),
          listingsService.getAll(),
          offersService.getAllPublic(),
          dashboardService.getStats()
        ]);

        let loadedCats = [];
        if (catRes.status === "fulfilled" && catRes.value?.success) {
          loadedCats = catRes.value.data.map(mapCategory);
          if (isMounted) setCategories(loadedCats);
        }

        let loadedCrops = [];
        if (cropRes.status === "fulfilled" && cropRes.value?.success) {
          loadedCrops = cropRes.value.data.map(c => ({
            ...c,
            id: c.id,
            nameEn: c.name?.en || c.name,
            nameAr: c.name?.ar || c.name,
            category: c.category,
            category_id: c.category_id || c.category?.id,
          }));
          if (isMounted) setCrops(loadedCrops);
        }

        if (listingsRes.status === "fulfilled" && listingsRes.value?.success) {
          if (isMounted) {
            setProducts(listingsRes.value.data.map(l => mapListingToProduct(l, loadedCats, loadedCrops)));
          }
        }

        if (offersRes.status === "fulfilled" && offersRes.value?.success) {
          if (isMounted) setOffers(offersRes.value.data.offers || []);
        }

        if (statsRes.status === "fulfilled" && statsRes.value?.success) {
          if (isMounted) setStats(statsRes.value.data);
        }

      } catch (err) {
        console.error("Critical error during initial data load:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    refreshData();
    return () => { isMounted = false; };
  }, []);

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
        patchProduct, fetchCropById, refreshProducts, refreshStats, refreshCrops,
        loading,
        users, addUser, updateUser, deleteUser, getUserById,
        crops, stats, offers
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
