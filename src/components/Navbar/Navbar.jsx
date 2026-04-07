import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { t } from "../../utils/translations";
import logo from "../../assets/logo.png";

/* ====== SVG Icons ====== */
const SearchIcon = () => (
  <svg
    className="w-[18px] h-[18px] text-text-muted"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const CartIcon = ({ size = 22 }) => (
  <svg
    style={{ width: size, height: size }}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
    />
  </svg>
);
const HeartIcon = ({ size = 22 }) => (
  <svg
    style={{ width: size, height: size }}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);
const UserIcon = ({ size = 22 }) => (
  <svg
    style={{ width: size, height: size }}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const MobileNavIcons = {
  home: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  about: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  categories: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  products: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  ),
  offers: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
      <line x1="7" y1="7" x2="7.01" y2="7"></line>
    </svg>
  ),
  contact: (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
};

/* Cart badge component */
const CartBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span
      className="absolute flex items-center justify-center rounded-full bg-flash text-white font-bold shadow-sm"
      style={{
        top: -6,
        right: -6,
        minWidth: 20,
        height: 20,
        fontSize: 11,
        lineHeight: 1,
        padding: "0 5px",
        border: "2px solid #fff",
      }}
    >
      {count}
    </span>
  );
};

export default function Navbar() {
  const { locale, direction, toggleLanguage } = useLanguage();
  const { cartCount, wishlistItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { isScrolled } = useScrollPosition(60);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const desktopAccountRef = useRef(null);
  const mobileAccountRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { key: "home", path: "/" },
    { key: "about", path: "/#about" },
    { key: "categories", path: "/#categories" },
    { key: "products", path: "/products" },
    { key: "offers", path: "/products?category=offers" },
    // { key: "listings", path: "/listings" },
    { key: "contact", path: "/contact" },
  ];

  const handleNavClick = (e, path) => {
    // Handle Home link: scroll to top if already on home, otherwise navigate
    if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (path.startsWith("/#") && location.pathname === "/") {
      const id = path.substring(2);
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", path);
      }
    }
  };

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Defer the execution to avoid the set-state-in-effect warning
    const timer = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((p) => !p),
    [],
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchFocused(false);
        setIsMobileMenuOpen(false);
      }
    },
    [searchQuery, navigate],
  );

  const popularSearches = [
    { labelAr: "التفاح", labelEn: "Apples", type: "search", query: "Apple" },
    {
      labelAr: "الفواكه",
      labelEn: "Fruits",
      type: "category",
      value: "fruits",
    },
    {
      labelAr: "الخضراوات",
      labelEn: "Vegetables",
      type: "category",
      value: "vegetables",
    },
    { labelAr: "العروض", labelEn: "Offers", type: "category", value: "offers" },
  ];

  const handlePopularSearch = (item) => {
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    if (item.type === "category") {
      navigate(`/products?category=${item.value}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(item.query)}`);
    }
  };

  const renderSearchBlock = () => (
    <div
      className="relative w-full"
      onFocus={() => setIsSearchFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsSearchFocused(false);
        }
      }}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full"
        role="search"
      >
        <span
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={isRTL ? { right: 14 } : { left: 14 }}
        >
          <SearchIcon />
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t(locale, "searchPlaceholder")}
          className="w-full rounded-xl bg-bg border border-transparent text-[14px] text-text-main placeholder-text-muted transition-all duration-200 focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          style={{
            height: 42,
            paddingLeft: isRTL ? 16 : 44,
            paddingRight: isRTL ? 44 : 16,
          }}
        />
      </form>

      {/* Popular Searches Dropdown */}
      {isSearchFocused && (
        <div
          className="absolute mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in"
          style={{
            top: "100%",
            left: 0,
            right: 0,
            padding: "16px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing before click
        >
          <h4
            className="text-gray-400 text-xs font-bold uppercase mb-3 flex items-center gap-2"
            style={{ marginBottom: "10px" }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
            {locale === "ar" ? "عمليات بحث شائعة" : "Popular Searches"}
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item, idx) => (
              <button
                key={idx}
                type="button"
                style={{ padding: "9px" }}
                className="bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary-dark transition-colors px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 hover:border-primary/30 cursor-pointer"
                onClick={() => handlePopularSearch(item)}
              >
                {locale === "ar" ? item.labelAr : item.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  // Track which section is visible on the home page
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    // Map section IDs to nav keys
    const sectionMap = [
      { id: "contact", key: "contact" },
      { id: "categories", key: "categories" },
      { id: "about", key: "about" },
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY + 150;

      // Check sections from bottom to top
      for (const section of sectionMap) {
        const el = document.getElementById(section.id);
        if (el && scrollY >= el.offsetTop) {
          setActiveSection(section.key);
          return;
        }
      }
      // If none matched, we're at the top → home
      setActiveSection("home");
    };

    handleScroll(); // run once on mount/route change
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isActive = (path) => {
    // On the home page, use scroll-based active section
    if (location.pathname === "/") {
      if (path === "/") return activeSection === "home";
      if (path === "/#about") return activeSection === "about";
      if (path === "/#categories") return activeSection === "categories";
      if (path === "/contact") return activeSection === "contact";
      return false;
    }
    // On other pages, match by URL
    if (path === "/") return false;
    if (path.startsWith("/#")) return false;
    return location.pathname + location.search === path;
  };

  const isRTL = direction === "rtl";

  /* Close account dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!isAccountDropdownOpen) return;
      const clickedOutsideDesktop = desktopAccountRef.current && !desktopAccountRef.current.contains(e.target);
      const clickedOutsideMobile = mobileAccountRef.current && !mobileAccountRef.current.contains(e.target);
      
      // Close dropdown if click is outside both desktop and mobile dropdowns
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isAccountDropdownOpen]);

  /* Close account dropdown on route change */
  useEffect(() => {
    setIsAccountDropdownOpen(false);
  }, [location.pathname]);

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setIsAccountDropdownOpen((p) => !p);
    } else {
      navigate("/login");
    }
  };

  const handleLogoutClick = () => {
    setIsAccountDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
    } finally {
      setIsLogoutModalOpen(false);
      navigate("/");
    }
  };

  /* Get user display name (first + last name) */
  const getUserDisplayName = () => {
    const name = user?.fullName || user?.name || "";
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0]} ${parts[1]}`;
    return parts[0];
  };

  /* Get user initials (first 1-2 chars of first/last name) */
  const getUserInitials = () => {
    const name = user?.fullName || user?.name || "";
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    // Single name: take first 2 characters
    return parts[0].length >= 2
      ? parts[0].substring(0, 2).toUpperCase()
      : parts[0].charAt(0).toUpperCase();
  };

  return (
    <>
      {/* ==================== NAVBAR ==================== */}
      <header
        className={`fixed top-0 left-0 right-0 max-w-[1920px] mx-auto z-50 transition-all duration-300 ${isScrolled ? "bg-surface/95 backdrop-blur-md shadow-lg" : "bg-surface shadow-sm"}`}
        role="banner"
      >
        {/* ========== DESKTOP (lg+) ========== */}
        <nav
          className="hidden lg:flex items-center max-w-[1320px] mx-auto"
          style={{ height: 70, padding: "0 32px", gap: 20 }}
          aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main Navigation"}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="flex items-center shrink-0 group"
            style={{ gap: 10 }}
          >
            <img
              src={logo}
              alt="WashAlafas"
              className="rounded-lg object-contain"
              style={{ width: 60, height: 60 }}
            />
            <span className="text-[19px] font-bold text-primary whitespace-nowrap">
              {t(locale, "logo")}
            </span>
          </Link>

          {/* Nav Links */}
          <ul className="flex items-center" style={{ gap: 1 }} role="menubar">
            {navLinks.map((link) => (
              <li key={link.key} role="none">
                <Link
                  to={link.path}
                  role="menuitem"
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`relative whitespace-nowrap rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary-dark ${isActive(link.path) ? "text-primary-dark bg-primary/10 font-semibold" : "text-text-main font-medium"}`}
                  style={{
                    padding: "12px 14px",
                    fontSize: 14,
                    clipPath:
                      "polygon(30% 5%, 70% 5%, 90% 30%, 90% 70%, 70% 95%, 30% 95%, 10% 70%, 10% 30%)",
                  }}
                >
                  {t(locale, link.key)}
                  {isActive(link.path) && (
                    <span
                      className="absolute rounded-full bg-primary"
                      style={{
                        bottom: 2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 20,
                        height: 2.5,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search Bar */}
          <div
            className="relative shrink-0"
            style={{ width: 280, zIndex: 100 }}
          >
            {renderSearchBlock()}
          </div>

          {/* Action Icons */}
          <div className="flex items-center shrink-0" style={{ gap: 2 }}>
            <Link
              to="/cart"
              className="relative rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center"
              style={{ width: 42, height: 42 }}
              aria-label={t(locale, "cart")}
            >
              <CartIcon />
              <CartBadge count={cartCount} />
            </Link>
            <Link
              to="/wishlist"
              className="relative rounded-xl text-text-muted hover:text-flash hover:bg-flash/10 transition-all duration-200 flex items-center justify-center"
              style={{ width: 42, height: 42 }}
              aria-label={t(locale, "wishlist")}
            >
              <HeartIcon />
              <CartBadge count={wishlistItems.length} />
            </Link>
            <div className="relative" ref={desktopAccountRef}>
              <button
                onClick={handleAccountClick}
                className="rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center cursor-pointer"
                style={{
                  width: 42,
                  height: 42,
                  border: "none",
                  background: "transparent",
                }}
                aria-label={t(locale, "account")}
              >
                {isAuthenticated ? (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {getUserInitials()}
                  </div>
                ) : (
                  <UserIcon />
                )}
              </button>
              {/* Account Dropdown */}
              {isAccountDropdownOpen && isAuthenticated && (
                <div
                  className="absolute z-50"
                  style={{
                    top: 50,
                    ...(isRTL ? { left: 0 } : { right: 0 }),
                    width: 240,
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow:
                      "0 12px 40px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
                    border: "1px solid #E2E8F0",
                    overflow: "hidden",
                    animation: "accountDropIn 0.2s ease-out",
                  }}
                >
                  {/* Greeting */}
                  <div
                    style={{
                      padding: "18px 20px 14px",
                      borderBottom: "1px solid #F3F4F6",
                      background:
                        "linear-gradient(135deg, rgba(46,125,50,0.05) 0%, rgba(129,199,132,0.05) 100%)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        marginBottom: 2,
                      }}
                    >
                      {locale === "ar"
                        ? `\u0645\u0631\u062D\u0628\u0627\u064B ${getUserDisplayName()}`
                        : `Hello ${getUserDisplayName()}`}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280" }}>
                      {user?.email || ""}
                    </p>
                  </div>
                  {/* Links */}
                  <div style={{ padding: "8px" }}>
                    <Link
                      to="/account"
                      className="flex items-center rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary-dark"
                      style={{
                        gap: 12,
                        padding: "10px 14px",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#374151",
                        textDecoration: "none",
                      }}
                      onClick={() => setIsAccountDropdownOpen(false)}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.7}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {locale === "ar"
                        ? "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A"
                        : "Profile"}
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center rounded-xl transition-all duration-200 hover:bg-red-50 hover:text-red-600 w-full cursor-pointer"
                      style={{
                        gap: 12,
                        padding: "10px 14px",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#DC2626",
                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                        border: "none",
                        background: "transparent",
                        textAlign: isRTL ? "right" : "left",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.7}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                      </svg>
                      {locale === "ar"
                        ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C"
                        : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className="bg-text-muted/20"
              style={{ width: 1, height: 28, margin: "0 6px" }}
            />

            <button
              onClick={toggleLanguage}
              className="rounded-lg border border-text-muted/30 text-text-main font-semibold hover:border-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{ padding: "6px 14px", fontSize: 12 }}
              aria-label={
                locale === "ar" ? "Switch to English" : "التبديل إلى العربية"
              }
            >
              {t(locale, "switchLang")}
            </button>
          </div>
        </nav>

        {/* ========== MOBILE / TABLET (below lg) ========== */}
        <div
          className="lg:hidden relative transition-all duration-300"
          style={{ height: isScrolled ? 56 : 110 }}
        >
          {/* Top Row */}
          <div
            className="flex items-center justify-between relative"
            style={{ height: 56, padding: "0 16px", zIndex: 5 }}
          >
            <div className="flex items-center" style={{ gap: 10 }}>
              {/* Hamburger */}
              <button
                ref={menuButtonRef}
                onClick={toggleMobileMenu}
                className="rounded-lg text-text-main hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer flex items-center justify-center"
                style={{ width: 40, height: 40 }}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={
                  isMobileMenuOpen ? t(locale, "closeMenu") : t(locale, "menu")
                }
              >
                <div
                  style={{
                    width: 20,
                    height: 16,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    className="bg-current rounded-full transition-all duration-300"
                    style={{
                      display: "block",
                      height: 2,
                      width: 20,
                      transformOrigin: "center",
                      transform: isMobileMenuOpen
                        ? "rotate(45deg) translateY(7px)"
                        : "none",
                    }}
                  />
                  <span
                    className="bg-current rounded-full transition-all duration-300"
                    style={{
                      display: "block",
                      height: 2,
                      width: 20,
                      opacity: isMobileMenuOpen ? 0 : 1,
                    }}
                  />
                  <span
                    className="bg-current rounded-full transition-all duration-300"
                    style={{
                      display: "block",
                      height: 2,
                      width: 20,
                      transformOrigin: "center",
                      transform: isMobileMenuOpen
                        ? "rotate(-45deg) translateY(-7px)"
                        : "none",
                    }}
                  />
                </div>
              </button>

              {/* Logo */}
              <Link
                to="/"
                onClick={handleLogoClick}
                className={`flex items-center transition-all duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                style={{
                  gap: 8,
                  maxWidth: isScrolled ? 0 : 200,
                  overflow: "hidden",
                }}
                tabIndex={isScrolled ? -1 : 0}
              >
                <img
                  src={logo}
                  alt="WashAlafas"
                  className="rounded-lg object-contain shrink-0"
                  style={{ width: 42, height: 42 }}
                />
                <span className="text-[15px] font-bold text-primary whitespace-nowrap shrink-0">
                  {t(locale, "logo")}
                </span>
              </Link>
            </div>

            {/* Right Icons */}
            <div
              className="flex items-center relative"
              style={{ gap: 2 }}
              ref={mobileAccountRef}
            >
              <Link
                to="/cart"
                className="relative rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all duration-200 flex items-center justify-center shrink-0"
                style={{ width: 38, height: 38 }}
                aria-label={t(locale, "cart")}
              >
                <CartIcon size={20} />
                <CartBadge count={cartCount} />
              </Link>
              <Link
                to="/wishlist"
                className="relative rounded-lg text-text-muted hover:text-flash hover:bg-flash/10 transition-all duration-300 flex items-center justify-center shrink-0"
                style={{ width: 38, height: 38 }}
                aria-label={t(locale, "wishlist")}
              >
                <HeartIcon size={20} />
                <CartBadge count={wishlistItems.length} />
              </Link>
              <div className="relative">
                <button
                  onClick={handleAccountClick}
                  className={`rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                  style={{
                    width: isScrolled ? 0 : 38,
                    height: 38,
                    border: "none",
                    background: "transparent",
                  }}
                  aria-label={t(locale, "account")}
                >
                  <div
                    style={{
                      width: 38,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {isAuthenticated ? (
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {getUserInitials()}
                      </div>
                    ) : (
                      <UserIcon size={20} />
                    )}
                  </div>
                </button>

                {/* Account Dropdown for Mobile */}
                {isAccountDropdownOpen && isAuthenticated && (
                  <div
                    className="absolute z-50"
                    style={{
                      top: 46,
                      ...(isRTL ? { left: 0 } : { right: 0 }),
                      width: 240,
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow:
                        "0 12px 40px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
                      border: "1px solid #E2E8F0",
                      overflow: "hidden",
                      animation: "accountDropIn 0.2s ease-out",
                    }}
                  >
                    {/* Greeting */}
                    <div
                      style={{
                        padding: "18px 20px 14px",
                        borderBottom: "1px solid #F3F4F6",
                        background:
                          "linear-gradient(135deg, rgba(46,125,50,0.05) 0%, rgba(129,199,132,0.05) 100%)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#1a1a1a",
                          marginBottom: 2,
                        }}
                      >
                        {locale === "ar"
                          ? `\u0645\u0631\u062D\u0628\u0627\u064B ${getUserDisplayName()}`
                          : `Hello ${getUserDisplayName()}`}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          wordBreak: "break-all",
                        }}
                      >
                        {user?.email || ""}
                      </p>
                    </div>
                    {/* Links */}
                    <div style={{ padding: "8px" }}>
                      <Link
                        to="/account"
                        className="flex items-center rounded-xl transition-all duration-200 hover:bg-primary/10 hover:text-primary-dark"
                        style={{
                          gap: 12,
                          padding: "10px 14px",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#374151",
                          textDecoration: "none",
                        }}
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.7}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {locale === "ar"
                          ? "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062E\u0635\u064A"
                          : "Profile"}
                      </Link>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center rounded-xl transition-all duration-200 w-full cursor-pointer"
                        style={{
                          gap: 12,
                          padding: "10px 14px",
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#DC2626",
                          backgroundColor: "rgba(239, 68, 68, 0.05)",
                          border: "none",
                          textAlign: isRTL ? "right" : "left",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.7}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                          />
                        </svg>
                        {locale === "ar"
                          ? "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C"
                          : "Sign Out"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar - Floating & Animating */}
          <div
            className="absolute transition-all duration-300 ease-in-out"
            style={{
              zIndex: isScrolled ? 20 : 1,
              ...(isScrolled
                ? { top: 7, left: isRTL ? 104 : 66, right: isRTL ? 66 : 104 }
                : { top: 56, left: 16, right: 16 }),
            }}
          >
            <div className="w-full" style={{ zIndex: 100 }}>
              {renderSearchBlock()}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== MOBILE OVERLAY ==================== */}
      <div
        className={`fixed inset-0 z-40 bg-text-main/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ==================== MOBILE SLIDE MENU ==================== */}
      <aside
        ref={menuRef}
        id="mobile-menu"
        className={`fixed top-0 z-50 h-full bg-surface shadow-2xl transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isRTL ? "right-0" : "left-0"} ${isMobileMenuOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}`}
        style={{ width: 280 }}
        aria-label={locale === "ar" ? "القائمة الجانبية" : "Side Menu"}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-bg"
          style={{ padding: "16px 20px" }}
        >
          <Link
            to="/"
            className="flex items-center"
            style={{ gap: 10 }}
            onClick={(e) => {
              handleLogoClick(e);
              setIsMobileMenuOpen(false);
            }}
          >
            <img
              src={logo}
              alt="WashAlafas"
              className="rounded-lg object-contain"
              style={{ width: 36, height: 36 }}
            />
            <span className="text-[17px] font-bold text-primary">
              {t(locale, "logo")}
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg text-text-muted hover:text-text-main hover:bg-bg transition-all duration-200 cursor-pointer flex items-center justify-center"
            style={{ width: 36, height: 36 }}
            aria-label={t(locale, "closeMenu")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav style={{ padding: "16px 16px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {navLinks.map((link, i) => (
              <li
                key={link.key}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link
                  to={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center rounded-xl transition-all duration-200 ${isActive(link.path) ? "bg-primary text-surface shadow-md shadow-primary/30" : "text-text-main hover:bg-primary/10 hover:text-primary-dark"}`}
                  style={{
                    gap: 12,
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{ width: 22, height: 22, flexShrink: 0, padding: 2 }}
                  >
                    {MobileNavIcons[link.key]}
                  </span>
                  {t(locale, link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t border-bg bg-bg/50"
          style={{ padding: 16 }}
        >
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center bg-surface border border-text-muted/20 text-text-main hover:border-primary/50 hover:text-primary transition-all duration-200 cursor-pointer rounded-xl"
            style={{
              gap: 8,
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t(locale, "switchLang")}
          </button>
        </div>
      </aside>

      {/* ==================== SPACER ==================== */}
      {/* Desktop: 70px | Mobile: 56px top + 54px search = 110px */}
      <div style={{ height: 110 }} className="lg:hidden" />
      <div style={{ height: 70 }} className="hidden lg:block" />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(${isRTL ? "12px" : "-12px"}); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
        @keyframes accountDropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* ==================== LOGOUT MODAL ==================== */}
      {isLogoutModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            padding: 24,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              width: "100%",
              maxWidth: 400,
              border: "1px solid #E2E8F0",
              transform: "scale(1)",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: "#FEF2F2",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  color: "#EF4444",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: 20,
                  color: "#1a1a1a",
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                {locale === "ar" ? "تسجيل الخروج" : "Sign Out"}
              </h3>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 15,
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                {locale === "ar"
                  ? "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك المنشأ في التطبيق؟"
                  : "Are you sure you want to sign out of your account?"}
              </p>

              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#374151",
                    fontWeight: 600,
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5E7EB";
                    e.currentTarget.style.color = "#1F2937";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                    e.currentTarget.style.color = "#374151";
                  }}
                >
                  {locale === "ar" ? "تراجع" : "Cancel"}
                </button>
                <button
                  onClick={confirmLogout}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#ffffff",
                    fontWeight: 600,
                    backgroundColor: "#DC2626",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px -1px rgba(220, 38, 38, 0.1)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#B91C1C";
                    e.currentTarget.style.boxShadow =
                      "0 10px 15px -3px rgba(220, 38, 38, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#DC2626";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(220, 38, 38, 0.1)";
                  }}
                >
                  {locale === "ar" ? "نعم، متأكد" : "Yes, Sign Out"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
