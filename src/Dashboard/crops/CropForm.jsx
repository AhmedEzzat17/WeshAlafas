import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { cropsService, categoriesService } from "../../service/api";
import { useDashboardData } from "../shared/DashboardDataContext";
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sprout,
  Info,
  Layers,
  Activity
} from "lucide-react";
import toast from "react-hot-toast";

export default function CropForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { refreshCrops } = useDashboardData();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    scientific_name: "",
    category_id: "",
    standard_unit: "KG",
    description_ar: "",
    description_en: "",
    is_active: true
  });

  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoriesService.all();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    const loadCrop = async () => {
      try {
        const res = await cropsService.getById(id);
        if (res.success) {
          const d = res.data;
          setFormData({
            name_ar: d.name_ar || "",
            name_en: d.name_en || "",
            scientific_name: d.scientific_name || "",
            category_id: d.category_id || "",
            standard_unit: d.standard_unit || "KG",
            description_ar: d.description_ar || "",
            description_en: d.description_en || "",
            is_active: d.is_active ?? true
          });
          if (d.image) setImagePreview(d.image);
        }
      } catch (err) {
        toast.error(locale === "ar" ? "فشل تحميل بيانات المحصول" : "Failed to load crop data");
        navigate("/dashboard/crops");
      } finally {
        setFetching(false);
      }
    };

    loadCategories();
    if (isEditing) loadCrop();
  }, [id, isEditing, locale, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 10240 KB = 10MB
      if (file.size > 10240 * 1024) {
        toast.error(
          locale === "ar"
            ? "حجم الصورة كبير جداً! يجب ألا يتجاوز حجم الصورة 10 ميجابايت."
            : "Image size is too large! The image must not exceed 10MB."
        );
        e.target.value = ""; // Reset the input file
        return;
      }
      setMainImage(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) setErrors(prev => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (mainImage && mainImage.size > 10240 * 1024) {
      const errMsg = locale === "ar"
        ? "حجم الصورة كبير جداً! الحد الأقصى هو 10 ميجابايت."
        : "The image must not be greater than 10MB.";
      toast.error(errMsg);
      setErrors({ image: [errMsg] });
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          // Fix for boolean fields in FormData (Laravel expects 1/0 or true/false strings)
          const finalVal = key === "is_active" ? (val ? "1" : "0") : val;
          data.append(key, finalVal);
        }
      });

      if (mainImage) {
        data.append("image", mainImage);
      }

      // If Admin, the endpoint should be /admin/crops
      const res = isEditing 
        ? await cropsService.update(id, data)
        : await cropsService.create(data);

      if (res.success) {
        if (refreshCrops) await refreshCrops();
        toast.success(locale === "ar" ? "تم حفظ المحصول بنجاح!" : "Crop saved successfully!");
        navigate("/dashboard/crops");
      } else {
        throw res;
      }
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
        toast.error(locale === "ar" ? "يرجى تصحيح الأخطاء" : "Please correct the errors");
      } else {
        toast.error(err.message || (locale === "ar" ? "حدث خطأ ما" : "An error occurred"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Loader2 className="animate-spin" size={40} color="#2E7D32" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
        <button 
          onClick={() => navigate("/dashboard/crops")}
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 12, 
            border: "1px solid #E2E8F0", 
            backgroundColor: "#fff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748B"
          }}
        >
          {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a" }}>
            {isEditing ? (locale === "ar" ? "تعديل المحصول" : "Edit Crop") : (locale === "ar" ? "إضافة محصول جديد" : "Add New Crop")}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 14 }}>
            <span>{locale === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
            <ChevronRight size={14} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            <span>{locale === "ar" ? "المحاصيل" : "Crops"}</span>
            <ChevronRight size={14} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            <span style={{ color: "#2E7D32", fontWeight: 600 }}>{isEditing ? (locale === "ar" ? "تعديل" : "Edit") : (locale === "ar" ? "إضافة" : "Add")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* General Info Panel */}
          <div className="dashboard-panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ padding: 10, borderRadius: 12, backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                <Sprout size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{locale === "ar" ? "بيانات المحصول" : "Crop Details"}</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالعربية *" : "Name in Arabic *"}</label>
                <input 
                  name="name_ar"
                  value={formData.name_ar}
                  onChange={handleChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالإنجليزية *" : "Name in English *"}</label>
                <input 
                  name="name_en"
                  value={formData.name_en}
                  onChange={handleChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم العلمي" : "Scientific Name"}</label>
                <input 
                  name="scientific_name"
                  value={formData.scientific_name}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder="e.g. Solanum tuberosum"
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "التصنيف *" : "Category *"}</label>
                <select 
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="dashboard-input"
                  required
                >
                  <option value="">{locale === "ar" ? "-- اختر --" : "-- Select --"}</option>
                  {categories.filter(c => !c.parent_id).map(parent => (
                    <optgroup key={parent.id} label={locale === "ar" ? parent.name_ar : parent.name_en}>
                      <option value={parent.id}>{locale === "ar" ? parent.name_ar : parent.name_en}</option>
                      {categories.filter(child => child.parent_id === parent.id).map(child => (
                        <option key={child.id} value={child.id}>
                          &nbsp;&nbsp;&nbsp;{locale === "ar" ? child.name_ar : child.name_en}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "بلد المنشأ بالعربية" : "Origin in Arabic"}</label>
                <input 
                  name="origin_ar"
                  value={formData.origin_ar}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder={locale === "ar" ? "مثال: مزارع الإسماعيلية، مصر" : "e.g. Ismailia, Egypt"}
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "بلد المنشأ بالإنجليزية" : "Origin in English"}</label>
                <input 
                  name="origin_en"
                  value={formData.origin_en}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder={locale === "ar" ? "مثال: Ismailia, Egypt" : "e.g. Ismailia, Egypt"}
                />
              </div>
            </div>
          </div>

          {/* Descriptions Panel */}
          <div className="dashboard-panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ padding: 10, borderRadius: 12, backgroundColor: "#E3F2FD", color: "#1976D2" }}>
                <Info size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{locale === "ar" ? "وصف المحصول" : "Descriptions"}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الوصف بالعربية" : "Description in Arabic"}</label>
                <textarea 
                  name="description_ar"
                  value={formData.description_ar}
                  onChange={handleChange}
                  className="dashboard-textarea"
                  rows={4}
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الوصف بالإنجليزية" : "Description in English"}</label>
                <textarea 
                  name="description_en"
                  value={formData.description_en}
                  onChange={handleChange}
                  className="dashboard-textarea"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Image Panel */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{locale === "ar" ? "صورة المحصول" : "Crop Image"}</h3>
            
            <div 
              style={{ 
                width: "100%", 
                aspectRatio: "1/1", 
                borderRadius: 16, 
                border: "2px dashed #E2E8F0", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                backgroundColor: "#F8FAFC"
              }}
              onClick={() => document.getElementById('crop-image').click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", padding: "4px 8px", borderRadius: 8, fontSize: 12 }}>
                    {locale === "ar" ? "تغيير الصورة" : "Change"}
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 12, color: "#64748B", textAlign: "center", padding: "0 12px" }}>
                    {locale === "ar" ? "انقر للرفع" : "Click to upload"}
                  </p>
                </>
              )}
            </div>
            <input 
              id="crop-image"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: "none" }} 
            />
          </div>

          {/* Settings Panel */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
             <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{locale === "ar" ? "الإعدادات" : "Settings"}</h3>
             
             <div style={{ marginBottom: 20 }}>
                <label className="dashboard-label">{locale === "ar" ? "وحدة القياس الافتراضية" : "Default Unit"}</label>
                <select 
                  name="standard_unit" 
                  value={formData.standard_unit} 
                  onChange={handleChange} 
                  className="dashboard-input"
                >
                  <option value="KG">{locale === "ar" ? "كيلوجرام" : "Kilogram"}</option>
                  <option value="TON">{locale === "ar" ? "طن" : "Ton"}</option>
                  <option value="FEDDAN">{locale === "ar" ? "فدان" : "Feddan"}</option>
                  <option value="BAG">{locale === "ar" ? "شوال" : "Bag"}</option>
                  <option value="PIECE">{locale === "ar" ? "قطعة" : "Piece"}</option>
                </select>
             </div>

             <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <input 
                  type="checkbox" 
                  id="is_active" 
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  style={{ width: 18, height: 18, accentColor: "#2E7D32" }}
                />
                <label htmlFor="is_active" style={{ fontSize: 14, fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                  {locale === "ar" ? "تفعيل المحصول" : "Is Active"}
                </label>
             </div>

             <button 
              type="submit" 
              disabled={loading}
              className="dashboard-btn dashboard-btn--primary"
              style={{ width: "100%", height: 48, gap: 10 }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {locale === "ar" ? "حفظ البيانات" : "Save Details"}</>}
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard/crops")}
              className="dashboard-btn dashboard-btn--outline"
              style={{ width: "100%", height: 48, marginTop: 12 }}
            >
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
