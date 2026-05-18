import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { listingsService } from "../../service/api";
import { getImageUrl } from "../../utils/imageUrl";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  Tag, 
  Layers, 
  Calendar,
  Loader2,
  ChevronRight,
  TrendingUp,
  MapPin
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyListingsPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await listingsService.getMine();
      if (res.success) setListings(res.data);
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل البيانات" : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا العرض؟" : "Are you sure you want to delete this listing?")) return;
    try {
      const res = await listingsService.delete(id);
      if (res.success) {
        toast.success(locale === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
        setListings(prev => prev.filter(l => l.id !== id));
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل الحذف" : "Failed to delete");
    }
  };

  const filteredListings = listings.filter(l => 
    l.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.crop?.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.crop?.name_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "إدارة العروض الخاصة بي" : "My Listings Management"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? "أضف وقم بإدارة المحاصيل المعروضة للبيع." : "Add and manage your crops for sale."}
          </p>
        </div>
        <button 
          onClick={() => navigate("add")}
          className="dashboard-btn dashboard-btn--primary" 
          style={{ gap: 8 }}
        >
          <Plus size={18} />
          {locale === "ar" ? "إضافة عرض جديد" : "Add New Listing"}
        </button>
      </div>

      {/* Search & Stats Summary */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
          <input 
            type="text" 
            placeholder={locale === "ar" ? "بحث في عروضك..." : "Search your listings..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-input"
            style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
          />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
            <div style={{ padding: "0 16px", borderRadius: 12, backgroundColor: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>{locale === "ar" ? "إجمالي العروض:" : "Total Listings:"}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{listings.length}</span>
            </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div style={{ padding: 80, textAlign: "center" }}>
          <Loader2 className="animate-spin" size={40} style={{ margin: "0 auto 16px", color: "#2E7D32" }} />
          <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل عروضك..." : "Loading your listings..."}</p>
        </div>
      ) : filteredListings.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {filteredListings.map(listing => (
            <div key={listing.id} className="dashboard-panel" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ position: "relative", height: 200 }}>
                <img 
                  src={getImageUrl(listing.image)} 
                  alt="" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 12, [isRTL ? "left" : "right"]: 12, display: "flex", gap: 8 }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: 8, 
                    fontSize: 11, 
                    fontWeight: 700, 
                    background: listing.type === "AUCTION" ? "#FEF3C7" : "#E8F5E9", 
                    color: listing.type === "AUCTION" ? "#D97706" : "#2E7D32",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    textTransform: "uppercase"
                  }}>
                    {listing.type === "AUCTION" ? (locale === "ar" ? "مزاد" : "Auction") : (locale === "ar" ? "سعر ثابت" : "Fixed")}
                  </span>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: 8, 
                    fontSize: 11, 
                    fontWeight: 700, 
                    background: listing.status === "PUBLISHED" ? "#DCFCE7" : "#F1F5F9", 
                    color: listing.status === "PUBLISHED" ? "#166534" : "#475569",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    {listing.status === "PUBLISHED" ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "مسودة" : "Draft")}
                  </span>
                </div>
              </div>
              
              <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{listing.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2E7D32", fontSize: 13, fontWeight: 600 }}>
                        <Package size={14} />
                        <span>{locale === "ar" ? listing.crop?.name_ar : listing.crop?.name_en}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => navigate(`edit/${listing.id}`)} style={{ padding: 8, borderRadius: 10, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", color: "#64748B", transition: "all 0.2s" }} className="hover-scale">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(listing.id)} style={{ padding: 8, borderRadius: 10, border: "1px solid #FEE2E2", background: "#fff", cursor: "pointer", color: "#EF4444", transition: "all 0.2s" }} className="hover-scale">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20, padding: "12px 0", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>{locale === "ar" ? "السعر" : "Price"}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{listing.price_per_unit} <small style={{ fontSize: 11, color: "#64748B" }}>{locale === "ar" ? "ج.م" : "EGP"}</small></span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>{locale === "ar" ? "الكمية" : "Quantity"}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{listing.quantity} <small style={{ fontSize: 11, color: "#64748B" }}>{listing.crop?.standard_unit || "KG"}</small></span>
                  </div>
                </div>

                <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8" }}>
                        <Calendar size={14} />
                        <span>{new Date(listing.created_at).toLocaleDateString(locale === "ar" ? 'ar-EG' : 'en-US')}</span>
                    </div>
                    {listing.quality_grade && (
                        <span style={{ fontSize: 12, color: "#64748B", backgroundColor: "#F1F5F9", padding: "2px 8px", borderRadius: 6 }}>
                            {listing.quality_grade}
                        </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 100, textAlign: "center", background: "#fff", borderRadius: 24, border: "2px dashed #E2E8F0" }}>
           <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Package size={40} color="#94A3B8" />
           </div>
           <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>
             {locale === "ar" ? "لا توجد عروض حالياً" : "No listings yet"}
           </h3>
           <p style={{ color: "#94A3B8", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
             {locale === "ar" ? "ابدأ بإضافة أول محصول لك للبيع في السوق المفتوح للوصول لآلاف التجار." : "Start by adding your first crop for sale in the open marketplace to reach thousands of traders."}
           </p>
           <button onClick={() => navigate("add")} className="dashboard-btn dashboard-btn--primary" style={{ padding: "12px 32px" }}>
             {locale === "ar" ? "أضف عرضك الأول الآن" : "Add Your First Listing Now"}
           </button>
        </div>
      )}
    </div>
  );
}
