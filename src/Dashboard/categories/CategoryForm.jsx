import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { ArrowRight, ArrowLeft, Save, Layers } from "lucide-react";

export default function CategoryForm() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { getCategoryById, addCategory, updateCategory } = useDashboardData();

  const existing = isEditing ? getCategoryById(id) : null;

  const [form, setForm] = useState(() => {
    if (existing) {
      return { nameAr: existing.nameAr, nameEn: existing.nameEn, descAr: existing.descAr || "", descEn: existing.descEn || "" };
    }
    return { nameAr: "", nameEn: "", descAr: "", descEn: "" };
  });

  // If editing but item not found, redirect
  if (isEditing && !existing) {
    navigate("/dashboard/categories");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nameEn.trim() && !form.nameAr.trim()) return;
    if (isEditing) {
      updateCategory(Number(id), form);
    } else {
      addCategory(form);
    }
    navigate("/dashboard/categories");
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate("/dashboard/categories")} className="dashboard-btn dashboard-btn--outline" style={{ padding: "8px 12px", borderRadius: 10 }}>
          <BackIcon size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {isEditing ? (locale === "ar" ? "تعديل الصنف" : "Edit Category") : (locale === "ar" ? "إضافة صنف جديد" : "Add New Category")}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isEditing ? (locale === "ar" ? "قم بتعديل بيانات الصنف" : "Update category details") : (locale === "ar" ? "أدخل بيانات الصنف الجديد" : "Enter the new category details")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Layers size={20} color="#2E7D32" />
              <h3 className="dashboard-panel-title">{locale === "ar" ? "بيانات الصنف" : "Category Details"}</h3>
            </div>
          </div>
          <div className="dashboard-panel-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالعربية" : "Arabic Name"} *</label>
                <input className="dashboard-input" value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} placeholder={locale === "ar" ? "مثال: فواكه" : "e.g. فواكه"} required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالإنجليزية" : "English Name"} *</label>
                <input className="dashboard-input" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} placeholder={locale === "ar" ? "مثال: Fruits" : "e.g. Fruits"} required />
              </div>
            </div>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الوصف بالعربية" : "Arabic Description"}</label>
              <textarea className="dashboard-textarea" value={form.descAr} onChange={(e) => setForm((p) => ({ ...p, descAr: e.target.value }))} placeholder={locale === "ar" ? "أدخل وصف الصنف بالعربية" : "Enter Arabic description"} rows={3} />
            </div>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الوصف بالإنجليزية" : "English Description"}</label>
              <textarea className="dashboard-textarea" value={form.descEn} onChange={(e) => setForm((p) => ({ ...p, descEn: e.target.value }))} placeholder={locale === "ar" ? "أدخل وصف الصنف بالإنجليزية" : "Enter English description"} rows={3} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
          <button type="button" className="dashboard-btn dashboard-btn--outline" onClick={() => navigate("/dashboard/categories")}>
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button type="submit" className="dashboard-btn dashboard-btn--primary">
            <Save size={18} />
            {isEditing ? (locale === "ar" ? "حفظ التعديلات" : "Save Changes") : (locale === "ar" ? "إضافة الصنف" : "Add Category")}
          </button>
        </div>
      </form>
    </div>
  );
}
