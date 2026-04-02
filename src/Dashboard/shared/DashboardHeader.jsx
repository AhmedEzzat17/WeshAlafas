import { useState } from "react";
// import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
} from "lucide-react";

export default function DashboardHeader({ onMobileMenuToggle, isMobileMenuOpen }) {
  const { locale, direction, toggleLanguage } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";
  const [searchQuery, setSearchQuery] = useState("");
  // const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Could implement dashboard-specific search
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
        zIndex: 30,
      }}
    >
      {/* Left side: Mobile menu + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="dashboard-mobile-menu-btn"
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
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            position: "relative",
            maxWidth: 400,
            flex: 1,
          }}
        >
          <Search
            size={18}
            color="#94A3B8"
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [isRTL ? "right" : "left"]: 14,
              pointerEvents: "none",
            }}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === "ar"
                ? "ابحث عن منتجات، عملاء..."
                : "Search products, customers..."
            }
            style={{
              width: "100%",
              height: 42,
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              background: "#F8FAFC",
              fontSize: 14,
              color: "#333",
              paddingLeft: isRTL ? 16 : 44,
              paddingRight: isRTL ? 44 : 16,
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#2E7D32";
              e.target.style.boxShadow = "0 0 0 3px rgba(46,125,50,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E2E8F0";
              e.target.style.boxShadow = "none";
            }}
          />
        </form>
      </div>

      {/* Right side: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Dark mode toggle */}
        
        {/* <button
          onClick={() => setIsDarkMode((d) => !d)}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748B",
            transition: "all 0.2s ease",
          }}
          title={locale === "ar" ? "الوضع الليلي" : "Dark Mode"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F1F5F9";
            e.currentTarget.style.color = "#2E7D32";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 38,
            padding: "0 14px",
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            background: "transparent",
            fontSize: 13,
            fontWeight: 600,
            color: "#64748B",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#2E7D32";
            e.currentTarget.style.color = "#2E7D32";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E2E8F0";
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <Globe size={16} />
          {locale === "ar" ? "عربي" : "EN"}
        </button>

        {/* Account link */}
        <button
          onClick={() => navigate("/dashboard/settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px 6px 6px",
            borderRadius: 12,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F1F5F9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <span
            className="dashboard-header-username"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#334155",
            }}
          >
            {user?.fullName || (locale === "ar" ? "المدير" : "Admin")}
          </span>
        </button>
      </div>
    </header>
  );
}
