import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Layers,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

const navItems = [
  {
    path: "/dashboard",
    icon: LayoutDashboard,
    labelAr: "لوحة التحكم",
    labelEn: "Dashboard",
    end: true,
  },
  {
    path: "/dashboard/categories",
    icon: Layers,
    labelAr: "الأصناف",
    labelEn: "Categories",
  },
  {
    path: "/dashboard/products",
    icon: Package,
    labelAr: "المنتجات",
    labelEn: "Products",
  },
  {
    path: "/dashboard/users",
    icon: Users,
    labelAr: "المستخدمين",
    labelEn: "Users",
  },
  {
    path: "/dashboard/settings",
    icon: Settings,
    labelAr: "الإعدادات",
    labelEn: "Settings",
  },
];

export default function DashboardSidebar({ isCollapsed, onToggle }) {
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const isRTL = direction === "rtl";

  const getUserInitial = () => {
    if (!user?.fullName) return "A";
    return user.fullName.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    if (!user?.fullName) return locale === "ar" ? "أحمد عزت" : "Ahmed Ezzat";
    return user.fullName;
  };

  const getUserRole = () => {
    return locale === "ar" ? "مدير النظام" : "System Admin";
  };

  return (
    <aside
      className="dashboard-sidebar"
      style={{
        width: isCollapsed ? 72 : 260,
        height: "100vh",
        background: "#fff",
        borderLeft: isRTL ? "none" : "1px solid #E2E8F0",
        borderRight: isRTL ? "1px solid #E2E8F0" : "none",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      {/* Logo / Store name — fixed top */}
      <div
        style={{
          padding: isCollapsed ? "20px 12px" : "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          borderBottom: "1px solid #F1F5F9",
          minHeight: 72,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ShoppingCart size={20} color="#fff" />
        </div>
        {!isCollapsed && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.2,
              }}
            >
              {locale === "ar" ? "متجر المبيعات" : "Sales Store"}
            </h2>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="dashboard-sidebar-toggle"
        style={{
          position: "absolute",
          top: 80,
          [isRTL ? "left" : "right"]: -0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#fff",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 50,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.2s ease",
        }}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isRTL ? (
          isCollapsed ? (
            <ChevronLeft size={14} color="#6B7280" />
          ) : (
            <ChevronRight size={14} color="#6B7280" />
          )
        ) : isCollapsed ? (
          <ChevronRight size={14} color="#6B7280" />
        ) : (
          <ChevronLeft size={14} color="#6B7280" />
        )}
      </button>

      {/* Nav Items — scrollable middle area */}
      <nav
        className="no-scrollbar"
        style={{
          flex: 1,
          padding: isCollapsed ? "16px 8px" : "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
          overflowX: "hidden",
          minHeight: 0,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.end
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: isCollapsed ? "12px" : "12px 16px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#2E7D32" : "#64748B",
                background: isActive
                  ? "linear-gradient(135deg, rgba(46,125,50,0.08) 0%, rgba(129,199,132,0.08) 100%)"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.2s ease",
                justifyContent: isCollapsed ? "center" : "flex-start",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
              title={isCollapsed ? (locale === "ar" ? item.labelAr : item.labelEn) : ""}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(46,125,50,0.05)";
                  e.currentTarget.style.color = "#2E7D32";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#64748B";
                }
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    [isRTL ? "right" : "left"]: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 20,
                    borderRadius: 4,
                    background: "#2E7D32",
                  }}
                />
              )}
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!isCollapsed && (
                <span style={{ whiteSpace: "nowrap" }}>
                  {locale === "ar" ? item.labelAr : item.labelEn}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile — fixed bottom */}
      <div
        style={{
          padding: isCollapsed ? "16px 8px" : "16px",
          borderTop: "1px solid #F1F5F9",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: isCollapsed ? "8px 4px" : "12px",
            borderRadius: 12,
            background: "rgba(46,125,50,0.04)",
            justifyContent: isCollapsed ? "center" : "flex-start",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {getUserInitial()}
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1a1a1a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {getUserName()}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  whiteSpace: "nowrap",
                }}
              >
                {getUserRole()}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
