import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import listingsService from "../../service/api/listingsService";
import cropsService from "../../service/api/cropsService";
import toast from "react-hot-toast";

export default function ListingForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    crop_id: "",
    title: "",
    description: "",
    type: "SPOT",
    quantity: "",
    quality_grade: "",
    price_per_unit: "",
    harvest_date: "",
    storage_information: "",
    expiry_duration: "",
    usage: "",
    min_order_quantity: "",
    status: "PUBLISHED"
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    cropsService.getAll().then(res => {
      if (res.success) setCrops(res.data);
    });

    if (isEditing) {
      listingsService.getById(id).then(res => {
        if (res.success) {
          const d = res.data;
          setFormData({
            crop_id: d.crop_id || "",
            title: d.title || "",
            description: d.description || "",
            type: d.type || "SPOT",
            quantity: d.quantity || "",
            quality_grade: d.quality_grade || "",
            price_per_unit: d.price_per_unit || "",
            harvest_date: d.harvest_date || "",
            storage_information: d.storage_information || "",
            expiry_duration: d.expiry_duration || "",
            usage: d.usage || "",
            min_order_quantity: d.min_order_quantity || "",
            status: d.status || "PUBLISHED",
          });
        }
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== "") {
          data.append(key, val);
        }
      });

      if (images.length > 0) {
        data.append("image", images[0]);
        images.forEach((img, i) => {
          data.append(`images[${i}]`, img);
        });
      }

      let res;
      if (isEditing) {
        data.append('_method', 'PUT');
        res = await listingsService.update(id, data);
      } else {
        res = await listingsService.create(data);
      }

      if (res.success) {
        toast.success(locale === "ar" ? "تم حفظ العرض بنجاح!" : "Listing saved successfully!");
        navigate("/dashboard/my-listings");
      } else {
        throw res;
      }
    } catch (err) {
      console.error(err);
      if (err.errors) {
        setErrors(err.errors);
        toast.error(locale === "ar" ? "يرجى تصحيح الأخطاء في النموذج" : "Please correct the errors in the form");
      } else {
        toast.error(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: "100%", padding: 12, borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box" };
  const labelStyle = { display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6 };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", backgroundColor: "#f9fafb", paddingTop: 100, paddingBottom: 64, fontFamily: "inherit" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px" }}>
        
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>
            {isEditing ? (locale === "ar" ? "تعديل العرض" : "Edit Listing") : (locale === "ar" ? "إضافة عرض جديد" : "Add New Listing")}
          </h1>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#6b7280", fontWeight: 600, cursor: "pointer" }}>
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{locale === "ar" ? "عنوان العرض *" : "Listing Title *"}</label>
              <input name="title" value={formData.title} onChange={handleChange} required style={inputStyle} />
              {errors.title && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.title[0]}</p>}
            </div>

            <div>
              <label style={labelStyle}>{locale === "ar" ? "المحصول *" : "Crop *"}</label>
              <select name="crop_id" value={formData.crop_id} onChange={handleChange} required style={inputStyle}>
                <option value="">{locale === "ar" ? "-- اختر --" : "-- Select --"}</option>
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>
                ))}
              </select>
              {errors.crop_id && <p style={{ color: "#dc2626", fontSize: 12, marginTop: 4 }}>{errors.crop_id[0]}</p>}
            </div>

            <div>
              <label style={labelStyle}>{locale === "ar" ? "نوع العرض *" : "Listing Type *"}</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option value="SPOT">{locale === "ar" ? "فوري" : "Spot"}</option>
                <option value="PRE_HARVEST">{locale === "ar" ? "قبل الحصاد" : "Pre-Harvest"}</option>
                <option value="AUCTION">{locale === "ar" ? "مزاد" : "Auction"}</option>
              </select>
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", marginBottom: 24 }}>
            <label style={labelStyle}>{locale === "ar" ? "الوصف" : "Description"}</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>{locale === "ar" ? "الكمية *" : "Quantity *"}</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{locale === "ar" ? "أقل كمية للطلب *" : "Min Order Qty *"}</label>
              <input type="number" name="min_order_quantity" value={formData.min_order_quantity} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{locale === "ar" ? "درجة الجودة" : "Quality Grade"}</label>
              <input name="quality_grade" value={formData.quality_grade} onChange={handleChange} placeholder="e.g. A, B, Premium" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>{locale === "ar" ? "سعر الوحدة *" : "Price per Unit *"}</label>
              <input type="number" step="0.01" name="price_per_unit" value={formData.price_per_unit} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #e5e7eb" }}>
            <label style={labelStyle}>{locale === "ar" ? "صور المنتج" : "Product Images"}</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} style={inputStyle} />
            {images.length > 0 && (
              <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                {images.map((img, idx) => (
                  <img key={idx} src={URL.createObjectURL(img)} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                ))}
              </div>
            )}
          </div>

          {/* Additional details */}
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{locale === "ar" ? "معلومات إضافية (اختياري)" : "Additional Info (Optional)"}</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
            <div>
              <label style={labelStyle}>{locale === "ar" ? "تاريخ الحصاد" : "Harvest Date"}</label>
              <input type="date" name="harvest_date" value={formData.harvest_date} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{locale === "ar" ? "الحالة" : "Status"}</label>
              <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                <option value="PUBLISHED">{locale === "ar" ? "متاح (بيع)" : "Published"}</option>
                <option value="SOLD">{locale === "ar" ? "مباع" : "Sold"}</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
            <button type="button" onClick={() => navigate(-1)} style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button type="submit" disabled={loading} style={{ padding: "12px 32px", borderRadius: 8, border: "none", backgroundColor: "#2E7D32", color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : (locale === "ar" ? "حفظ" : "Save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
