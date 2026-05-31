import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";
import { useDashboardData } from "../../Dashboard/shared/DashboardDataContext";

export default function ProductSliderSection({
  titleAr = "منتجات مميزة",
  titleEn = "Featured Products",
  sliderId = "product-slider-section",
  products,
  icon,
  isOffer = false,
}) {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { products: mockProducts } = useDashboardData();

  // استخدم المنتجات الممررة أو المنتجات الافتراضية
  const displayProducts = products || mockProducts.slice(0, 6);

  // أيقونة افتراضية إن لم تُمرر أيقونة مخصصة
  const defaultIcon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#sliderGradient)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="sliderGradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="50%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#66BB6A" />
        </linearGradient>
      </defs>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );

  return (
    <section style={{ background: "#f8faf8", padding: "36px 30px 24px" }}>
      <div className="max-w-[1920px] w-full mx-auto">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16"
          style={{ marginBottom: 16, gap: 12 }}
        >
          <h2
            className="flex items-center gap-2 font-extrabold text-gray-800"
            style={{ fontSize: "clamp(16px, 3.5vw, 24px)", lineHeight: 1.3, flex: 1 }}
          >
            {icon || defaultIcon}
            {locale === "ar" ? titleAr : titleEn}
          </h2>
          <div className="flex items-center" style={{ gap: 10 }}>
            <Link
              to="/products"
              className="font-semibold transition-all duration-300 flex items-center shrink-0 group whitespace-nowrap"
              style={{
                gap: 6,
                fontSize: 13,
                background: "linear-gradient(135deg, #2E7D32, #43A047)",
                color: "#fff",
                padding: "7px 16px",
                borderRadius: 10,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(46,125,50,0.25)",
              }}
            >
              {locale === "ar" ? "عرض الكل" : "View All"}
              <svg
                className={`transition-transform duration-300 ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                style={{
                  width: 18,
                  height: 18,
                  transform: isRTL ? "scaleX(-1)" : "none",
                  flexShrink: 0,
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div
          id={sliderId}
          className="flex overflow-x-auto no-scrollbar scroll-smooth pb-4"
          style={{ gap: 16 }}
          onMouseDown={(e) => {
            e.currentTarget.isDown = true;
            e.currentTarget.startX = e.pageX - e.currentTarget.offsetLeft;
            e.currentTarget.sLeft = e.currentTarget.scrollLeft;
          }}
          onMouseLeave={(e) => (e.currentTarget.isDown = false)}
          onMouseUp={(e) => (e.currentTarget.isDown = false)}
          onMouseMove={(e) => {
            if (!e.currentTarget.isDown) return;
            e.preventDefault();
            const x = e.pageX - e.currentTarget.offsetLeft;
            const walk = (x - e.currentTarget.startX) * 2;
            e.currentTarget.scrollLeft = e.currentTarget.sLeft - walk;
          }}
        >
          {displayProducts.map((product) => (
            <div
              key={`${sliderId}-${product.id}`}
              className="shrink-0 transition-transform duration-300"
              style={{ width: "clamp(240px, 75vw, 320px)" }}
            >
              <ProductCard product={product} isOffer={isOffer} />
            </div>
          ))}
        </div>

        {/* Arrows (Moved to Bottom) */}
        <div className="flex items-center justify-center mt-6" style={{ gap: 12, marginTop: 20 }} dir="ltr">
          <button
            className="flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            style={{
              width: 42,
              height: 42,
              borderRadius: "10px",
              border: "2px solid #2E7D32",
              background: "white",
              color: "#2E7D32",
              boxShadow: "0 4px 12px rgba(46,125,50,0.15)",
            }}
            onClick={() => {
              const scrollAmount = isRTL ? 250 : -250;
              document.getElementById(sliderId)?.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
              });
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              style={{
                width: "24px",
                height: "24px",
                transform: "scaleX(-1)",
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
          <button
            className="flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
            style={{
              width: 42,
              height: 42,
              borderRadius: "10px",
              border: "2px solid #2E7D32",
              background: "white",
              color: "#2E7D32",
              boxShadow: "0 4px 12px rgba(46,125,50,0.15)",
            }}
            onClick={() => {
              const scrollAmount = isRTL ? -250 : 250;
              document.getElementById(sliderId)?.scrollBy({
                left: scrollAmount,
                behavior: "smooth",
              });
            }}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: "24px", height: "24px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
