import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import listingsService from "../../service/api/listingsService";
import cropsService from "../../service/api/cropsService";
import { getImageUrl } from "../../utils/imageUrl";

export default function ListingsPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const location = useLocation();

  const [listings, setListings] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const queryParams = new URLSearchParams(location.search);
  const initialCrop = queryParams.get("crop_id") || "all";
  const [selectedCrop, setSelectedCrop] = useState(initialCrop);
  const [selectedStatus, setSelectedStatus] = useState("PUBLISHED");

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, [selectedCrop, selectedStatus]);

  useEffect(() => {
    // Load crops for the filter dropdown
    cropsService.getAll()
      .then(res => {
        if (res.success) setCrops(res.data);
      })
      .catch(err => console.error("Failed to load crops for filter:", err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCrop !== "all") params.crop_id = selectedCrop;
      if (selectedStatus !== "all") params.status = selectedStatus;

      const response = await listingsService.getAll(params);
      if (response.success) {
        setListings(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch listings");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCrop("all");
    setSelectedStatus("PUBLISHED");
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", fontFamily: "inherit", background: "#f8faf8", paddingBottom: 48 }}>
      {/* ══════ Page Header ══════ */}
      <div style={{ color: "#fff", background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)", paddingTop: 120, paddingBottom: 48, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1920, width: "100%", margin: "0 auto", position: "relative", zIndex: 10 }}>
          <h1 style={{ fontWeight: 700, fontSize: "clamp(24px, 4vw, 36px)" }}>
            {locale === "ar" ? "سوق العروض" : "Market Listings"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", marginTop: 8, fontSize: 16 }}>
            {locale === "ar" ? "تصفح أحدث عروض المحاصيل الزراعية" : "Browse the latest agricultural crop listings"}
          </p>
        </div>
      </div>

      {/* ══════ Main Content ══════ */}
      <div style={{ maxWidth: 1920, width: "100%", margin: "0 auto", padding: "0 16px", marginTop: -24 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          
          {/* Sidebar Filters */}
          <aside style={{ width: "100%", maxWidth: 310, flexShrink: 0, position: "sticky", top: 100, zIndex: 10 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #ececec", padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 18, marginBottom: 20, borderBottom: "1px solid #ececec" }}>
                <h2 style={{ fontWeight: 800, color: "#1f2937", fontSize: 18 }}>
                  {locale === "ar" ? "الفلاتر" : "Filters"}
                </h2>
                <button onClick={handleResetFilters} style={{ color: "rgba(46,125,50,0.8)", fontWeight: 600, transition: "color 0.2s", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}>
                  {locale === "ar" ? "إعادة ضبط" : "Reset"}
                </button>
              </div>

              {/* Crop Filter */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, color: "#1f2937", fontSize: 15, marginBottom: 12 }}>{locale === "ar" ? "المحصول" : "Crop"}</h3>
                <select 
                  value={selectedCrop} 
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", fontSize: 14, outline: "none", cursor: "pointer" }}
                >
                  <option value="all">{locale === "ar" ? "جميع المحاصيل" : "All Crops"}</option>
                  {crops.map(c => (
                    <option key={c.id} value={c.id}>{locale === "ar" ? c.name_ar : c.name_en}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontWeight: 700, color: "#1f2937", fontSize: 15, marginBottom: 12 }}>{locale === "ar" ? "الحالة" : "Status"}</h3>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #e5e7eb", backgroundColor: "#f9fafb", fontSize: 14, outline: "none", cursor: "pointer" }}
                >
                  <option value="all">{locale === "ar" ? "الكل" : "All"}</option>
                  <option value="PUBLISHED">{locale === "ar" ? "متاح (للبيع)" : "Published (Available)"}</option>
                  <option value="SOLD">{locale === "ar" ? "مباع" : "Sold"}</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div style={{ flex: 1, width: "100%", minWidth: 280 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
                <svg className="spinner" style={{ width: 40, height: 40, color: "#2E7D32", animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(46,125,50,0.2)" strokeWidth="4" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" /></svg>
              </div>
            ) : error ? (
              <div style={{ backgroundColor: "#fef2f2", color: "#ef4444", padding: 16, borderRadius: 12, textAlign: "center" }}>
                {error}
              </div>
            ) : listings.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} locale={locale} isRTL={isRTL} />
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid #ececec", padding: "40px 56px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 80, height: 80, backgroundColor: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 30, color: "#9ca3af" }}>📦</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 20, color: "#1f2937", marginBottom: 8 }}>{locale === "ar" ? "لم يتم العثور على عروض" : "No Listings Found"}</h3>
                <p style={{ color: "#6b7280", maxWidth: 320, marginBottom: 24 }}>{locale === "ar" ? "لم نجد أي عروض تطابق فلاتر البحث الخاصة بك. جرب تغييرها." : "We couldn't find any listings matching your filters."}</p>
                <button onClick={handleResetFilters} style={{ backgroundColor: "#2E7D32", color: "#fff", fontWeight: 700, padding: "10px 24px", borderRadius: 12, border: "none", cursor: "pointer" }}>
                  {locale === "ar" ? "إعادة ضبط הפلاتر" : "Reset Filters"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingCard({ listing, locale, isRTL }) {
  const title = listing.title;
  const cropName = locale === "ar" ? listing.crop?.name_ar : listing.crop?.name_en;
  const price = listing.price_per_unit || 0;
  const oldPrice = listing.comparison_price;
  const badgeColors = {
    PUBLISHED: "#22c55e",
    SPOT: "#3b82f6",
    PRE_HARVEST: "#a855f7",
    AUCTION: "#f97316",
    SOLD: "#6b7280",
  };
  const typeText = {
    SPOT: locale === "ar" ? "فوري" : "Spot",
    PRE_HARVEST: locale === "ar" ? "قبل الحصاد" : "Pre-Harvest",
    AUCTION: locale === "ar" ? "مزاد" : "Auction",
    PUBLISHED: locale === "ar" ? "متاح" : "Published",
    SOLD: locale === "ar" ? "مباع" : "Sold"
  };

  const imageSrc = getImageUrl(listing.images?.find(i => i.is_main)?.image_path || listing.image);

  return (
    <Link
      to={`/listings/${listing.id}`}
      style={{ display: "flex", flexDirection: "column", backgroundColor: "#fff", borderRadius: 16, border: "1px solid #ececec", overflow: "hidden", position: "relative", height: "100%", transition: "all 0.3s", textDecoration: "none" }}
      onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)"; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Badge List */}
      <div style={{ position: "absolute", zIndex: 10, display: "flex", flexDirection: "column", gap: 4, top: 8, [isRTL ? "right" : "left"]: 8 }}>
        {listing.type && (
          <div style={{ color: "#fff", fontWeight: 700, backgroundColor: badgeColors[listing.type] || "#2E7D32", fontSize: 10, padding: "3px 8px", borderRadius: 6 }}>
            {typeText[listing.type] || listing.type}
          </div>
        )}
        {listing.status === "SOLD" && (
          <div style={{ color: "#fff", fontWeight: 700, backgroundColor: "rgba(0,0,0,0.7)", fontSize: 10, padding: "3px 8px", borderRadius: 6 }}>
            {typeText.SOLD}
          </div>
        )}
      </div>

      {oldPrice && (
        <div style={{ position: "absolute", zIndex: 10, backgroundColor: "#ef4444", color: "#fff", fontWeight: 700, top: 8, [isRTL ? "left" : "right"]: 8, fontSize: 10, padding: "3px 8px", borderRadius: 6 }}>
          -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
        </div>
      )}

      {/* Image */}
      <div style={{ position: "relative", width: "100%", background: "linear-gradient(to bottom, #f0f5f0, #e8f0e8)", overflow: "hidden", aspectRatio: "1 / 1" }}>
        <img
          src={imageSrc}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.7s ease-out" }}
          loading="lazy"
          onError={(e) => { e.target.src = "/images/fallback.png"; }}
        />
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, padding: 16 }}>
        
        {/* Quality Grade & Crop */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
          <span style={{ backgroundColor: "#f3f4f6", color: "#4b5563", padding: "2px 8px", borderRadius: 4 }}>{cropName}</span>
          {listing.quality_grade && (
            <span style={{ color: "#d97706", display: "flex", alignItems: "center", gap: 4 }}>
              ⭐ {locale === "ar" ? "درجة " + listing.quality_grade : "Grade " + listing.quality_grade}
            </span>
          )}
        </div>

        <h3 style={{ fontWeight: 700, color: "#1f2937", lineHeight: 1.3, margin: "4px 0", fontSize: "clamp(13px, 3.5vw, 16px)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {title}
        </h3>

        <p style={{ fontWeight: 600, fontSize: 12, color: "#2E7D32", opacity: 0.8, marginBottom: 6 }}>
          {locale === "ar" ? "الكمية:" : "Quantity:"} <span style={{ color: "#374151" }}>{listing.quantity} {listing.crop?.standard_unit || ""}</span>
        </p>

        <div style={{ marginTop: "auto", paddingTop: 8, display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: "1px solid #f9fafb" }}>
          <div>
            {oldPrice > 0 && (
              <span style={{ color: "#d1d5db", textDecoration: "line-through", fontWeight: 500, display: "block", fontSize: 11, lineHeight: 1 }}>
                {oldPrice} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            )}
            <div style={{ fontWeight: 800, color: "#2E7D32", fontSize: 18, lineHeight: 1.2 }}>
              {price} <span style={{ fontWeight: 700, fontSize: 14 }}>{locale === "ar" ? "ج.م" : "EGP"}</span>
              <span style={{ color: "#9ca3af", fontWeight: 500, fontSize: 10, display: "block" }}>/ {listing.crop?.standard_unit}</span>
            </div>
          </div>

          <button
            style={{ display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", width: 36, height: 36, borderRadius: 12, backgroundColor: "#2E7D32", border: "none", color: "#fff", cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
