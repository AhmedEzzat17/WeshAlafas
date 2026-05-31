import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { categoriesService } from "../../service/api";
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon 
} from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";
import toast from "react-hot-toast";

export default function CategoryForm() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    is_active: true
  });

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const res = await categoriesService.getById(id);
      if (res.success && res.data) {
        const category = res.data;
        setImagePreview(getImageUrl(category.image) || null);
        setFormData({
          name_en: typeof category.name === 'object' ? (category.name?.en || "") : (category.name_en || category.name || ""),
          name_ar: typeof category.name === 'object' ? (category.name?.ar || "") : (category.name_ar || ""),
          description_en: typeof category.description === 'object' ? (category.description?.en || "") : (category.description_en || category.description || ""),
          description_ar: typeof category.description === 'object' ? (category.description?.ar || "") : (category.description_ar || ""),
          is_active: category.is_active ?? true
        });
      } else {
        toast.error(locale === "ar" ? "لم يتم العثور على التصنيف" : "Category not found");
        navigate("/dashboard/categories");
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل التصنيف" : "Failed to load category");
      navigate("/dashboard/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10240 * 1024) {
        toast.error(
          locale === "ar"
            ? "حجم الصورة كبير جداً! يجب ألا يتجاوز حجم الصورة 10 ميجابايت."
            : "Image size is too large! The image must not exceed 10MB."
        );
        e.target.value = "";
        return;
      }
      setImageFile(file);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: null }));
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (imageFile && imageFile.size > 10240 * 1024) {
      const errMsg = locale === "ar"
        ? "حجم الصورة كبير جداً! الحد الأقصى هو 10 ميجابايت."
        : "The image must not be greater than 10MB.";
      toast.error(errMsg);
      setErrors({ image: [errMsg] });
      return;
    }
    setSubmitting(true);
    
    try {
      const data = new FormData();
      // Support both styles: flat and nested arrays (translatable)
      data.append("name_en", formData.name_en);
      data.append("name_ar", formData.name_ar);
      data.append("name[en]", formData.name_en);
      data.append("name[ar]", formData.name_ar);
      
      data.append("description_en", formData.description_en || "");
      data.append("description_ar", formData.description_ar || "");
      data.append("description[en]", formData.description_en || "");
      data.append("description[ar]", formData.description_ar || "");
      
      data.append("is_active", formData.is_active ? "1" : "0");
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = isEditing 
        ? await categoriesService.update(id, data)
        : await categoriesService.create(data);
        
      if (res.success) {
        toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Category saved successfully");
        navigate("/dashboard/categories");
      } else {
        throw res;
      }
    } catch (err) {
      console.error("Category save error:", err);
      if (err.errors) {
        setErrors(err.errors);
        // Combine validation error messages to show in toast
        const errorMsgs = Object.entries(err.errors)
          .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg[0] : msg}`)
          .join(" | ");
        toast.error(errorMsgs || (locale === "ar" ? "يرجى تصحيح الأخطاء" : "Please correct the errors"));
      } else {
        toast.error(err.message || (locale === "ar" ? "فشل الحفظ" : "Failed to save"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Loader2 className="animate-spin" size={40} style={{ color: "#2E7D32" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", paddingBottom: 40 }} className="dashboard-animate-in">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate("/dashboard/categories")} className="dashboard-btn dashboard-btn--outline" style={{ padding: "8px 12px", borderRadius: 10 }}>
          <BackIcon size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {isEditing ? (locale === "ar" ? "تعديل التصنيف" : "Edit Category") : (locale === "ar" ? "إضافة تصنيف جديد" : "Add New Category")}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isEditing ? (locale === "ar" ? "قم بتحديث بيانات هذا التصنيف." : "Update category details.") : (locale === "ar" ? "أدخل بيانات التصنيف لإنشائه." : "Enter category details to create it.")}
          </p>
        </div>
      </div>

      <div className="dashboard-panel" style={{ padding: "32px" }}>
        <form id="categoryForm" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Visual Identity Section */}
          <div style={{ padding: 20, background: "#F8FAFC", borderRadius: 12, border: "1px dashed #CBD5E1" }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 16 }}>
              {locale === "ar" ? "صورة التصنيف" : "Category Image"}
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  width: 90, height: 90, borderRadius: 12, 
                  background: imagePreview ? `url(${imagePreview}) center/cover` : "#FFF", 
                  border: "1px solid #E2E8F0", display: "flex", alignItems: "center", 
                  justifyContent: "center", cursor: "pointer", flexShrink: 0,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}
              >
                {!imagePreview && <Upload size={24} color="#94A3B8" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12, lineHeight: 1.5 }}>
                  {locale === "ar" 
                    ? "قم برفع صورة تعبر عن التصنيف (يفضل بصيغة PNG أو JPG)" 
                    : "Upload an image that represents this category (PNG or JPG)"}
                </p>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="dashboard-btn dashboard-btn--outline"
                  style={{ padding: "8px 16px", fontSize: 13, height: "auto", borderRadius: 8 }}
                >
                  <ImageIcon size={16} />
                  {locale === "ar" ? "اختر صورة" : "Choose Image"}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: "none" }} 
                />
              </div>
            </div>
            {errors.image && (
              <p style={{ color: "#EF4444", fontSize: 12, marginTop: 12, display: "block" }}>
                {Array.isArray(errors.image) ? errors.image[0] : errors.image}
              </p>
            )}
          </div>

          {/* Core Info Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الاسم (English)" : "Name (English)"} *</label>
              <input 
                type="text" 
                className="dashboard-input" 
                required 
                value={formData.name_en} 
                onChange={(e) => {
                  setFormData({...formData, name_en: e.target.value});
                  if (errors.name_en || errors["name.en"]) setErrors(prev => ({ ...prev, name_en: null, "name.en": null }));
                }} 
              />
              {(errors.name_en || errors["name.en"]) && (
                <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
                  {errors.name_en || errors["name.en"]}
                </p>
              )}
            </div>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الاسم (عربي)" : "Name (Arabic)"} *</label>
              <input 
                type="text" 
                className="dashboard-input" 
                required 
                value={formData.name_ar} 
                onChange={(e) => {
                  setFormData({...formData, name_ar: e.target.value});
                  if (errors.name_ar || errors["name.ar"]) setErrors(prev => ({ ...prev, name_ar: null, "name.ar": null }));
                }} 
              />
              {(errors.name_ar || errors["name.ar"]) && (
                <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
                  {errors.name_ar || errors["name.ar"]}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الوصف (English)" : "Description (English)"}</label>
              <textarea 
                className="dashboard-textarea" 
                rows={3} 
                value={formData.description_en} 
                onChange={(e) => {
                  setFormData({...formData, description_en: e.target.value});
                  if (errors.description_en || errors["description.en"]) setErrors(prev => ({ ...prev, description_en: null, "description.en": null }));
                }} 
              />
              {(errors.description_en || errors["description.en"]) && (
                <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
                  {errors.description_en || errors["description.en"]}
                </p>
              )}
            </div>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</label>
              <textarea 
                className="dashboard-textarea" 
                rows={3} 
                value={formData.description_ar} 
                onChange={(e) => {
                  setFormData({...formData, description_ar: e.target.value});
                  if (errors.description_ar || errors["description.ar"]) setErrors(prev => ({ ...prev, description_ar: null, "description.ar": null }));
                }} 
              />
              {(errors.description_ar || errors["description.ar"]) && (
                <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
                  {errors.description_ar || errors["description.ar"]}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px", background: formData.is_active ? "#F0FDF4" : "#F8FAFC", borderRadius: 8, border: `1px solid ${formData.is_active ? "#BBF7D0" : "#E2E8F0"}` }}>
            <input type="checkbox" id="isActiveToggle" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#2E7D32" }} />
            <label htmlFor="isActiveToggle" style={{ fontSize: 14, fontWeight: 600, color: formData.is_active ? "#166534" : "#64748B", cursor: "pointer", userSelect: "none", flex: 1 }}>
              {locale === "ar" ? "تفعيل وإظهار هذا التصنيف للمستخدمين" : "Activate and show this category to users"}
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8, paddingTop: 24, borderTop: "1px solid #F1F5F9" }}>
            <button type="button" onClick={() => navigate("/dashboard/categories")} className="dashboard-btn dashboard-btn--outline">
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={submitting} className="dashboard-btn dashboard-btn--primary" style={{ gap: 8, padding: "0 24px" }}>
              {submitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {locale === "ar" ? "حفظ التصنيف" : "Save Category"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
