import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import ProductCard from "../components/ProductCard";
import FAQ from "../components/FAQ/FAQ";
import OffersSlider from "../components/OffersSlider/OffersSlider";
import CategoriesSection from "../components/CategoriesSection/CategoriesSection";
import ProductSliderSection from "../components/ProductSliderSection/ProductSliderSection";
import { useDashboardData } from "../Dashboard/shared/DashboardDataContext";

export default function HomePage() {
  const { locale, direction } = useLanguage();
  const { products: mockProducts } = useDashboardData();
  const isRTL = direction === "rtl";
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const slider = document.getElementById("product-slider");
    if (!slider) return;

    let isPaused = false;
    const scrollStep = isRTL ? -300 : 300;
    
    const interval = setInterval(() => {
      if (isPaused) return;
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      
      if (Math.abs(slider.scrollLeft) >= maxScroll - 5) {
        slider.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        slider.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 3000);

    const handleEnter = () => { isPaused = true; };
    const handleLeave = () => { isPaused = false; };
    
    slider.addEventListener("mouseenter", handleEnter);
    slider.addEventListener("mouseleave", handleLeave);
    slider.addEventListener("touchstart", handleEnter);
    slider.addEventListener("touchend", handleLeave);

    return () => {
      clearInterval(interval);
      slider.removeEventListener("mouseenter", handleEnter);
      slider.removeEventListener("mouseleave", handleLeave);
      slider.removeEventListener("touchstart", handleEnter);
      slider.removeEventListener("touchend", handleLeave);
    };
  }, [isRTL]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* ===== Hero ===== */}
      <Hero />

      {/* ===== About ===== */}
      <div id="about">
        <About />
      </div>

      {/* ===== Stats ===== */}
      <section
        className="bg-white"
        style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}
      >
        <div
          className="max-w-[1920px] w-full mx-auto grid grid-cols-2 md:grid-cols-4 text-center px-4 sm:px-8 md:px-12 lg:px-16"
          style={{ padding: "32px 0", gap: 12 }}
        >
          {[
            { num: "10K+", label: locale === "ar" ? "منتج" : "Products" },
            {
              num: "50K+",
              label: locale === "ar" ? "عميل سعيد" : "Happy Customers",
            },
            {
              num: "99%",
              label: locale === "ar" ? "رضا العملاء" : "Satisfaction",
            },
            { num: "24/7", label: locale === "ar" ? "دعم فني" : "Support" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "6px 0" }}>
              <div
                className="font-extrabold text-primary"
                style={{ fontSize: "clamp(22px, 4vw, 32px)" }}
              >
                {stat.num}
              </div>
              <div
                className="text-gray-500 font-medium"
                style={{ fontSize: 13, marginTop: 2 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ===== Exclusive Offers - Horizontal Slider ===== */}
      <section style={{ background: "#f8faf8", padding: "36px 30px 24px" }}>
        <div className="max-w-[1920px] w-full mx-auto">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16"
            style={{ marginBottom: 16 }}
          >
            <h2
              className="flex items-center gap-2 font-extrabold text-gray-800"
              style={{ fontSize: "clamp(17px, 3.5vw, 24px)" }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#fireGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="fireGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#2E7D32" />
                    <stop offset="50%" stopColor="#43A047" />
                    <stop offset="100%" stopColor="#66BB6A" />
                  </linearGradient>
                </defs>
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
              {locale === "ar" ? "عروض حصرية" : "Exclusive Offers"}
            </h2>
            <div className="flex items-center" style={{ gap: 10 }}>
              <a
                href="/products"
                className="font-semibold transition-all duration-300 flex items-center group"
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
              </a>
            </div>
          </div>

          {/* Slider - full width */}
          <div
            id="product-slider"
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
            {mockProducts.slice(0, 6).map((product) => (
              <div
                key={`slider-${product.id}`}
                className="shrink-0 transition-transform duration-300"
                style={{ width: "clamp(240px, 75vw, 320px)" }}
              >
                <ProductCard product={product} />
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
                document.getElementById("product-slider").scrollBy({
                  left: isRTL ? 250 : -250,
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
                document.getElementById("product-slider").scrollBy({
                  left: isRTL ? -250 : 250,
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


      {/* ===== Categories ===== */}
      <CategoriesSection />

      {/* ===== Offers Slider ===== */}
      <OffersSlider />

      {/* ===== Product Slider Sections ===== */}
      <ProductSliderSection
        titleAr="الخضروات الطازجة"
        titleEn="Fresh Vegetables"
        sliderId="vegetables-slider"
        products={mockProducts.slice(3, 9)}
      />

      <ProductSliderSection
        titleAr="الفواكه الموسمية"
        titleEn="Seasonal Fruits"
        sliderId="fruits-slider"
        products={mockProducts.slice(2, 8)}
      />

      <ProductSliderSection
        titleAr="أفضل العروض"
        titleEn="Best Deals"
        sliderId="deals-slider"
        products={mockProducts.slice(1, 7)}
      />

      {/* ===== All Products - Full Width Grid ===== */}
      <section id="products" style={{ background: "#f8faf8", padding: "12px 0 48px" }}>


        {/* Header */}
        {/* <div
          className="flex items-center justify-between"
          style={{ padding: "0 12px", marginBottom: 16 }}
        >
          <h2
            className="flex items-center gap-2 font-extrabold text-gray-800"
            style={{ fontSize: "clamp(17px, 3.5vw, 24px)" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E7D32"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            {locale === "ar" ? "جميع المنتجات" : "All Products"}
          </h2>
          <a
            href="/products"
            className="font-semibold transition-all duration-300 flex items-center group"
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
          </a>
        </div> */}
        {/* Grid - fills correctly with consistent margin/gap */}
        {/* <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 px-2 sm:gap-[10px] sm:px-[12px]"
          style={{ gap: 10, padding: "0 12px" }}
        >
          {mockProducts.map((product) => (
            <ProductCard key={`grid-${product.id}`} product={product} />
          ))}
        </div> */}


      </section>

      {/* ===== FAQ Section ===== */}
      <div id="faq">
        <div id="contact">
          <FAQ />
        </div>
      </div>
    </div>
  );
}
