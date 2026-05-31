import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { listingsService, cropsService } from "../../service/api";
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
  Package,
  Tag,
  Info,
  Calendar,
  Layers,
  BarChart3,
  Plus
} from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";
import toast from "react-hot-toast";

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

function encodeOrigin(text, originAr, originEn) {
  let cleaned = (text || "")
    .replace(/\[originAr:.*?\]/g, "")
    .replace(/\[originEn:.*?\]/g, "")
    .trim();
  if (originAr) cleaned += ` [originAr:${originAr}]`;
  if (originEn) cleaned += ` [originEn:${originEn}]`;
  return cleaned;
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

function encodeBilingual(ar, en) {
  if (!ar && !en) return "";
  if (!ar) return en;
  if (!en) return ar;
  return `[ar:${ar}][en:${en}]`;
}

export default function ListingForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { refreshProducts } = useDashboardData();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [crops, setCrops] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState({
    crop_id: "",
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    type: "SPOT",
    quantity: "",
    quality_grade: "",
    price_per_unit: "",
    harvest_date: "",
    storage_information_ar: "",
    storage_information_en: "",
    expiry_duration: "",
    usage: "",
    min_order_quantity: "",
    status: "PUBLISHED",
    origin_ar: "",
    origin_en: ""
  });

  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const loadCrops = async () => {
      try {
        const res = await cropsService.getAll();
        if (res.success) setCrops(res.data);
      } catch (err) {
        console.error("Failed to load crops", err);
      }
    };

    const loadListing = async () => {
      try {
        const res = await listingsService.getById(id);
        if (res.success) {
          const d = res.data;
          const parsed = parseOrigin(d.storage_information || "");
          const parsedStorageText = parseBilingualText(parsed.text);
          const parsedTitle = parseBilingualText(d.title || "");
          const parsedDesc = parseBilingualText(d.description || "");
          setFormData({
            crop_id: d.crop_id || "",
            title_ar: parsedTitle.ar || parsedTitle.original || "",
            title_en: parsedTitle.en || parsedTitle.original || "",
            description_ar: parsedDesc.ar || parsedDesc.original || "",
            description_en: parsedDesc.en || parsedDesc.original || "",
            type: d.type || "SPOT",
            quantity: d.quantity || "",
            quality_grade: d.quality_grade || "",
            price_per_unit: d.price_per_unit || "",
            harvest_date: d.harvest_date || "",
            storage_information_ar: parsedStorageText.ar || parsedStorageText.original || "",
            storage_information_en: parsedStorageText.en || parsedStorageText.original || "",
            expiry_duration: d.expiry_duration || "",
            usage: d.usage || "",
            min_order_quantity: d.min_order_quantity || "",
            status: d.status || "PUBLISHED",
            origin_ar: parsed.originAr || "",
            origin_en: parsed.originEn || ""
          });
          if (d.image) setImagePreview(getImageUrl(d.image));
          
          // Load gallery if exists
          if (d.images && d.images.length > 0) {
            setGalleryPreviews(d.images.map(img => getImageUrl(img.image_url || img.image_path)));
          }
        }
      } catch (err) {
        toast.error(locale === "ar" ? "فشل تحميل بيانات العرض" : "Failed to load listing data");
        navigate("/dashboard/my-listings");
      } finally {
        setFetching(false);
      }
    };

    loadCrops();
    if (isEditing) loadListing();
  }, [id, isEditing, locale, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
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
      setMainImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const oversizedFiles = files.filter(f => f.size > 10240 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(
        locale === "ar"
          ? "بعض الصور كبيرة جداً! يجب ألا تتجاوز أي صورة في المعرض 10 ميجابايت."
          : "Some images are too large! No gallery image can exceed 10MB."
      );
      return;
    }
    if (files.length > 0) {
      setGalleryImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mainImage && mainImage.size > 10240 * 1024) {
      toast.error(
        locale === "ar"
          ? "حجم الصورة كبير جداً! الحد الأقصى هو 10 ميجابايت."
          : "The image must not be greater than 10MB."
      );
      return;
    }
    const oversizedGallery = galleryImages.some(f => f.size > 10240 * 1024);
    if (oversizedGallery) {
      toast.error(
        locale === "ar"
          ? "يوجد صور في المعرض تتجاوز حجم 10 ميجابايت."
          : "Some gallery images exceed 10MB."
      );
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();
      
      const encodedStorageInfo = encodeBilingual(formData.storage_information_ar, formData.storage_information_en);
      // Encode origin into storage_information
      const finalStorageInfo = encodeOrigin(
        encodedStorageInfo,
        formData.origin_ar,
        formData.origin_en
      );

      // Clone formData and replace storage_information
      const submissionData = {
        ...formData,
        title: encodeBilingual(formData.title_ar, formData.title_en),
        description: encodeBilingual(formData.description_ar, formData.description_en),
        storage_information: finalStorageInfo
      };
      
      // Delete origin fields from submission payload
      delete submissionData.title_ar;
      delete submissionData.title_en;
      delete submissionData.description_ar;
      delete submissionData.description_en;
      delete submissionData.storage_information_ar;
      delete submissionData.storage_information_en;
      delete submissionData.origin_ar;
      delete submissionData.origin_en;

      // Basic fields
      Object.entries(submissionData).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          data.append(key, val);
        }
      });

      // Main image
      if (mainImage) {
        data.append("image", mainImage);
      }

      // Gallery images
      galleryImages.forEach((file) => {
        data.append("images[]", file);
      });

      // Standard handling in service for multipart update
      // if (isEditing) {
      //   data.append("_method", "PUT");
      // }

      const res = isEditing 
        ? await listingsService.update(id, data)
        : await listingsService.create(data);

      if (res.success) {
        if (refreshProducts) await refreshProducts();
        toast.success(locale === "ar" ? "تم حفظ العرض بنجاح!" : "Listing saved successfully!");
        navigate("/dashboard/my-listings");
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
          onClick={() => navigate("/dashboard/my-listings")}
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
            {isEditing ? (locale === "ar" ? "تعديل العرض" : "Edit Listing") : (locale === "ar" ? "إضافة عرض جديد" : "Add New Listing")}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 14 }}>
            <span>{locale === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
            <ChevronRight size={14} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            <span>{locale === "ar" ? "عروضي" : "My Listings"}</span>
            <ChevronRight size={14} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            <span style={{ color: "#2E7D32", fontWeight: 600 }}>{isEditing ? (locale === "ar" ? "تعديل" : "Edit") : (locale === "ar" ? "إضافة" : "Add")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        
        {/* Main Form Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Basic Info Panel */}
          <div className="dashboard-panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ padding: 10, borderRadius: 12, backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                <Info size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{locale === "ar" ? "المعلومات الأساسية" : "Basic Information"}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "عنوان العرض (عربي) *" : "Listing Title (Arabic) *"}</label>
                  <input 
                    name="title_ar"
                    value={formData.title_ar}
                    onChange={handleChange}
                    className="dashboard-input"
                    placeholder={locale === "ar" ? "مثلاً: محصول بطاطس ممتاز" : "e.g. Premium Potato Crop"}
                    required
                  />
                  {errors.title && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.title[0]}</p>}
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "عنوان العرض (إنجليزي) *" : "Listing Title (English) *"}</label>
                  <input 
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleChange}
                    className="dashboard-input"
                    placeholder={locale === "ar" ? "مثلاً: Premium Potato Crop" : "e.g. Premium Potato Crop"}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "المحصول *" : "Crop *"}</label>
                  <select 
                    name="crop_id"
                    value={formData.crop_id}
                    onChange={handleChange}
                    className="dashboard-input"
                    required
                  >
                    <option value="">{locale === "ar" ? "-- اختر المحصول --" : "-- Select Crop --"}</option>
                    {[...new Set(crops.map(c => c.category_id))].map(catId => {
                      const category = crops.find(c => c.category_id === catId)?.category;
                      const categoryName = locale === "ar" ? category?.name_ar : category?.name_en;
                      const categoryCrops = crops.filter(c => c.category_id === catId);
                      
                      return (
                        <optgroup key={catId} label={categoryName || (locale === "ar" ? "غير مصنف" : "Uncategorized")}>
                          {categoryCrops.map(c => (
                            <option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                  {errors.crop_id && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.crop_id[0]}</p>}
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "نوع العرض *" : "Listing Type *"}</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="dashboard-input">
                    <option value="SPOT">{locale === "ar" ? "فوري (متاح حالياً)" : "Spot (Available Now)"}</option>
                    <option value="PRE_HARVEST">{locale === "ar" ? "قبل الحصاد" : "Pre-Harvest"}</option>
                    <option value="AUCTION">{locale === "ar" ? "مزاد" : "Auction"}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</label>
                  <textarea 
                    name="description_ar"
                    value={formData.description_ar}
                    onChange={handleChange}
                    className="dashboard-textarea"
                    rows={4}
                    placeholder={locale === "ar" ? "تفاصيل إضافية عن المحصول، الجودة، طرق التعبئة..." : "Additional details about crop, quality, packaging..."}
                  />
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}</label>
                  <textarea 
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    className="dashboard-textarea"
                    rows={4}
                    placeholder={locale === "ar" ? "تفاصيل إضافية عن المحصول..." : "Additional details about crop..."}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Quantity Panel */}
          <div className="dashboard-panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ padding: 10, borderRadius: 12, backgroundColor: "#FFF8E1", color: "#F57C00" }}>
                <Tag size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{locale === "ar" ? "السعر والكمية" : "Pricing & Quantity"}</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "السعر لكل وحدة (ج.م) *" : "Price per Unit (EGP) *"}</label>
                <input 
                  type="number"
                  step="0.01"
                  name="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={handleChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الكمية الكلية *" : "Total Quantity *"}</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input 
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="dashboard-input"
                    style={{ flex: 1 }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "أقل كمية للطلب *" : "Min Order Qty *"}</label>
                <input 
                  type="number"
                  name="min_order_quantity"
                  value={formData.min_order_quantity}
                  onChange={handleChange}
                  className="dashboard-input"
                  required
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "درجة الجودة" : "Quality Grade"}</label>
                <select 
                  name="quality_grade"
                  value={formData.quality_grade}
                  onChange={handleChange}
                  className="dashboard-input"
                >
                  <option value="">{locale === "ar" ? "-- اختر الجودة --" : "-- Select Quality --"}</option>
                  <option value="A">{locale === "ar" ? "درجة أ (ممتاز)" : "Grade A (Premium)"}</option>
                  <option value="B">{locale === "ar" ? "درجة ب (جيد جداً)" : "Grade B (Very Good)"}</option>
                  <option value="C">{locale === "ar" ? "درجة ج (جيد)" : "Grade C (Good)"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logistics Panel */}
          <div className="dashboard-panel" style={{ padding: 32 }}>
             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ padding: 10, borderRadius: 12, backgroundColor: "#E3F2FD", color: "#1976D2" }}>
                <Package size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{locale === "ar" ? "الخدمات اللوجستية" : "Logistics & Details"}</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
               <div>
                <label className="dashboard-label">{locale === "ar" ? "تاريخ الحصاد" : "Harvest Date"}</label>
                <input 
                  type="date"
                  name="harvest_date"
                  value={formData.harvest_date}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "مدة الصلاحية" : "Expiry Duration"}</label>
                <input 
                  name="expiry_duration"
                  value={formData.expiry_duration}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder='e.g. 15 Days'
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "بلد المنشأ بالعربية" : "Origin in Arabic"}</label>
                <input 
                  name="origin_ar"
                  value={formData.origin_ar}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder={locale === "ar" ? "مثلاً: مزارع الإسماعيلية، مصر" : "e.g. Ismailia, Egypt"}
                />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "بلد المنشأ بالإنجليزية" : "Origin in English"}</label>
                <input 
                  name="origin_en"
                  value={formData.origin_en}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder={locale === "ar" ? "مثلاً: Egypt" : "e.g. Egypt"}
                />
              </div>
              <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "معلومات التخزين (عربي)" : "Storage Info (Arabic)"}</label>
                  <input 
                    name="storage_information_ar"
                    value={formData.storage_information_ar}
                    onChange={handleChange}
                    className="dashboard-input"
                    placeholder={locale === "ar" ? "مثلاً: يحفظ في مكان بارد وجاف" : "e.g. Store in a cool dry place"}
                  />
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "معلومات التخزين (إنجليزي)" : "Storage Info (English)"}</label>
                  <input 
                    name="storage_information_en"
                    value={formData.storage_information_en}
                    onChange={handleChange}
                    className="dashboard-input"
                    placeholder={locale === "ar" ? "مثلاً: Store in a cool dry place" : "e.g. Store in a cool dry place"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions & Image */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Image Upload Panel */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{locale === "ar" ? "الصورة الرئيسية" : "Main Image"}</h3>
            
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
                backgroundColor: "#F8FAFC",
                marginBottom: 20
              }}
              onClick={() => document.getElementById('image-upload').click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.5)", color: "#fff", padding: "4px 8px", borderRadius: 8, fontSize: 12 }}>
                    {locale === "ar" ? "تغيير الصورة" : "Change Image"}
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon size={40} color="#94A3B8" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 13, color: "#64748B", textAlign: "center", padding: "0 16px" }}>
                    {locale === "ar" ? "انقر للاختيار" : "Click to select"}
                  </p>
                </>
              )}
            </div>
            <input 
              id="image-upload"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: "none" }} 
            />

            {/* Gallery Images */}
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 24 }}>{locale === "ar" ? "معرض الصور" : "Photo Gallery"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              {galleryPreviews.map((preview, index) => (
                <div key={index} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  <img src={preview} alt={`Gallery ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button 
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.8)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => document.getElementById('gallery-upload').click()}
                style={{ aspectRatio: "1/1", borderRadius: 8, border: "2px dashed #CBD5E1", backgroundColor: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", cursor: "pointer" }}
              >
                <Plus size={20} />
              </button>
            </div>
            <input 
              id="gallery-upload"
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleGalleryChange} 
              style={{ display: "none" }} 
            />
          </div>

          {/* Status Panel */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{locale === "ar" ? "الحالة والنشر" : "Status & Publishing"}</h3>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="dashboard-input"
              style={{ marginBottom: 20 }}
            >
              <option value="PUBLISHED">{locale === "ar" ? "نشط (معروض للبيع)" : "Published (Active)"}</option>
              <option value="DRAFT">{locale === "ar" ? "مسودة" : "Draft"}</option>
              <option value="SOLD">{locale === "ar" ? "تم البيع" : "Sold"}</option>
            </select>

            <button 
              type="submit" 
              disabled={loading}
              className="dashboard-btn dashboard-btn--primary"
              style={{ width: "100%", height: 48, gap: 10 }}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? (locale === "ar" ? "تحديث العرض" : "Update Listing") : (locale === "ar" ? "نشر العرض" : "Publish Listing")}
                </>
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate("/dashboard/my-listings")}
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
