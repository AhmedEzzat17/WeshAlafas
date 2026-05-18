import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { negotiationsService } from "../../service/api";
import { getImageUrl } from "../../utils/imageUrl";
import { 
  Gavel, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  ArrowRightLeft,
  ChevronRight,
  ChevronLeft,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

export default function NegotiationsPage() {
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";
  
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const isFarmer = user?.role?.toUpperCase() === "FARMER";
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    setLoading(true);
    try {
      // If admin, get all. If farmer, get received. If trader, get sent.
      let res;
      if (isAdmin) {
        res = await negotiationsService.getAll();
      } else if (isFarmer) {
        res = await negotiationsService.getReceived();
      } else {
        res = await negotiationsService.getSent();
      }
        
      if (res.success) {
        setNegotiations(res.data);
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل المفاوضات" : "Failed to load negotiations");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, status) => {
    try {
      const res = await negotiationsService.respond(id, status);
      if (res.success) {
        toast.success(locale === "ar" ? "تم تحديث حالة العرض" : "Offer status updated");
        fetchNegotiations(); // Refresh
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحديث الحالة" : "Failed to update status");
    }
  };

  const handleBuyNegotiated = (neg) => {
    // Add to cart with negotiated price
    const product = {
      ...neg.listing,
      price: neg.current_offer_price,
      original_price: neg.listing.price,
      is_negotiated: true,
      negotiation_id: neg.id
    };
    addToCart(product, 1);
    toast.success(locale === "ar" ? "تمت الإضافة للسلة بالسعر المتفق عليه" : "Added to cart with agreed price");
    navigate("/checkout");
  };

  const getStatusInfo = (status) => {
    const statuses = {
      OPEN: { 
        labelAr: "نشط", 
        labelEn: "Open", 
        color: "#3B82F6", 
        bg: "#DBEAFE",
        icon: Clock 
      },
      AGREED: { 
        labelAr: "تمت الموافقة", 
        labelEn: "Agreed", 
        color: "#10B981", 
        bg: "#D1FADF",
        icon: CheckCircle2 
      },
      REJECTED: { 
        labelAr: "مرفوض", 
        labelEn: "Rejected", 
        color: "#EF4444", 
        bg: "#FEE2E2",
        icon: XCircle 
      },
      EXPIRED: { 
        labelAr: "منتهي", 
        labelEn: "Expired", 
        color: "#6B7280", 
        bg: "#F3F4F6",
        icon: Clock 
      },
      CONVERTED_TO_ORDER: { 
        labelAr: "تحول لطلب", 
        labelEn: "Ordered", 
        color: "#2E7D32", 
        bg: "#E8F5E9",
        icon: CheckCircle2 
      },
    };
    return statuses[status] || { labelAr: status, labelEn: status, color: "#6B7280", bg: "#F3F4F6", icon: Gavel };
  };

  const filteredNegotiations = negotiations.filter(neg => {
    const matchesSearch = neg.listing?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || neg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
          {locale === "ar" ? "إدارة المزايدات" : "Negotiations Management"}
        </h1>
        <p style={{ fontSize: 14, color: "#94A3B8" }}>
          {isFarmer 
            ? (locale === "ar" ? "راجع عروض الأسعار التي تلقيتها من التجار." : "Review price offers you received from traders.")
            : (locale === "ar" ? "تابع العروض التي قدمتها للمزارعين." : "Track offers you sent to farmers.")
          }
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
          <input 
            type="text" 
            placeholder={locale === "ar" ? "بحث بالمنتج..." : "Search by product..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-input"
            style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
          />
        </div>
        
        <select 
          className="dashboard-input" 
          style={{ width: "auto", minWidth: 160 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">{locale === "ar" ? "كل الحالات" : "All Statuses"}</option>
          <option value="OPEN">{locale === "ar" ? "نشط" : "Open"}</option>
          <option value="AGREED">{locale === "ar" ? "مقبول" : "Agreed"}</option>
          <option value="REJECTED">{locale === "ar" ? "مرفوض" : "Rejected"}</option>
        </select>
      </div>

      {/* Table */}
      <div className="dashboard-panel">
        {loading ? (
          <div style={{ padding: 80, textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#2E7D32", borderRadius: "50%", margin: "0 auto 16px" }} />
            <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}</p>
          </div>
        ) : filteredNegotiations.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>{locale === "ar" ? "المنتج" : "Product"}</th>
                  <th>{isFarmer ? (locale === "ar" ? "المشتري" : "Buyer") : (locale === "ar" ? "البائع" : "Seller")}</th>
                  <th>{locale === "ar" ? "العرض الحالي" : "Current Offer"}</th>
                  <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th>{locale === "ar" ? "التحديث الأخير" : "Last Update"}</th>
                  <th>{locale === "ar" ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredNegotiations.map(neg => {
                  const statusInfo = getStatusInfo(neg.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <tr key={neg.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img 
                            src={getImageUrl(neg.listing?.image || neg.listing?.images?.[0]?.image_path)} 
                            alt="" 
                            style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                          />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>{neg.listing?.title}</p>
                            <p style={{ fontSize: 12, color: "#94A3B8" }}>{locale === "ar" ? neg.listing?.crop?.name_ar : neg.listing?.crop?.name_en}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <User size={14} color="#64748B" />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            {isFarmer ? neg.buyer_tenant?.name : neg.seller_tenant?.name}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: 800, color: "#2E7D32", fontSize: 15 }}>
                            {parseFloat(neg.current_offer_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                          </span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>
                            {locale === "ar" ? `السعر الأصلي: ${neg.listing?.price}` : `Original: ${neg.listing?.price}`}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 6, 
                          padding: "6px 12px", 
                          borderRadius: 20, 
                          fontSize: 12, 
                          fontWeight: 700,
                          background: statusInfo.bg,
                          color: statusInfo.color
                        }}>
                          <StatusIcon size={14} />
                          {locale === "ar" ? statusInfo.labelAr : statusInfo.labelEn}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: "#64748B" }}>
                        {new Date(neg.updated_at).toLocaleDateString(locale === "ar" ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' })}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          {isFarmer && neg.status === "OPEN" && (
                            <>
                              <button 
                                onClick={() => handleRespond(neg.id, "AGREED")}
                                className="dashboard-btn" 
                                style={{ padding: "6px 10px", background: "#10B981", color: "#fff", border: "none" }}
                              >
                                {locale === "ar" ? "قبول" : "Accept"}
                              </button>
                              <button 
                                onClick={() => handleRespond(neg.id, "REJECTED")}
                                className="dashboard-btn" 
                                style={{ padding: "6px 10px", background: "#EF4444", color: "#fff", border: "none" }}
                              >
                                {locale === "ar" ? "رفض" : "Reject"}
                              </button>
                            </>
                          )}
                          {!isFarmer && neg.status === "AGREED" && (
                            <button 
                              onClick={() => handleBuyNegotiated(neg)}
                              className="dashboard-btn" 
                              style={{ padding: "6px 12px", background: "#2E7D32", color: "#fff", border: "none", fontSize: 12, fontWeight: 700 }}
                            >
                              {locale === "ar" ? "شراء الآن" : "Buy Now"}
                            </button>
                          )}
                          <button 
                            className="dashboard-btn dashboard-btn--outline"
                            style={{ padding: "6px 10px" }}
                          >
                            <ArrowRightLeft size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 80, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#F8FAFC", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#CBD5E1" }}>
              <Gavel size={32} />
            </div>
            <p style={{ color: "#64748B" }}>{locale === "ar" ? "لا توجد مفاوضات حالياً" : "No negotiations at the moment"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
