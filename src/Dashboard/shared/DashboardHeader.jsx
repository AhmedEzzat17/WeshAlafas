import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  Globe,
  Menu,
  X,
  User,
  ShoppingBag,
  Gavel,
  CreditCard,
  ChevronDown,
  LayoutDashboard,
  Layers,
  Sprout,
  ShoppingCart,
  BarChart3,
  Users,
  Settings
} from "lucide-react";

export default function DashboardHeader({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { locale, direction, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, titleAr: "مزايدة جديدة", titleEn: "New Bid Received", descAr: "تلقيت عرضاً بقيمة 5000 ج.م على محصول البطاطس.", descEn: "Received a 5000 EGP bid on your Potato crop.", type: "BID", timeAr: "منذ دقيقتين", timeEn: "2m ago", icon: Gavel, color: "#3B82F6" },
    { id: 2, titleAr: "تم دفع الطلب", titleEn: "Order Paid", descAr: "تم تأكيد دفع الطلب رقم #ORD-772.", descEn: "Payment confirmed for Order #ORD-772.", type: "ORDER", timeAr: "منذ ساعة", timeEn: "1h ago", icon: CreditCard, color: "#10B981" },
    { id: 3, titleAr: "تنبيه المخزون", titleEn: "Stock Alert", descAr: "مخزون الطماطم قارب على الانتهاء.", descEn: "Tomato stock is running low.", type: "STOCK", timeAr: "منذ 3 ساعات", timeEn: "3h ago", icon: ShoppingBag, color: "#F59E0B" },
  ];

  const searchablePages = [
    { labelAr: "الرئيسية", labelEn: "Home", path: "/dashboard", icon: LayoutDashboard },
    { labelAr: "التصنيفات", labelEn: "Categories", path: "/dashboard/categories", icon: Layers },
    { labelAr: "المحاصيل", labelEn: "Crops", path: "/dashboard/crops", icon: Sprout },
    { labelAr: "الطلبات", labelEn: "Orders", path: "/dashboard/orders", icon: ShoppingCart },
    { labelAr: "المفاوضات", labelEn: "Negotiations", path: "/dashboard/negotiations", icon: Gavel },
    { labelAr: "التقارير", labelEn: "Reports", path: "/dashboard/reports", icon: BarChart3 },
    { labelAr: "المستخدمين", labelEn: "Users", path: "/dashboard/users", icon: Users },
    { labelAr: "الإعدادات", labelEn: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = searchablePages.filter(page =>
        page.labelEn.toLowerCase().includes(query.toLowerCase()) ||
        page.labelAr.includes(query)
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  return (
    <header
      style={{
        height: 64,
        background: "#fff",
        borderBottom: "1px solid #E2E8F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <style>{`
        .notification-dropdown, .search-dropdown { animation: slideDown 0.2s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .search-item:hover { background: #F1F5F9; }
      `}</style>

      {/* Left side: Mobile menu + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        <button
          onClick={onMobileMenuToggle}
          style={{
            display: "none",
            width: 40,
            height: 40,
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            background: "#fff",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          className="dashboard-mobile-menu-btn"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div style={{ position: "relative", maxWidth: 400, flex: 1 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
          <input
            type="text"
            placeholder={locale === "ar" ? "بحث في لوحة التحكم..." : "Search dashboard..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            style={{ width: "100%", height: 42, borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC", paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16, outline: "none", fontSize: 14 }}
          />

          {showSearch && searchResults.length > 0 && (
            <div className="search-dropdown" style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", zIndex: 100, overflow: "hidden" }}>
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  className="search-item"
                  onClick={() => { navigate(res.path); setSearchQuery(""); setShowSearch(false); }}
                  style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid #F1F5F9" : "none" }}
                >
                  <res.icon size={18} color="#64748B" />
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>{locale === "ar" ? res.labelAr : res.labelEn}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ width: 40, height: 40, borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", cursor: "pointer", position: "relative" }}
          >
            <Bell size={20} />
            <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, background: "#EF4444", borderRadius: "50%", border: "2px solid #fff" }} />
          </button>

          {showNotifications && (
            <div className="notification-dropdown" style={{ position: "absolute", top: "calc(100% + 12px)", [isRTL ? "left" : "right"]: 0, width: 320, background: "#fff", borderRadius: 16, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{locale === "ar" ? "الإشعارات" : "Notifications"}</span>
                <span style={{ fontSize: 12, color: "#2E7D32", fontWeight: 600, cursor: "pointer" }}>{locale === "ar" ? "تحديد كقروء" : "Mark all read"}</span>
              </div>
              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: "14px 20px", display: "flex", gap: 12, borderBottom: "1px solid #F8FAFC", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${n.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: n.color, flexShrink: 0 }}>
                      <n.icon size={18} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{locale === "ar" ? n.titleAr : n.titleEn}</p>
                      <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.4, marginBottom: 4 }}>{locale === "ar" ? n.descAr : n.descEn}</p>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>{locale === "ar" ? n.timeAr : n.timeEn}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 12, textAlign: "center", background: "#F8FAFC", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748B" }} onClick={() => setShowNotifications(false)}>
                {locale === "ar" ? "عرض الكل" : "View All"}
              </div>
            </div>
          )}
        </div>

        {/* Language */}
        <button
          onClick={toggleLanguage}
          style={{ height: 40, padding: "0 14px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", fontSize: 13, fontWeight: 700, color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Globe size={16} />
          {locale === "ar" ? "عربي" : "EN"}
        </button>

        {/* Profile */}
        <div
          onClick={() => navigate("/dashboard/settings")}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 4px 4px 12px", borderRadius: 14, background: "#F8FAFC", border: "1px solid #E2E8F0", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
          onMouseLeave={e => e.currentTarget.style.background = "#F8FAFC"}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 800 }}>
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>{user?.name || "Admin"}</span>
            <span style={{ fontSize: 11, color: "#2E7D32", fontWeight: 600 }}>{user?.role || "Manager"}</span>
          </div>
          <ChevronDown size={14} color="#94A3B8" style={{ marginLeft: isRTL ? 4 : 0, marginRight: isRTL ? 0 : 4 }} />
        </div>
      </div>
    </header>
  );
}
