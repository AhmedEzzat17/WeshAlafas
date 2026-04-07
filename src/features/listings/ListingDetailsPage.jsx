import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import listingsService from "../../service/api/listingsService";
import { getImageUrl } from "../../utils/imageUrl";

export default function ListingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await listingsService.getById(id);
        if (res.success) {
          setListing(res.data);
          const firstImage = getImageUrl(res.data.images?.find(i => i.is_main)?.image_path || res.data.image);
          setMainImage(firstImage);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        setError(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb", paddingTop: 80 }}>
        <svg className="spinner" style={{ width: 48, height: 48, color: "#2E7D32", animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(46,125,50,0.2)" strokeWidth="4" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" /></svg>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", paddingTop: 128, paddingBottom: 80, paddingLeft: 16, paddingRight: 16, textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>{locale === "ar" ? "لم يتم العثور على العرض" : "Listing Not Found"}</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>{error}</p>
        <button onClick={() => navigate("/products")} style={{ backgroundColor: "#2E7D32", color: "#fff", fontWeight: 700, padding: "12px 32px", borderRadius: 12, border: "none", cursor: "pointer" }}>
          {locale === "ar" ? "العودة للسوق" : "Back to Market"}
        </button>
      </div>
    );
  }

  const allImages = listing.images?.length > 0 
    ? listing.images.map(img => getImageUrl(img.image_path))
    : [getImageUrl(listing.image)];

  const typeText = {
    SPOT: locale === "ar" ? "فوري" : "Spot",
    PRE_HARVEST: locale === "ar" ? "قبل الحصاد" : "Pre-Harvest",
    AUCTION: locale === "ar" ? "مزاد" : "Auction",
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", fontFamily: "inherit", backgroundColor: "#f8faf8", paddingTop: 100, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 16px" }}>
        
        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#6b7280", marginBottom: 24, fontWeight: 500 }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>{locale === "ar" ? "الرئيسية" : "Home"}</button>
          <span style={{ transform: isRTL ? "rotate(180deg)" : "none" }}>›</span>
          <button onClick={() => navigate("/products")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>{locale === "ar" ? "سوق العروض" : "Market"}</button>
          <span style={{ transform: isRTL ? "rotate(180deg)" : "none" }}>›</span>
          <span style={{ color: "#2E7D32", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{listing.title}</span>
        </nav>

        <div style={{ backgroundColor: "#fff", borderRadius: 24, padding: "clamp(24px, 4vw, 40px)", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6", marginBottom: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(24px, 5vw, 64px)" }}>
            
            {/* Left: Images */}
            <div>
              <div style={{ borderRadius: 16, overflow: "hidden", backgroundColor: "#f9fafb", border: "1px solid #f3f4f6", aspectRatio: "1 / 1", position: "relative", marginBottom: 16 }}>
                {listing.status === "SOLD" && (
                  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ backgroundColor: "#dc2626", color: "#fff", fontWeight: 900, fontSize: 24, padding: "8px 24px", borderRadius: 12, transform: "rotate(-12deg)", border: "4px solid #fff" }}>
                      {locale === "ar" ? "تم البيع" : "SOLD OUT"}
                    </span>
                  </div>
                )}
                <img 
                  src={mainImage} 
                  alt={listing.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 12, overflow: "hidden", border: mainImage === img ? "2px solid #2E7D32" : "2px solid #e5e7eb", opacity: mainImage === img ? 1 : 0.6, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontWeight: 700, padding: "4px 12px", borderRadius: 8, fontSize: 14 }}>
                  {locale === "ar" ? listing.crop?.name_ar : listing.crop?.name_en}
                </span>
                <span style={{ backgroundColor: "#dbeafe", color: "#1d4ed8", fontWeight: 700, padding: "4px 12px", borderRadius: 8, fontSize: 14 }}>
                  {typeText[listing.type] || listing.type}
                </span>
                {listing.quality_grade && (
                  <span style={{ backgroundColor: "#fef3c7", color: "#b45309", fontWeight: 700, padding: "4px 12px", borderRadius: 8, fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
                    ⭐ {locale === "ar" ? "جودة " + listing.quality_grade : "Grade " + listing.quality_grade}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 30, fontWeight: 900, color: "#1f2937", marginBottom: 16, lineHeight: 1.2 }}>{listing.title}</h1>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: "#2E7D32" }}>{listing.price_per_unit}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "ج.م" : "EGP"}</span>
                  <span style={{ color: "#6b7280", fontWeight: 500, marginLeft: 4 }}>/ {listing.crop?.standard_unit}</span>
                </div>
                {listing.comparison_price && (
                  <span style={{ color: "#9ca3af", textDecoration: "line-through", fontSize: 18, fontWeight: 500 }}>
                    {listing.comparison_price} {locale === "ar" ? "ج.م" : "EGP"}
                  </span>
                )}
              </div>

              {/* Data Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 16, columnGap: 32, marginBottom: 32 }}>
                <div>
                  <p style={{ color: "#6b7280", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{locale === "ar" ? "الكمية المتاحة" : "Available Qty"}</p>
                  <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 18 }}>{listing.quantity} {listing.crop?.standard_unit}</p>
                </div>
                <div>
                  <p style={{ color: "#6b7280", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{locale === "ar" ? "أقل كمية للطلب" : "Min Order Qty"}</p>
                  <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 18 }}>{listing.min_order_quantity} {listing.crop?.standard_unit}</p>
                </div>
                {listing.harvest_date && (
                  <div>
                    <p style={{ color: "#6b7280", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{locale === "ar" ? "تاريخ الحصاد" : "Harvest Date"}</p>
                    <p style={{ fontWeight: 600, color: "#1f2937" }}>{listing.harvest_date}</p>
                  </div>
                )}
              </div>

              <div style={{ backgroundColor: "#f9fafb", borderRadius: 16, padding: 20, marginBottom: 32 }}>
                <h3 style={{ fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>{locale === "ar" ? "الوصف" : "Description"}</h3>
                <p style={{ color: "#4b5563", lineHeight: 1.6, fontSize: 14 }}>
                  {listing.description || (locale === "ar" ? "لا يوجد وصف." : "No description provided.")}
                </p>
              </div>

              {/* Action */}
              <div style={{ marginTop: "auto" }}>
                <button 
                  disabled={listing.status === "SOLD"}
                  style={{ 
                    width: "100%", padding: 16, borderRadius: 12, fontWeight: 700, fontSize: 18, border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s",
                    backgroundColor: listing.status === "SOLD" ? "#e5e7eb" : "#2E7D32", 
                    color: listing.status === "SOLD" ? "#9ca3af" : "#fff",
                    cursor: listing.status === "SOLD" ? "not-allowed" : "pointer" 
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
                  {listing.status === "SOLD" ? (locale === "ar" ? "إنتهت الكمية" : "Sold Out") : (locale === "ar" ? "التواصل للشراء" : "Contact to Buy")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Specs */}
        {(listing.storage_information || listing.expiry_duration) && (
          <div style={{ backgroundColor: "#fff", borderRadius: 24, padding: "clamp(24px, 4vw, 40px)", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #f3f4f6" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 24 }}>{locale === "ar" ? "معلومات إضافية" : "Additional Information"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
              {listing.storage_information && (
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>❄️</div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "معلومات التخزين" : "Storage Info"}</h4>
                    <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{listing.storage_information}</p>
                  </div>
                </div>
              )}
              {listing.expiry_duration && (
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#fff7ed", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⏳</div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "مدة الصلاحية" : "Expiry Duration"}</h4>
                    <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{listing.expiry_duration}</p>
                  </div>
                </div>
              )}
              {listing.usage && (
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🍳</div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "طرق الأستخدام الموصى بها" : "Recommended Usage"}</h4>
                    <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{listing.usage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
