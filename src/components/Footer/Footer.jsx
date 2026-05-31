import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDashboardData } from "../../Dashboard/shared/DashboardDataContext";

export default function Footer() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { categories: apiCategories } = useDashboardData();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success(locale === "ar" ? "تم الاشتراك في النشرة البريدية بنجاح، شكراً لك!" : "Subscribed to the newsletter successfully, thank you!");
    setEmail("");
  };

  const quickLinks = [
    { label: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
    { label: locale === "ar" ? "من نحن" : "About", path: "/#about" },
    { label: locale === "ar" ? "المنتجات" : "Products", path: "/products" },
    { label: locale === "ar" ? "تواصل معنا" : "Contact", path: "/contact" },
  ];

  // Dynamically get the first 3 categories from API
  const dynamicCategories = (apiCategories || [])
    .filter(c => c.slug !== 'offers' && c.id !== 'offers')
    .slice(0, 3)
    .map(c => ({
      label: locale === "ar" ? c.nameAr : c.nameEn,
      path: `/products?category=${c.id}`
    }));

  const categories = [
    ...dynamicCategories,
    { label: locale === "ar" ? "العروض الحصريه" : "Exclusive Offers", path: "/products?category=offers" },
  ];

    const socialLinks = [
      {
        name: "Facebook",
        href: "https://www.facebook.com/share/1AxFovEF5j/",
        color: "#1877F2",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>,
      },
      {
        name: "WhatsApp",
        href: "https://wa.me/201151721654",
        color: "#25D366",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>,
      },
      {
        name: "Telegram",
        href: "https://t.me/+201015762659",
        color: "#229ED9",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>,
      },
      {
        name: "Instagram",
        href: "https://www.instagram.com/washalafas?igsh=ZjFoc2ZtOHVvN3R4",
        color: "#E1306C",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.44-.645 1.44-1.44-.644-1.44-1.44-1.44z"/></svg>,
      },
    ];

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="flex flex-col items-center w-full"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #1a2332 100%)",
      }}
    >
      <style>{`
        @keyframes socialBounce {
          0%, 100% { transform: translateY(0) scale(1.05); }
          50% { transform: translateY(-4px) scale(1.05); }
        }
      `}</style>
      {/* Top decorative wave */}
      <div className="w-full" style={{ background: "#f8faf8", marginBottom: -1 }}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", width: "100%" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0 80V30C240 60 480 0 720 30C960 60 1200 0 1440 30V80H0Z"
            fill="#0f172a"
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div
        className="w-full max-w-[1320px]"
        style={{ padding: "48px 28px 0" }}
      >
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${isRTL ? "text-right" : "text-left"}`}
          style={{ gap: 40 }}
        >
          {/* ===== Brand Column ===== */}
          <div>
            <Link
              to="/"
              className="flex items-center"
              style={{ gap: 10, marginBottom: 16 }}
            >
              <img
                src={logo}
                alt="WashAlafas"
                className="rounded-xl object-contain"
                style={{
                  width: 46,
                  height: 46,
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
              />
              <span
                className="font-bold"
                style={{ fontSize: 19, color: "#81C784" }}
              >
                {locale === "ar" ? "وش الأفص" : "WashAlafas"}
              </span>
            </Link>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.9,
                marginBottom: 24,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {locale === "ar"
                ? "وجهتك الأولى للحصول على أفضل الخضروات والفواكه الطازجة بأسعار تنافسية وجودة لا تُضاهى."
                : "Your premier destination for the best fresh vegetables and fruits at competitive prices with unbeatable quality."}
            </p>

            {/* Social Icons */}
            <div className="flex" style={{ gap: 10 }}>
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#81C784",
                  }}
                  aria-label={s.name}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(46,125,50,0.3)";
                    e.currentTarget.style.borderColor = "rgba(46,125,50,0.5)";
                    if (s.color) e.currentTarget.style.color = s.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#81C784";
                  }}
                >
                  <span
                    style={{ 
                      animation: `socialBounce 2s ease-in-out infinite`,
                      animationDelay: `${s.name.length * 0.1}s`,
                      display: 'flex' 
                    }}
                  >
                    {s.svg}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ===== Quick Links ===== */}
          <div>
            <h4
              className="font-bold uppercase"
              style={{
                fontSize: 12,
                letterSpacing: 1.5,
                marginBottom: 20,
                color: "#81C784",
              }}
            >
              {locale === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.path}
                    className="flex items-center transition-all duration-200 group"
                    style={{
                      gap: 8,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#81C784";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    <span
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      style={{ fontSize: 10, color: "#2E7D32" }}
                    >
                      {isRTL ? "‹" : "›"}
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Categories ===== */}
          <div>
            <h4
              className="font-bold uppercase"
              style={{
                fontSize: 12,
                letterSpacing: 1.5,
                marginBottom: 20,
                color: "#81C784",
              }}
            >
              {locale === "ar" ? "الأقسام" : "Categories"}
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {categories.map((cat, i) => (
                <li key={i}>
                  <Link
                    to={cat.path}
                    className="flex items-center transition-all duration-200 group"
                    style={{
                      gap: 8,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#81C784";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                    }}
                  >
                    <span
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      style={{ fontSize: 10, color: "#2E7D32" }}
                    >
                      {isRTL ? "‹" : "›"}
                    </span>
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Contact ===== */}
          <div>
            <h4
              className="font-bold uppercase"
              style={{
                fontSize: 12,
                letterSpacing: 1.5,
                marginBottom: 20,
                color: "#81C784",
              }}
            >
              {locale === "ar" ? "تواصل معنا" : "Contact Us"}
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Location */}
              <li className="flex items-start" style={{ gap: 12 }}>
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(46,125,50,0.12)",
                  }}
                >
                  <lord-icon
                    src="/icons/surcxhka.json"
                    trigger="loop"
                    delay="3000"
                    colors="primary:#81C784"
                    style={{ width: "22px", height: "22px" }}
                  />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    {locale === "ar"
                      ? "القاهرة"
                      : "Cairo"}
                  </span>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start" style={{ gap: 12 }}>
                <a
                  href="tel:01115313444"
                  className="flex items-start transition-colors duration-200 group"
                  style={{ gap: 12, textDecoration: "none" }}
                  onMouseEnter={(e) => {
                    const phoneText = e.currentTarget.querySelector('.phone-text');
                    if (phoneText) phoneText.style.color = "#81C784";
                  }}
                  onMouseLeave={(e) => {
                    const phoneText = e.currentTarget.querySelector('.phone-text');
                    if (phoneText) phoneText.style.color = "rgba(255,255,255,0.55)";
                  }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(46,125,50,0.12)",
                    }}
                  >
                    <lord-icon
                      src="/icons/rsvfayfn.json"
                      trigger="loop"
                      delay="3000"
                      colors="primary:#81C784"
                      style={{ width: "22px", height: "22px" }}
                    />
                  </div>
                  <div>
                    <span
                      className="phone-text"
                      dir="ltr"
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.55)",
                        lineHeight: 1.6,
                        transition: "color 0.2s"
                      }}
                    >
                      01115313444
                    </span>
                  </div>
                </a>
              </li>

              {/* Email */}
              <li className="flex items-start" style={{ gap: 12 }}>
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(46,125,50,0.12)",
                  }}
                >
                  <lord-icon
                    src="/icons/diihvcfp.json"
                    trigger="loop"
                    delay="3000"
                    colors="primary:#81C784"
                    style={{ width: "22px", height: "22px" }}
                  />
                </div>
                <div>
                  <a
                    href="mailto:info@washalafas.com"
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                      textDecoration: "none",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#81C784"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                  >
                    info@washalafas.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== App Download Section ===== */}
        <div
          className="flex flex-col md:flex-row items-center justify-between"
          style={{
            marginTop: 48,
            padding: "32px",
            borderRadius: 16,
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            gap: 24,
          }}
        >
          <div className="flex items-center" style={{ gap: 20 }}>
            <div
              className="flex items-center justify-center shrink-0"
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                boxShadow: "0 8px 24px rgba(46,125,50,0.3)"
              }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} color="#fff">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2" style={{ fontSize: "clamp(18px, 2vw, 22px)" }}>
                {locale === "ar" ? "حمل تطبيق وش الأفص" : "Download WashAlafas App"}
              </h4>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "clamp(13px, 1.2vw, 15px)", maxWidth: 500 }}>
                {locale === "ar" 
                  ? "تجربة تسوق أسرع وأسهل من خلال تطبيقنا للأندرويد والآيفون." 
                  : "A faster and easier shopping experience through our app for Android and iPhone."}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            {/* App Store Button */}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: 12,
                gap: 12,
                minWidth: 160,
                textDecoration: "none"
              }}
            >
              <svg viewBox="0 0 384 512" width="28" height="28" fill="#fff">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
              </svg>
              <div className="flex flex-col" style={{ alignItems: isRTL ? "flex-end" : "flex-start", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1 }}>Download on the</span>
                <span style={{ fontSize: 16, color: "#fff", fontWeight: "bold", lineHeight: 1, marginTop: 4 }}>App Store</span>
              </div>
            </a>

            {/* Google Play Button */}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 16px",
                borderRadius: 12,
                gap: 12,
                minWidth: 160,
                textDecoration: "none"
              }}
            >
              <svg viewBox="0 0 512 512" width="26" height="26" fill="#fff">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              <div className="flex flex-col" style={{ alignItems: isRTL ? "flex-end" : "flex-start", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", lineHeight: 1 }}>GET IT ON</span>
                <span style={{ fontSize: 16, color: "#fff", fontWeight: "bold", lineHeight: 1, marginTop: 4 }}>Google Play</span>
              </div>
            </a>
          </div>
        </div>

        {/* ===== Newsletter Section ===== */}
        <div
          style={{
            marginTop: 48,
            padding: "28px 24px",
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(46,125,50,0.15) 0%, rgba(129,199,132,0.08) 100%)",
            border: "1px solid rgba(46,125,50,0.2)",
          }}
        >
          <div
            className="flex flex-col sm:flex-row items-center justify-between"
            style={{ gap: 20 }}
          >
            <div className="flex items-center" style={{ gap: 12 }}>
              <lord-icon
                src="/icons/diihvcfp.json"
                trigger="loop"
                delay="2000"
                colors="primary:#81C784,secondary:#2E7D32"
                style={{ width: "36px", height: "36px" }}
              />
              <div>
                <h5
                  className="font-bold"
                  style={{ fontSize: 15, color: "#fff", marginBottom: 2 }}
                >
                  {locale === "ar"
                    ? "اشترك في النشرة البريدية"
                    : "Subscribe to Newsletter"}
                </h5>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                  {locale === "ar"
                    ? "احصل على أحدث العروض والمنتجات الجديدة"
                    : "Get the latest deals and new products"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full lg:w-auto" style={{ gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  locale === "ar" ? "بريدك الإلكتروني" : "Your email"
                }
                className="w-full sm:w-auto focus:outline-none focus:border-primary"
                style={{
                  height: 44,
                  padding: "0 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  fontSize: 13,
                }}
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-95 cursor-pointer"
                style={{
                  height: 44,
                  padding: "0 24px",
                  borderRadius: 10,
                  background: "#2E7D32",
                  color: "#fff",
                  border: "none",
                  fontSize: 13,
                }}
              >
                {locale === "ar" ? "اشتراك" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between"
          style={{
            marginTop: 32,
            padding: "20px 0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: 12,
            gap: 12,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.4)" }}>
            &copy; {new Date().getFullYear()}{" "}
            {locale === "ar"
              ? "جميع الحقوق محفوظة — وش الأفص"
              : "All rights reserved — WashAlafas"}
          </p>
          <div className="flex items-center" style={{ gap: 16 }}>
            <Link
              to="/privacy"
              className="transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#81C784";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              {locale === "ar" ? "سياسة الخصوصية" : "Privacy"}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <Link
              to="/terms"
              className="transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#81C784";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.4)";
              }}
            >
              {locale === "ar" ? "الشروط والأحكام" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
