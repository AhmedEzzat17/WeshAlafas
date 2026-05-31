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
  const { getProductById, addProduct, updateProduct, crops } = useDashboardData();

  const existing = isEditing ? getProductById(id) : null;

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        nameEn: existing.nameEn,
        descEn: existing.descriptionEn || "",
        descAr: existing.descriptionAr || "",
        price: String(existing.price),
        stock: String(existing.quantity || 0),
        cropId: existing.cropId,
        qualityGrade: existing.qualityGrade || "A",
      };
    }
    return {
      nameEn: "",
      descEn: "",
      descAr: "",
      price: "",
      stock: "",
      cropId: crops.length > 0 ? crops[0].id : "",
      qualityGrade: "A"
    };
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (isEditing && !existing) {
    navigate("/dashboard/products");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.cropId) {
      setError(locale === "ar" ? "يرجى اختيار صنف" : "Please select a crop");
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateProduct(id, form);
      } else {
        await addProduct(form);
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
            {isEditing ? (locale === "ar" ? "تعديل الإدراج" : "Edit Listing") : (locale === "ar" ? "إضافة إدراج جديد" : "Add New Listing")}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isEditing ? (locale === "ar" ? "قم بتعديل بيانات العرض الخاص بك" : "Update your listing details") : (locale === "ar" ? "أدخل بيانات المحصول الذي تود عرضه" : "Enter details for the crop you want to list")}
          </p>
        </div>
      </div>

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
              <h3 className="dashboard-panel-title">{locale === "ar" ? "معلومات المحصول" : "Crop Information"}</h3>
            </div>
          </div>
          <div className="dashboard-panel-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "اختر المحصول" : "Select Crop"} *</label>
                <select
                  className="dashboard-select"
                  value={form.cropId}
                  onChange={(e) => setForm(p => ({ ...p, cropId: e.target.value }))}
                  required
                >
                  <option value="">{locale === "ar" ? "اختر صنفاً..." : "Select a crop..."}</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>{locale === "ar" ? c.nameAr : c.nameEn}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "جودة المنتج" : "Quality Grade"} *</label>
                <select
                  className="dashboard-select"
                  value={form.qualityGrade}
                  onChange={(e) => setForm(p => ({ ...p, qualityGrade: e.target.value }))}
                  required
                >
                  <option value="A+">A+ (Premium)</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "السعر (ج.م)" : "Price (EGP)"} *</label>
                <input className="dashboard-input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الكمية المتاحة" : "Available Quantity"} *</label>
                <input className="dashboard-input" type="number" min="0" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} required />
              </div>
            </div>

            <div>
              <label className="dashboard-label">{locale === "ar" ? "عنوان العرض (اختياري)" : "Listing Title (Optional)"}</label>
              <input className="dashboard-input" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} placeholder={locale === "ar" ? "مثال: طماطم طازجة من المزرعة" : "e.g. Fresh farm-picked tomatoes"} />
            </div>

            <div>
              <label className="dashboard-label">{locale === "ar" ? "تفاصيل إضافية" : "Additional Details"}</label>
              <textarea className="dashboard-textarea" value={form.descEn} onChange={(e) => setForm((p) => ({ ...p, descEn: e.target.value }))} rows={3} placeholder={locale === "ar" ? "معلومات حول التخزين، النقل، إلخ..." : "Storage info, transport details, etc..."} />
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
              : isEditing ? (locale === "ar" ? "حفظ التعديلات" : "Save Changes") : (locale === "ar" ? "نشر العرض" : "Publish Listing")}
          </button>
        </div>
        <style>{`.spin-icon { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </form>
    </div>
  );
}
