import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { offersService } from "../../service/api";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  Loader2,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

function parseBilingual(text, locale) {
  if (!text) return "";
  const arMatch = text.match(/\[ar:(.*?)\]/);
  const enMatch = text.match(/\[en:(.*?)\]/);
  
  if (!arMatch && !enMatch) {
    return text.trim();
  }
  
  if (locale === "en") {
    return enMatch ? enMatch[1].trim() : (arMatch ? arMatch[1].trim() : text.trim());
  }
  // Default to Arabic
  return arMatch ? arMatch[1].trim() : text.trim();
}

export default function OffersPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await offersService.getAll();
      if (res.success) {
        setOffers(res.data.offers || []);
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل العروض" : "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا العرض؟" : "Are you sure you want to delete this offer?")) return;
    try {
      const res = await offersService.delete(id);
      if (res.success) {
        toast.success(locale === "ar" ? "تم الحذف بنجاح" : "Deleted successfully");
        setOffers(prev => prev.filter(o => o.id !== id));
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل الحذف" : "Failed to delete");
    }
  };

  const filteredOffers = offers.filter(o => {
    let cleanDesc = o.description || "";
    if (cleanDesc.includes("#wide")) {
      cleanDesc = cleanDesc.replace("#wide", "").trim();
    }
    const nameParsed = parseBilingual(o.name, locale).toLowerCase();
    const descParsed = parseBilingual(cleanDesc, locale).toLowerCase();
    const query = searchQuery.toLowerCase();
    return nameParsed.includes(query) || descParsed.includes(query);
  });

  const getStatus = (offer) => {
    const now = new Date();
    const start = offer.starts_at ? new Date(offer.starts_at) : null;
    const end = offer.ends_at ? new Date(offer.ends_at) : null;

    if (!offer.is_active) return { label: locale === "ar" ? "معطل" : "Inactive", color: "#EF4444", bg: "#FEE2E2", icon: XCircle };
    if (end && now > end) return { label: locale === "ar" ? "منتهي" : "Expired", color: "#94A3B8", bg: "#F1F5F9", icon: Clock };
    if (start && now < start) return { label: locale === "ar" ? "قريباً" : "Scheduled", color: "#F59E0B", bg: "#FEF3C7", icon: Calendar };
    return { label: locale === "ar" ? "نشط" : "Active", color: "#10B981", bg: "#D1FADF", icon: CheckCircle2 };
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "إدارة العروض" : "Offers Management"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? "أنشئ عروضاً وخصومات على منتجاتك." : "Create offers and discounts on your products."}
          </p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/offers/add")}
          className="dashboard-btn dashboard-btn--primary" 
          style={{ gap: 8 }}
        >
          <Plus size={18} />
          {locale === "ar" ? "إضافة عرض جديد" : "Add New Offer"}
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
        <input 
          type="text" 
          placeholder={locale === "ar" ? "بحث في العروض..." : "Search offers..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="dashboard-input"
          style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
        />
      </div>

      {/* Grid View */}
      {loading ? (
        <div style={{ padding: 80, textAlign: "center" }}>
          <Loader2 className="animate-spin" size={40} style={{ margin: "0 auto 16px", color: "#2E7D32" }} />
          <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل العروض..." : "Loading offers..."}</p>
        </div>
      ) : filteredOffers.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {filteredOffers.map(offer => {
            const status = getStatus(offer);
            const StatusIcon = status.icon;
            
            let cleanDesc = offer.description || "";
            if (cleanDesc.includes("#wide")) {
              cleanDesc = cleanDesc.replace("#wide", "").trim();
            }
            const displayName = parseBilingual(offer.name, locale);
            const displayDesc = parseBilingual(cleanDesc, locale);

            return (
              <div key={offer.id} className="dashboard-panel" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ position: "relative", height: 140, background: "#F8FAFC" }}>
                  {(offer.image_url || offer.image) ? (
                    <img src={offer.image_url || offer.image} alt={displayName} onError={(e) => { e.target.onerror = null; e.target.src = "/fallback.png"; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: "flex", alignItems: "center", justifyContent: "center", color: "#CBD5E1" }}>
                      <Tag size={48} />
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 12, [isRTL ? "left" : "right"]: 12, display: "flex", gap: 8 }}>
                    <button onClick={() => navigate(`/dashboard/offers/edit/${offer.id}`)} className="dashboard-action-btn" style={{ background: "#fff" }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(offer.id)} className="dashboard-action-btn" style={{ background: "#fff", color: "#EF4444" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, [isRTL ? "right" : "left"]: 12 }}>
                    <span style={{ 
                      background: status.bg, 
                      color: status.color, 
                      padding: "4px 10px", 
                      borderRadius: 20, 
                      fontSize: 11, 
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{displayName}</h3>
                  <p style={{ fontSize: 13, color: "#64748B", marginBottom: 12, height: 36, overflow: "hidden" }}>{displayDesc}</p>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: "6px 12px", background: "#F0FDF4", borderRadius: 8, color: "#166534", fontWeight: 800, fontSize: 14 }}>
                      {offer.discount_type === "PERCENTAGE" ? `${parseFloat(offer.discount_value)}%` : `${parseFloat(offer.discount_value)} ج.م`}
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={12} />
                      {offer.starts_at ? new Date(offer.starts_at).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US") : "N/A"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", marginLeft: isRTL ? 0 : -8, marginRight: isRTL ? -8 : 0 }}>
                      {(offer.listings || []).slice(0, 3).map((l, i) => (
                        <div key={l.id} style={{ 
                          width: 28, height: 28, borderRadius: "50%", border: "2px solid #fff", 
                          background: "#E2E8F0", overflow: "hidden", marginLeft: isRTL ? -8 : 0, marginRight: isRTL ? 0 : -8,
                          position: "relative", zIndex: 3 - i
                        }}>
                          <img src={l.image} alt="" style={{ width: '100%', height: '100%', objectFit: "cover" }} />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
                      {offer.listings?.length || 0} {locale === "ar" ? "منتجات" : "Products"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: 80, textAlign: "center" }}>
          <Tag size={48} color="#CBD5E1" style={{ marginBottom: 16 }} />
          <p style={{ color: "#64748B" }}>{locale === "ar" ? "لا توجد عروض حالياً" : "No offers at the moment"}</p>
        </div>
      )}
    </div>
  );
}
