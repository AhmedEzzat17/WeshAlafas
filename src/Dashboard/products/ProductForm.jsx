import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { ArrowRight, ArrowLeft, Save, Package, Loader } from "lucide-react";

export default function ProductForm() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { getProductById, addProduct, updateProduct, categories } = useDashboardData();

  const existing = isEditing ? getProductById(id) : null;

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        nameAr: existing.nameAr, nameEn: existing.nameEn,
        descAr: existing.descAr || "", descEn: existing.descEn || "",
        price: String(existing.price), stock: String(existing.stock),
        categoryEn: existing.categoryEn, categoryAr: existing.categoryAr,
      };
    }
    return { nameAr: "", nameEn: "", descAr: "", descEn: "", price: "", stock: "", categoryEn: "Fruits", categoryAr: "فواكه" };
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (isEditing && !existing) {
    navigate("/dashboard/products");
    return null;
  }

  const handleCategoryChange = (e) => {
    const catEn = e.target.value;
    const cat = categories.find((c) => c.nameEn === catEn);
    setForm((p) => ({ ...p, categoryEn: catEn, categoryAr: cat?.nameAr || catEn }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nameEn.trim() && !form.nameAr.trim()) return;

    setSaving(true);
    const data = { ...form, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0 };

    try {
      if (isEditing) {
        const result = await updateProduct(Number(id), data);
        if (result && !result.success) {
          console.warn("API update failed, saved locally:", result.error);
        }
      } else {
        const result = await addProduct(data);
        if (result && !result.success) {
          console.warn("API create failed, saved locally:", result.error);
        }
      }
      navigate("/dashboard/products");
    } catch (err) {
      setError(err.message || (locale === "ar" ? "حدث خطأ أثناء الحفظ" : "An error occurred while saving"));
    } finally {
      setSaving(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate("/dashboard/products")} className="dashboard-btn dashboard-btn--outline" style={{ padding: "8px 12px", borderRadius: 10 }}>
          <BackIcon size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {isEditing ? (locale === "ar" ? "تعديل المنتج" : "Edit Product") : (locale === "ar" ? "إضافة منتج جديد" : "Add New Product")}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isEditing ? (locale === "ar" ? "قم بتعديل بيانات المنتج" : "Update product details") : (locale === "ar" ? "أدخل بيانات المنتج الجديد" : "Enter new product details")}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 500, marginBottom: 18 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="dashboard-panel" style={{ marginBottom: 20 }}>
          <div className="dashboard-panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Package size={20} color="#2E7D32" />
              <h3 className="dashboard-panel-title">{locale === "ar" ? "معلومات المنتج" : "Product Information"}</h3>
            </div>
          </div>
          <div className="dashboard-panel-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالعربية" : "Arabic Name"} *</label>
                <input className="dashboard-input" value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالإنجليزية" : "English Name"} *</label>
                <input className="dashboard-input" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} required />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "السعر (ج.م)" : "Price (EGP)"} *</label>
                <input className="dashboard-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "المخزون" : "Stock"} *</label>
                <input className="dashboard-input" type="number" min="0" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الصنف" : "Category"}</label>
                <select className="dashboard-select" value={form.categoryEn} onChange={handleCategoryChange}>
                  {categories.filter((c) => c.status === "active").map((c) => (
                    <option key={c.id} value={c.nameEn}>{locale === "ar" ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الوصف بالعربية" : "Arabic Description"}</label>
              <textarea className="dashboard-textarea" value={form.descAr} onChange={(e) => setForm((p) => ({ ...p, descAr: e.target.value }))} rows={3} />
            </div>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الوصف بالإنجليزية" : "English Description"}</label>
              <textarea className="dashboard-textarea" value={form.descEn} onChange={(e) => setForm((p) => ({ ...p, descEn: e.target.value }))} rows={3} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button type="button" className="dashboard-btn dashboard-btn--outline" onClick={() => navigate("/dashboard/products")} disabled={saving}>
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button type="submit" className="dashboard-btn dashboard-btn--primary" disabled={saving} style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? <Loader size={18} className="spin-icon" /> : <Save size={18} />}
            {saving
              ? (locale === "ar" ? "جاري الحفظ..." : "Saving...")
              : isEditing ? (locale === "ar" ? "حفظ التعديلات" : "Save Changes") : (locale === "ar" ? "إضافة المنتج" : "Add Product")}
          </button>
        </div>
        <style>{`.spin-icon { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </form>
    </div>
  );
}
