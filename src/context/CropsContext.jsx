import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cropsService } from "../../service/api";
import { useAuth } from "./AuthContext";

/**
 * CropsContext
 * ============
 * The /crops endpoint requires authentication.
 * We only fetch crops after the user logs in.
 */

const CropsContext = createContext(null);

const mapCropToProduct = (crop) => ({
  id: crop.id,
  nameEn: crop.name_en || crop.nameEn || crop.name || "",
  nameAr: crop.name_ar || crop.nameAr || crop.name || "",
  price: parseFloat(crop.price) || 0,
  oldPrice: crop.old_price ? parseFloat(crop.old_price) : null,
  weightEn: crop.weight_en || crop.weightEn || crop.weight || "1 Ton",
  weightAr: crop.weight_ar || crop.weightAr || "1 طن",
  image: crop.image || crop.image_url || "/images/fallback.png",
  badgeEn: crop.badge_en || crop.badgeEn || "",
  badgeAr: crop.badge_ar || crop.badgeAr || "",
  rating: parseFloat(crop.rating) || 0,
  reviews: parseInt(crop.reviews) || 0,
  badgeColor: crop.badge_color || crop.badgeColor || "bg-primary",
  images: crop.images || (crop.image ? [crop.image] : []),
  descriptionEn: crop.description_en || crop.descriptionEn || crop.description || "",
  descriptionAr: crop.description_ar || crop.descriptionAr || crop.description || "",
  originEn: crop.origin_en || crop.originEn || "",
  originAr: crop.origin_ar || crop.originAr || "",
  storageEn: crop.storage_en || crop.storageEn || "",
  storageAr: crop.storage_ar || crop.storageAr || "",
  shelfLifeEn: crop.shelf_life_en || crop.shelfLifeEn || "",
  shelfLifeAr: crop.shelf_life_ar || crop.shelfLifeAr || "",
  nutritionEn: crop.nutrition_en || crop.nutritionEn || "",
  nutritionAr: crop.nutrition_ar || crop.nutritionAr || "",
  usageEn: crop.usage_en || crop.usageEn || "",
  usageAr: crop.usage_ar || crop.usageAr || "",
  categoryEn: crop.category_en || crop.categoryEn || crop.category || "",
  categoryAr: crop.category_ar || crop.categoryAr || "",
  stock: parseInt(crop.stock) || parseInt(crop.quantity) || 0,
});

export function CropsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCrops = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await cropsService.getAll(params);
      const cropsArray = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : Array.isArray(result.crops)
        ? result.crops
        : [];
      setCrops(cropsArray.map(mapCropToProduct));
    } catch (err) {
      console.error("Failed to fetch crops:", err);
      setError(err.message || "Failed to fetch crops");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCrop = useCallback(async (data) => {
    try {
      const result = await cropsService.create(data);
      const newCrop = result.data || result;
      setCrops((prev) => [mapCropToProduct(newCrop), ...prev]);
      return { success: true, data: newCrop };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create crop" };
    }
  }, []);

  const updateCrop = useCallback(async (id, data) => {
    try {
      const result = await cropsService.update(id, data);
      const updated = result.data || result;
      setCrops((prev) =>
        prev.map((c) => (c.id === id ? mapCropToProduct(updated) : c))
      );
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message || "Failed to update crop" };
    }
  }, []);

  const deleteCrop = useCallback(async (id) => {
    try {
      await cropsService.delete(id);
      setCrops((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Failed to delete crop" };
    }
  }, []);

  const getCropById = useCallback(
    (id) => crops.find((c) => c.id === Number(id)),
    [crops]
  );

  // Only fetch when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCrops();
    } else {
      setCrops([]);
    }
  }, [isAuthenticated, fetchCrops]);

  return (
    <CropsContext.Provider
      value={{
        crops,
        loading,
        error,
        fetchCrops,
        getCropById,
        createCrop,
        updateCrop,
        deleteCrop,
      }}
    >
      {children}
    </CropsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCrops() {
  const ctx = useContext(CropsContext);
  if (!ctx) throw new Error("useCrops must be used within CropsProvider");
  return ctx;
}
