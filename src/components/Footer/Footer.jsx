import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const quickLinks = [
    { label: locale === "ar" ? "الرئيسية" : "Home", path: "/" },
    { label: locale === "ar" ? "من نحن" : "About", path: "/about" },
    { label: locale === "ar" ? "المنتجات" : "Products", path: "/products" },
    { label: locale === "ar" ? "تواصل معنا" : "Contact", path: "/contact" },
  ];

  const categories = [
    { label: locale === "ar" ? "فواكه طازجة" : "Fresh Fruits", path: "/products?category=fruits" },
    { label: locale === "ar" ? "خضروات عضوية" : "Organic Vegetables", path: "/products?category=vegetables" },
    { label: locale === "ar" ? "حبوب ومحاصيل" : "Grains", path: "/products?category=grains" },
    { label: locale === "ar" ? "العروض الحصريه" : "Exclusive Offers", path: "/products?category=offers" },
  ];

    const socialLinks = [
      {
        name: "Facebook",
        href: "#",
        color: "#1877F2",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>,
      },
      {
        name: "WhatsApp",
        href: "#",
        color: "#25D366",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>,
      },
      {
        name: "Telegram",
        href: "#",
        color: "#229ED9",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/></svg>,
      },
      {
        name: "Instagram",
        href: "#",
        color: "#E1306C",
        svg: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.44-.645 1.44-1.44-.644-1.44-1.44-1.44z"/></svg>,
      },
    ];

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
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
      <div style={{ background: "#f8faf8", marginBottom: -1 }}>
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
        className="max-w-[1320px] mx-auto"
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
                      ? "123 شارع المزارع، المدينة"
                      : "123 Farm Street, City"}
                  </span>
                </div>
              </li>

              {/* Phone */}
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
                    src="/icons/rsvfayfn.json"
                    trigger="loop"
                    delay="3000"
                    colors="primary:#81C784"
                    style={{ width: "22px", height: "22px" }}
                  />
                </div>
                <div>
                  <span
                    dir="ltr"
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    +20 123 456 7890
                  </span>
                </div>
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
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      lineHeight: 1.6,
                    }}
                  >
                    info@washalafas.com
                  </span>
                </div>
              </li>
            </ul>
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
            <div className="flex flex-col sm:flex-row w-full lg:w-auto" style={{ gap: 8 }}>
              <input
                type="email"
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
            </div>
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
