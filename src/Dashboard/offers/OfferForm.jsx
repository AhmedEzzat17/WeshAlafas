import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { offersService, listingsService } from "../../service/api";
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Upload, 
  Tag, 
  Package,
  Search,
  Check,
  X,
  Plus
} from "lucide-react";
import toast from "react-hot-toast";

export default function OfferForm() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  
  // Image handling
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_type: "PERCENTAGE",
    discount_value: "",
    starts_at: "",
    ends_at: "",
    is_active: true,
    listing_ids: []
  });

  // Listings Selection State
  const [availableListings, setAvailableListings] = useState([]);
  const [listingSearch, setListingSearch] = useState("");
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    fetchMyListings();
    if (isEditing) {
      fetchOffer();
    }
  }, [id]);

  const fetchMyListings = async () => {
    setLoadingListings(true);
    try {
      const res = await listingsService.getMine();
      if (res.success) {
        setAvailableListings(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setLoadingListings(false);
    }
  };

  const fetchOffer = async () => {
    try {
      const res = await offersService.getById(id);
      if (res.success && res.data.offer) {
        const offer = res.data.offer;
        setImagePreview(offer.image_url);
          setFormData({
            name: offer.name,
            description: offer.description || "",
            discount_type: offer.discount_type,
            discount_value: offer.discount_value,
            starts_at: offer.starts_at ? offer.starts_at.substring(0, 16) : "",
            ends_at: offer.ends_at ? offer.ends_at.substring(0, 16) : "",
            is_active: offer.is_active,
            listing_ids: (offer.listings || []).map(l => l.id)
          });
          if (offer.images && offer.images.length > 0) {
            setGalleryPreviews(offer.images.map(img => getImageUrl(img.image_path)));
          }
        }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل العرض" : "Failed to load offer");
      navigate("/dashboard/offers");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleListingSelection = (listingId) => {
    setFormData(prev => {
      const isSelected = prev.listing_ids.includes(listingId);
      const newIds = isSelected 
        ? prev.listing_ids.filter(id => id !== listingId)
        : [...prev.listing_ids, listingId];
      return { ...prev, listing_ids: newIds };
    });
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.listing_ids.length === 0) {
      toast.error(locale === "ar" ? "يجب اختيار منتج واحد على الأقل" : "Select at least one product");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("discount_type", formData.discount_type);
      data.append("discount_value", formData.discount_value);
      data.append("is_active", formData.is_active ? 1 : 0);
      
      if (formData.starts_at) data.append("starts_at", formData.starts_at);
      if (formData.ends_at) data.append("ends_at", formData.ends_at);
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      // Important: Appending array elements individually for multipart/form-data
      formData.listing_ids.forEach(id => {
        data.append("listing_ids[]", id);
      });

      galleryImages.forEach(file => {
        data.append("images[]", file);
      });

      const res = isEditing 
        ? await offersService.update(id, data)
        : await offersService.create(data);
        
      if (res.success) {
        toast.success(locale === "ar" ? "تم الحفظ بنجاح" : "Offer saved successfully");
        navigate("/dashboard/offers");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || (locale === "ar" ? "فشل الحفظ" : "Failed to save"));
    } finally {
      setSubmitting(false);
    }
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const filteredListings = availableListings.filter(l => 
    l.title?.toLowerCase().includes(listingSearch.toLowerCase()) ||
    l.crop?.name_ar?.includes(listingSearch) ||
    l.crop?.name_en?.toLowerCase().includes(listingSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Loader2 className="animate-spin" size={40} style={{ color: "#2E7D32" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 40 }} className="dashboard-animate-in">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate("/dashboard/offers")} className="dashboard-btn dashboard-btn--outline" style={{ padding: "8px 12px", borderRadius: 10 }}>
          <BackIcon size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {isEditing ? (locale === "ar" ? "تعديل العرض" : "Edit Offer") : (locale === "ar" ? "إضافة عرض جديد" : "Add New Offer")}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isEditing ? (locale === "ar" ? "تحديث تفاصيل العرض والمنتجات." : "Update offer details and products.") : (locale === "ar" ? "أدخل تفاصيل العرض وحدد المنتجات المشمولة." : "Enter offer details and select included products.")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        
        {/* Left Column: Form Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Tag size={18} color="#2E7D32" />
              {locale === "ar" ? "معلومات العرض" : "Offer Details"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "اسم العرض" : "Offer Name"} *</label>
                <input type="text" className="dashboard-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder={locale === "ar" ? "مثال: خصم الصيف الكبير" : "e.g. Summer Mega Discount"} />
              </div>

              <div>
                <label className="dashboard-label">{locale === "ar" ? "وصف العرض" : "Description"}</label>
                <textarea className="dashboard-textarea" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder={locale === "ar" ? "اكتب تفاصيل العرض هنا..." : "Write offer details here..."} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "نوع الخصم" : "Discount Type"}</label>
                  <select className="dashboard-input" value={formData.discount_type} onChange={(e) => setFormData({...formData, discount_type: e.target.value})}>
                    <option value="PERCENTAGE">{locale === "ar" ? "نسبة مئوية (%)" : "Percentage (%)"}</option>
                    <option value="FIXED">{locale === "ar" ? "مبلغ ثابت (ج.م)" : "Fixed Amount (EGP)"}</option>
                  </select>
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "قيمة الخصم" : "Discount Value"}</label>
                  <input type="number" className="dashboard-input" required value={formData.discount_value} onChange={(e) => setFormData({...formData, discount_value: e.target.value})} placeholder="0.00" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "تاريخ البدء" : "Start Date"}</label>
                  <input type="datetime-local" className="dashboard-input" value={formData.starts_at} onChange={(e) => setFormData({...formData, starts_at: e.target.value})} />
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "تاريخ الانتهاء" : "End Date"}</label>
                  <input type="datetime-local" className="dashboard-input" value={formData.ends_at} onChange={(e) => setFormData({...formData, ends_at: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <Package size={18} color="#2E7D32" />
              {locale === "ar" ? "المنتجات المشمولة في العرض" : "Included Products"}
              <span style={{ fontSize: 12, color: "#2E7D32", background: "#E8F5E9", padding: "2px 8px", borderRadius: 12, fontWeight: 800 }}>
                {formData.listing_ids.length}
              </span>
            </h3>

            <div style={{ marginBottom: 16, position: "relative" }}>
              <Search size={16} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 12 }} />
              <input 
                type="text" 
                className="dashboard-input" 
                style={{ paddingLeft: isRTL ? 12 : 36, paddingRight: isRTL ? 36 : 12, height: 40, fontSize: 13 }}
                placeholder={locale === "ar" ? "ابحث عن منتج لإضافته..." : "Search product to add..."}
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 400, overflowY: "auto", padding: 2 }}>
              {loadingListings ? (
                <div style={{ padding: 20, textAlign: "center" }}><Loader2 className="animate-spin" size={24} color="#2E7D32" /></div>
              ) : filteredListings.length > 0 ? (
                filteredListings.map(listing => {
                  const isSelected = formData.listing_ids.includes(listing.id);
                  return (
                    <div 
                      key={listing.id} 
                      onClick={() => toggleListingSelection(listing.id)}
                      style={{ 
                        display: "flex", alignItems: "center", gap: 12, padding: 12, 
                        borderRadius: 12, border: isSelected ? "2px solid #2E7D32" : "1px solid #E2E8F0",
                        background: isSelected ? "#F0FDF4" : "#fff",
                        cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                        <img src={listing.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{listing.title}</p>
                        <p style={{ fontSize: 12, color: "#64748b" }}>
                          {listing.price_per_unit} ج.م / {listing.crop?.standard_unit || (locale === "ar" ? "وحدة" : "unit")}
                        </p>
                      </div>
                      <div style={{ 
                        width: 20, height: 20, borderRadius: 6, border: "1.5px solid #CBD5E1",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isSelected ? "#2E7D32" : "transparent",
                        borderColor: isSelected ? "#2E7D32" : "#CBD5E1"
                      }}>
                        {isSelected && <Check size={14} color="#fff" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: "center", color: "#94A3B8", padding: 20 }}>{locale === "ar" ? "لا توجد منتجات مطابقة" : "No matching products"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Image & Status) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="dashboard-panel" style={{ padding: 20 }}>
            <label className="dashboard-label" style={{ marginBottom: 12 }}>{locale === "ar" ? "صورة العرض" : "Offer Image"}</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                width: '100%', aspectRatio: '1/1', borderRadius: 12, 
                background: imagePreview ? `url(${imagePreview}) center/cover` : "#F8FAFC", 
                border: "1.5px dashed #CBD5E1", display: "flex", alignItems: "center", 
                justifyContent: "center", cursor: "pointer", position: "relative"
              }}
            >
              {!imagePreview && (
                <div style={{ textAlign: "center" }}>
                  <Upload size={32} color="#94A3B8" style={{ margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 12, color: "#94A3B8" }}>{locale === "ar" ? "ارفع صورة" : "Upload Image"}</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} />
          </div>

          <div className="dashboard-panel" style={{ padding: 20 }}>
            <label className="dashboard-label" style={{ marginBottom: 12 }}>{locale === "ar" ? "صور إضافية للعرض" : "Additional Images"}</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8, marginBottom: 12 }}>
              {galleryPreviews.map((src, idx) => (
                <div key={idx} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button 
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    style={{ position: "absolute", top: 2, right: 2, background: "rgba(239, 68, 68, 0.9)", color: "white", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label style={{ 
                aspectRatio: "1/1", borderRadius: 8, border: "1.5px dashed #CBD5E1", 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                cursor: "pointer", color: "#64748B", transition: "all 0.2s" 
              }}>
                <input type="file" multiple onChange={handleGalleryChange} style={{ display: "none" }} accept="image/*" />
                <span style={{ fontSize: 20 }}>+</span>
              </label>
            </div>
          </div>

          <div className="dashboard-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="checkbox" id="offerActive" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} style={{ width: 18, height: 18, accentColor: "#2E7D32" }} />
              <label htmlFor="offerActive" style={{ fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{locale === "ar" ? "تفعيل العرض" : "Active Offer"}</label>
            </div>
          </div>

          <button type="submit" onClick={handleSubmit} disabled={submitting} className="dashboard-btn dashboard-btn--primary" style={{ width: "100%", height: 50, gap: 10, fontSize: 16 }}>
            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {locale === "ar" ? "حفظ العرض" : "Save Offer"}
          </button>
        </div>

      </form>
    </div>
  );
}
