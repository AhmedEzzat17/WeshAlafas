import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../service/api";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Globe,
  BarChart3,
  Gavel,
  Sprout,
  Loader2,
  Plus,
  ArrowRight
} from "lucide-react";

export default function DashboardHome() {
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role?.toUpperCase() || "";
  const isAdmin = role === "ADMIN";
  const isFarmer = role === "FARMER";
  const isTrader = role === "TRADER" || role === "COMPANY";

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING_PAYMENT: { ar: "في انتظار الدفع", en: "Pending Payment", class: "warning" },
      PAID: { ar: "تم الدفع", en: "Paid", class: "success" },
      PROCESSING: { ar: "قيد التجهيز", en: "Processing", class: "info" },
      SHIPPED: { ar: "تم الشحن", en: "Shipped", class: "info" },
      DELIVERED: { ar: "تم التوصيل", en: "Delivered", class: "success" },
      COMPLETED: { ar: "مكتمل", en: "Completed", class: "success" },
      CANCELLED: { ar: "ملغي", en: "Cancelled", class: "danger" },
    };
    const s = statusMap[status] || { ar: status, en: status, class: "info" };
    return <span className={`dashboard-badge dashboard-badge--${s.class}`}>{locale === "ar" ? s.ar : s.en}</span>;
  };

  const formatStats = () => {
    if (!stats) return [];
    
    if (isAdmin) {
      return [
        { label: locale === "ar" ? "إجمالي المبيعات" : "Total Revenue", value: `${parseFloat(stats.total_sales || 0).toLocaleString()} ج.م`, icon: DollarSign, class: "revenue" },
        { label: locale === "ar" ? "إجمالي الطلبات" : "Total Orders", value: stats.total_orders || 0, icon: ShoppingBag, class: "orders" },
        { label: locale === "ar" ? "المزارعون النشطون" : "Active Farmers", value: stats.active_farmers || 0, icon: Users, class: "customers" },
        { label: locale === "ar" ? "إجمالي المحاصيل" : "Total Crops", value: stats.total_crops || 0, icon: Sprout, class: "pending" },
      ];
    }
    if (isFarmer) {
      return [
        { label: locale === "ar" ? "أرباحي المكتملة" : "My Earnings", value: `${parseFloat(stats.earnings || 0).toLocaleString()} ج.م`, icon: DollarSign, class: "revenue" },
        { label: locale === "ar" ? "طلبات قيد التنفيذ" : "Active Orders", value: stats.active_orders || 0, icon: ShoppingBag, class: "orders" },
        { label: locale === "ar" ? "منتجاتي" : "My Listings", value: stats.my_listings || 0, icon: Package, class: "customers" },
        { label: locale === "ar" ? "مفاوضات جارية" : "Negotiations", value: stats.negotiations || 0, icon: Gavel, class: "pending" },
      ];
    }
    if (isTrader) {
      return [
        { label: locale === "ar" ? "إجمالي المشتريات" : "Total Spent", value: `${parseFloat(stats.total_spent || 0).toLocaleString()} ج.م`, icon: DollarSign, class: "revenue" },
        { label: locale === "ar" ? "طلباتي" : "My Orders", value: stats.my_orders || 0, icon: ShoppingBag, class: "orders" },
        { label: locale === "ar" ? "مزايدات نشطة" : "Active Bids", value: stats.active_bids || 0, icon: Gavel, class: "pending" },
        { label: locale === "ar" ? "المزارعين" : "Fav Farmers", value: stats.fav_farmers || 0, icon: Users, class: "customers" },
      ];
    }
    return [];
  };

  const dashboardStats = formatStats();

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh", gap: 16 }}>
        <Loader2 className="animate-spin" size={48} color="#2E7D32" />
        <p style={{ color: "#94A3B8", fontWeight: 600 }}>{locale === "ar" ? "جاري تجهيز بياناتك..." : "Preparing your data..."}</p>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      <style>{`
        .hover-row { transition: all 0.2s ease; }
        .hover-row:hover { background-color: #F8FAFC !important; }
      `}</style>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? `مرحباً، ${user?.name || ""}` : `Welcome back, ${user?.name || ""}`}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isAdmin ? (locale === "ar" ? "إدارة المنصة بالكامل بين يديك." : "The full platform management is in your hands.") : 
             isFarmer ? (locale === "ar" ? "إليك ملخص أداء مزرعتك اليوم." : "Here's a summary of your farm's performance today.") :
             (locale === "ar" ? "تابع مشترياتك ومفاوضاتك مع المزارعين." : "Track your purchases and negotiations with farmers.")}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {isFarmer && (
            <button 
              onClick={() => navigate("/dashboard/my-listings/add")}
              className="dashboard-btn dashboard-btn--primary" 
              style={{ gap: 8 }}
            >
              <Plus size={18} />
              {locale === "ar" ? "إضافة عرض جديد" : "Add New Listing"}
            </button>
          )}
          {isTrader && (
            <button 
              onClick={() => window.location.href = "/products"}
              className="dashboard-btn dashboard-btn--primary" 
              style={{ gap: 8 }}
            >
              <ShoppingBag size={18} />
              {locale === "ar" ? "تصفح المتجر" : "Browse Market"}
            </button>
          )}
          <button className="dashboard-btn dashboard-btn--outline" onClick={() => setShowWebsiteModal(true)} style={{ gap: 8 }}>
            <Globe size={18} />
            {locale === "ar" ? "زيارة الموقع" : "Visit Website"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 28 }}>
        {dashboardStats.map((stat, i) => (
          <div key={i} className={`dashboard-stat-card dashboard-stat-card--${stat.class}`}>
            <div className={`dashboard-stat-icon dashboard-stat-icon--${stat.class}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4 }}>{stat.label}</p>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a" }}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-charts-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 24 }}>
        {/* Recent Orders */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
             <h3 className="dashboard-panel-title">{locale === "ar" ? "آخر الطلبات" : "Recent Orders"}</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>{isFarmer || isAdmin ? (locale === "ar" ? "المشتري" : "Buyer") : (locale === "ar" ? "البائع" : "Seller")}</th>
                  <th>{locale === "ar" ? "التاريخ" : "Date"}</th>
                  <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th>{locale === "ar" ? "الإجمالي" : "Total"}</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_orders?.length > 0 ? (
                  stats.recent_orders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                      style={{ cursor: "pointer" }}
                      className="hover-row"
                    >
                      <td style={{ fontWeight: 700, color: "#2E7D32" }}>#{order.id.substring(0, 8).toUpperCase()}</td>
                      <td>
                        {isFarmer || isAdmin 
                          ? (order.buyer_tenant?.name || (locale === "ar" ? "غير معروف" : "Unknown"))
                          : (order.listing?.tenant?.name || (locale === "ar" ? "غير معروف" : "Unknown"))
                        }
                      </td>
                      <td style={{ color: "#64748B", fontSize: 13 }}>{new Date(order.created_at).toLocaleDateString(locale === "ar" ? 'ar-EG' : 'en-US')}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td style={{ fontWeight: 800, color: "#1a1a1a" }}>{parseFloat(order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: "#94A3B8" }}>{locale === "ar" ? "لا توجد طلبات حديثة" : "No recent orders"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Website Redirect Modal */}
      {showWebsiteModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 20, padding: 32, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: 400, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#2E7D32", margin: "0 auto" }}>
              <Globe size={32} />
            </div>
            <h3 style={{ fontSize: 20, color: "#1f2937", fontWeight: 800, marginBottom: 12 }}>{locale === "ar" ? "الذهاب إلى الموقع" : "Go to Website"}</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>{locale === "ar" ? "هل تريد مغادرة لوحة التحكم والذهاب للموقع الرئيسي؟" : "Do you want to leave the dashboard and go to the main website?"}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="dashboard-btn dashboard-btn--outline" onClick={() => setShowWebsiteModal(false)} style={{ flex: 1 }}>{locale === "ar" ? "إلغاء" : "Cancel"}</button>
              <button className="dashboard-btn dashboard-btn--primary" onClick={() => window.location.href = "/"} style={{ flex: 1 }}>{locale === "ar" ? "تأكيد" : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
