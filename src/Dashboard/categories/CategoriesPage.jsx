import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { categoriesService } from "../../service/api";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layers, 
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesService.getAll();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل التصنيفات" : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToForm = (category = null) => {
    if (category) {
      navigate(`/dashboard/categories/edit/${category.id}`);
    } else {
      navigate("/dashboard/categories/add");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا التصنيف؟" : "Are you sure you want to delete this category?")) return;
    try {
      const res = await categoriesService.delete(id);
      if (res.success) {
        toast.success(locale === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل الحذف" : "Failed to delete");
    }
  };

  const filteredCategories = categories.filter(c => {
    const nameEn = typeof c.name === 'object' ? (c.name?.en || "") : (c.name_en || c.name || "");
    const nameAr = typeof c.name === 'object' ? (c.name?.ar || "") : (c.name_ar || c.name || "");
    
    return nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
           nameAr.includes(searchQuery);
  });

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "إدارة التصنيفات" : "Categories Management"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? "تنظيم المحاصيل في مجموعات رئيسية." : "Organize crops into main groups."}
          </p>
        </div>
        <button 
          onClick={() => handleNavigateToForm()}
          className="dashboard-btn dashboard-btn--primary" 
          style={{ gap: 8 }}
        >
          <Plus size={18} />
          {locale === "ar" ? "إضافة تصنيف جديد" : "Add New Category"}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
        <input 
          type="text" 
          placeholder={locale === "ar" ? "بحث في التصنيفات..." : "Search categories..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="dashboard-input"
          style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
        />
      </div>

      {/* Grid View */}
      {loading ? (
        <div style={{ padding: 80, textAlign: "center" }}>
          <Loader2 className="animate-spin" size={40} style={{ margin: "0 auto 16px", color: "#2E7D32" }} />
          <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل التصنيفات..." : "Loading categories..."}</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filteredCategories.map(cat => (
            <div key={cat.id} className="dashboard-panel" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.image ? 'transparent' : "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#2E7D32", overflow: 'hidden' }}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name_en || 'Category'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Layers size={22} />
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleNavigateToForm(cat)} style={{ border: "none", background: "none", color: "#94A3B8", cursor: "pointer" }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={{ border: "none", background: "none", color: "#EF4444", cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>
                {locale === "ar" 
                  ? (typeof cat.name === 'object' ? cat.name?.ar : cat.name_ar || cat.name) 
                  : (typeof cat.name === 'object' ? cat.name?.en : cat.name_en || cat.name)}
              </h3>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 16, height: 40, overflow: "hidden" }}>
                {locale === "ar" 
                  ? (typeof cat.description === 'object' ? cat.description?.ar : cat.description_ar || cat.description) 
                  : (typeof cat.description === 'object' ? cat.description?.en : cat.description_en || cat.description)}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #F1F5F9" }}>
                <span className={`dashboard-badge dashboard-badge--${cat.is_active ? "success" : "warning"}`}>
                  {cat.is_active ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Inactive")}
                </span>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>ID: {cat.id}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 80, textAlign: "center" }}>
          <Layers size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
          <p style={{ color: "#64748B" }}>{locale === "ar" ? "لا توجد تصنيفات حالياً" : "No categories at the moment"}</p>
        </div>
      )}
    </div>
  );
}
