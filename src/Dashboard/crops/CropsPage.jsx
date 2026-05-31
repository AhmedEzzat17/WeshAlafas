import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { cropsService, categoriesService } from "../../service/api";
import { useDashboardData } from "../shared/DashboardDataContext";
import { getImageUrl } from "../../utils/imageUrl";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Sprout, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  Loader2,
  Package,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";

export default function CropsPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { refreshCrops } = useDashboardData();
  
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cropsRes, catsRes] = await Promise.all([
        cropsService.getAll(),
        categoriesService.getAll()
      ]);
      
      if (cropsRes.success) setCrops(cropsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل البيانات" : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا المحصول؟" : "Are you sure you want to delete this crop?")) return;
    try {
      const res = await cropsService.delete(id);
      if (res.success) {
        if (refreshCrops) await refreshCrops();
        toast.success(locale === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
        setCrops(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل الحذف" : "Failed to delete");
    }
  };

  // Filtering
  const filteredCrops = crops.filter(crop => {
    const name = locale === "ar" ? crop.name_ar : crop.name_en;
    const matchesSearch = 
      (name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (crop.scientific_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || crop.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header Area */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "إدارة المحاصيل" : "Crops Management"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" 
              ? `إجمالي المحاصيل المسجلة: ${crops.length}` 
              : `Total registered crops: ${crops.length}`}
          </p>
        </div>
        <button 
          onClick={() => navigate("add")}
          className="dashboard-btn dashboard-btn--primary" 
          style={{ gap: 8 }}
        >
          <Plus size={18} />
          {locale === "ar" ? "إضافة محصول جديد" : "Add New Crop"}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="dashboard-panel" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14, color: "#94A3B8" }} />
            <input 
              className="dashboard-input" 
              placeholder={locale === "ar" ? "بحث عن محصول..." : "Search crops..."} 
              style={{ paddingInlineStart: 44 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ width: 220 }}>
             <select 
               className="dashboard-input" 
               value={selectedCategory} 
               onChange={(e) => setSelectedCategory(e.target.value)}
             >
                <option value="all">{locale === "ar" ? "جميع التصنيفات" : "All Categories"}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{locale === "ar" ? cat.name_ar : cat.name_en}</option>
                ))}
             </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="dashboard-panel" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>{locale === "ar" ? "المحصول" : "Crop"}</th>
                <th>{locale === "ar" ? "الاسم العلمي" : "Scientific Name"}</th>
                <th>{locale === "ar" ? "التصنيف" : "Category"}</th>
                <th>{locale === "ar" ? "الوحدة" : "Unit"}</th>
                <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                <th style={{ textAlign: "center" }}>{locale === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "60px 0" }}>
                    <Loader2 className="animate-spin" size={32} color="#2E7D32" style={{ margin: "0 auto 12px" }} />
                    <p style={{ color: "#94A3B8", fontSize: 14 }}>{locale === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}</p>
                  </td>
                </tr>
              ) : filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => (
                  <tr key={crop.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", border: "1px solid #F1F5F9" }}>
                          {crop.image ? (
                            <img src={getImageUrl(crop.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", color: "#CBD5E1" }}>
                                <Sprout size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{locale === "ar" ? crop.name_ar : crop.name_en}</p>
                          <p style={{ fontSize: 11, color: "#94A3B8" }}>ID: {crop.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontStyle: "italic", color: "#64748B", fontSize: 13 }}>
                      {crop.scientific_name || "—"}
                    </td>
                    <td>
                       <span style={{ 
                         fontSize: 12, 
                         color: "#2E7D32", 
                         backgroundColor: "#E8F5E9", 
                         padding: "4px 10px", 
                         borderRadius: 8, 
                         fontWeight: 600 
                       }}>
                          {locale === "ar" ? crop.category?.name_ar : crop.category?.name_en}
                       </span>
                    </td>
                    <td>
                        <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
                            {crop.standard_unit || "KG"}
                        </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {crop.is_active ? (
                          <>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E" }} />
                            <span style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>{locale === "ar" ? "نشط" : "Active"}</span>
                          </>
                        ) : (
                          <>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                            <span style={{ fontSize: 13, color: "#991B1B", fontWeight: 600 }}>{locale === "ar" ? "غير نشط" : "Inactive"}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                         <button 
                           onClick={() => navigate(`edit/${crop.id}`)}
                           className="dashboard-action-btn" 
                           title={locale === "ar" ? "تعديل" : "Edit"}
                         >
                           <Edit2 size={16} />
                         </button>
                         <button 
                           onClick={() => handleDelete(crop.id)}
                           className="dashboard-action-btn dashboard-action-btn--danger" 
                           title={locale === "ar" ? "حذف" : "Delete"}
                         >
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "80px 0" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Search size={32} color="#CBD5E1" />
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>{locale === "ar" ? "لم يتم العثور على نتائج" : "No crops found"}</p>
                    <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>{locale === "ar" ? "حاول البحث بكلمات أخرى" : "Try searching with different keywords"}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
