import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import listingsService from "../../service/api/listingsService";
import { getImageUrl } from "../../utils/imageUrl";

export default function MyListingsPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMyListings();
  }, [isAuthenticated]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await listingsService.getMine();
      if (res.success) {
        console.log("My Listings Data:", res.data);
        setListings(res.data);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      setError(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا العرض؟" : "Are you sure you want to delete this listing?")) return;
    try {
      const res = await listingsService.delete(id);
      if (res.success) {
        setListings(prev => prev.filter(l => l.id !== id));
      } else {
        alert(res.message || "Delete failed");
      }
    } catch (err) {
      alert("Error deleting listing");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", paddingTop: 128, textAlign: "center" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1f2937", marginBottom: 16 }}>
          {locale === "ar" ? "يجب تسجيل الدخول" : "Please login first"}
        </h2>
        <button onClick={() => navigate("/login")} style={{ backgroundColor: "#2E7D32", color: "#fff", fontWeight: 700, padding: "12px 32px", borderRadius: 12, border: "none", cursor: "pointer" }}>
          {locale === "ar" ? "تسجيل الدخول" : "Login"}
        </button>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", fontFamily: "inherit", backgroundColor: "#f8faf8", paddingTop: 10, paddingBottom: 48 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 10px" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
              {locale === "ar" ? "عروضي" : "My Listings"}
            </h1>
            <p style={{ color: "#6b7280" }}>
              {locale === "ar" ? "إدارة وتعديل عروض البيع الخاصة بك." : "Manage and edit your market listings."}
            </p>
          </div>
          <Link
            to="/dashboard/my-listings/new"
            style={{ backgroundColor: "#2E7D32", color: "#fff", fontWeight: 700, padding: "12px 24px", borderRadius: 12, border: "none", cursor: "pointer", textDecoration: "none", display: "inline-block", boxShadow: "0 4px 6px -1px rgba(46,125,50,0.2)" }}
          >
            {locale === "ar" ? "+ أضف عرض جديد" : "+ Add New Listing"}
          </Link>
        </div>

        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#b91c1c", padding: 16, borderRadius: 12, marginBottom: 24, border: "1px solid #f87171" }}>
            {error}
          </div>
        )}

        <div style={{ backgroundColor: "#fff", borderRadius: 20, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {loading ? (
             <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 80 }}>
              <svg className="spinner" style={{ width: 40, height: 40, color: "#2E7D32", animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(46,125,50,0.2)" strokeWidth="4" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" /></svg>
             </div>
          ) : listings.length === 0 ? (
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, backgroundColor: "#f3f4f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <span style={{ fontSize: 32 }}>📝</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>
                {locale === "ar" ? "لا توجد عروض" : "No listings yet"}
              </h3>
              <p style={{ color: "#6b7280", maxWidth: 300, margin: "0 auto 24px" }}>
                {locale === "ar" ? "ابدأ بإضافة أول عرض لك للوصول إلى المشترين المحتملين." : "Start by adding your first listing to reach potential buyers."}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: isRTL ? "right" : "left" }}>
                <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <tr>
                    <th style={{ padding: "12px 24px", color: "#6b7280", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
                      {locale === "ar" ? "المنتج" : "Product"}
                    </th>
                    <th style={{ padding: "12px 24px", color: "#6b7280", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
                      {locale === "ar" ? "النوع" : "Type"}
                    </th>
                    <th style={{ padding: "12px 24px", color: "#6b7280", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
                      {locale === "ar" ? "السعر" : "Price"}
                    </th>
                    <th style={{ padding: "12px 24px", color: "#6b7280", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
                      {locale === "ar" ? "الحالة" : "Status"}
                    </th>
                    <th style={{ padding: "12px 24px", color: "#6b7280", fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}>
                      {locale === "ar" ? "الإجراءات" : "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody style={{ divideY: "1px solid #e5e7eb" }}>
                  {listings.map(listing => (
                    <tr key={listing.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <img 
                            src={(() => {
                                const url = getImageUrl(listing.images?.find(i=>i.is_main)?.image_path || listing.image);
                                console.log(`Listing ${listing.id} Image URL:`, url);
                                return url;
                            })()}
                            alt=""
                            style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                            onError={(e) => { 
                                console.error(`Image Load Failed for listing ${listing.id}:`, e.target.src);
                                e.target.src = "/images/fallback.png"; 
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: 2 }}>{listing.title}</div>
                            <div style={{ fontSize: 13, color: "#6b7280" }}>{locale === "ar" ? listing.crop?.name_ar : listing.crop?.name_en}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: 14, color: "#4b5563" }}>
                        {listing.type}
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: 15, fontWeight: 600, color: "#1f2937" }}>
                        {listing.price_per_unit} {locale === "ar" ? "ج.م" : "EGP"}
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ 
                          padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600,
                          backgroundColor: listing.status === "PUBLISHED" ? "#dcfce7" : listing.status === "SOLD" ? "#f3f4f6" : "#fef3c7",
                          color: listing.status === "PUBLISHED" ? "#16a34a" : listing.status === "SOLD" ? "#4b5563" : "#d97706"
                        }}>
                          {listing.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Link 
                            to={`/dashboard/my-listings/edit/${listing.id}`}
                            style={{ padding: "6px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#2563eb", textDecoration: "none", display: "inline-block" }}
                          >
                            {locale === "ar" ? "تعديل" : "Edit"}
                          </Link>
                          <button 
                            onClick={() => handleDelete(listing.id)}
                            style={{ padding: "6px 12px", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", cursor: "pointer" }}
                          >
                            {locale === "ar" ? "حذف" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
