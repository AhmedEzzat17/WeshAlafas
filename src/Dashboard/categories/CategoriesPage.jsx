import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { Plus, Search, Edit3, Trash2, Layers } from "lucide-react";

export default function CategoriesPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { categories, deleteCategory, updateCategory } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase();
    return cat.nameEn.toLowerCase().includes(q) || cat.nameAr.includes(searchQuery);
  });

  const handleDelete = (id) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) {
      deleteCategory(id);
    }
  };

  const handleToggleStatus = (cat) => {
    updateCategory(cat.id, { status: cat.status === "active" ? "inactive" : "active" });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "الأصناف" : "Categories"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? `إجمالي الأصناف: ${categories.length}` : `Total categories: ${categories.length}`}
          </p>
        </div>
        <button className="dashboard-btn dashboard-btn--primary" onClick={() => navigate("/dashboard/categories/add")}>
          <Plus size={18} />
          {locale === "ar" ? "إضافة صنف" : "Add Category"}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 400, marginBottom: 24 }}>
        <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14, pointerEvents: "none" }} />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={locale === "ar" ? "بحث في الأصناف..." : "Search categories..."}
          className="dashboard-input"
          style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
        />
      </div>

      {/* Table */}
      <div className="dashboard-panel" style={{ overflowX: "auto" }}>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{locale === "ar" ? "الصنف" : "Category"}</th>
              <th>{locale === "ar" ? "الوصف" : "Description"}</th>
              <th>{locale === "ar" ? "عدد المنتجات" : "Products"}</th>
              <th>{locale === "ar" ? "الحالة" : "Status"}</th>
              <th>{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat, idx) => (
              <tr key={cat.id}>
                <td style={{ fontWeight: 600, color: "#94A3B8" }}>{idx + 1}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: cat.color, flexShrink: 0 }}>
                      <Layers size={18} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{locale === "ar" ? cat.nameAr : cat.nameEn}</span>
                  </div>
                </td>
                <td style={{ color: "#64748B", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {locale === "ar" ? cat.descAr : cat.descEn}
                </td>
                <td style={{ fontWeight: 600 }}>{cat.productsCount}</td>
                <td>
                  <span
                    className={`dashboard-badge dashboard-badge--${cat.status === "active" ? "success" : "warning"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleToggleStatus(cat)}
                  >
                    {cat.status === "active" ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "متوقف" : "Inactive")}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="dashboard-btn dashboard-btn--outline" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => navigate(`/dashboard/categories/edit/${cat.id}`)} title={locale === "ar" ? "تعديل" : "Edit"}>
                      <Edit3 size={14} />
                    </button>
                    <button className="dashboard-btn dashboard-btn--danger" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => handleDelete(cat.id)} title={locale === "ar" ? "حذف" : "Delete"}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon"><Layers size={36} /></div>
            <h3 className="dashboard-empty-title">{locale === "ar" ? "لا توجد أصناف" : "No categories found"}</h3>
            <p className="dashboard-empty-desc">{locale === "ar" ? "لم يتم العثور على أصناف مطابقة للبحث." : "No categories match your search."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
