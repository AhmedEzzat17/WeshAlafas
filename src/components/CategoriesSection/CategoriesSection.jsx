import { useLanguage } from "../../context/LanguageContext";
import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDashboardData } from "../../Dashboard/shared/DashboardDataContext";

export default function CategoriesSection() {
  const { locale, direction } = useLanguage();
  const { categories: apiCategories } = useDashboardData();
  const isRTL = direction === "rtl";
  const gridRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll on mobile (< 768px)
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let interval;
    const startAutoScroll = () => {
      if (window.innerWidth >= 768) return;
      interval = setInterval(() => {
        if (isPaused) return;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        if (grid.scrollLeft >= maxScroll - 5) {
          grid.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          grid.scrollBy({ left: 150, behavior: "smooth" });
        }
      }, 3000);
    };

    startAutoScroll();

    const handleResize = () => {
      clearInterval(interval);
      startAutoScroll();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPaused]);

  const categories = useMemo(() => {
    return apiCategories.map(cat => {
      const isOffers = 
        cat.slug === "offers" || 
        cat.nameAr === "العروض" || 
        cat.nameAr === "العروض الحصرية" || 
        cat.nameAr === "العروض الحصريه" || 
        String(cat.id) === "offers";

      return {
        id: isOffers ? "offers" : cat.id,          // Map to 'offers' to match the filter page!
        slug: cat.slug,
        titleEn: isOffers ? "Exclusive Offers" : (cat.nameEn || cat.name?.en || cat.name || "Category"),
        titleAr: isOffers ? "العروض الحصرية" : (cat.nameAr || cat.name?.ar || cat.name || "قسم"),
        image: cat.image || null,
      };
    });
  }, [apiCategories]);

  return (
    <section id="categories" className="bg-white" style={{ padding: "48px 30px" }} dir={isRTL ? "rtl" : "ltr"}>
      <style>{`
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes wiggleIcon {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-float-icon {
          animation: floatIcon 3s ease-in-out infinite;
        }
        .animate-wiggle-icon {
          animation: wiggleIcon 2.5s ease-in-out infinite;
        }
        .hide-scroll-bar::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll-bar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* كلاس يحافظ على حجم الأقسام بالضبط مثل أول مرة، لكن يسمح بإضافة عدد لا نهائي ويمررهم */
        .category-slide-item {
          flex: 0 0 calc(50% - 8px); /* في الجوال يظهر 2 */
          width: calc(50% - 8px);
        }
        @media (min-width: 640px) {
          .category-slide-item {
            flex: 0 0 calc(33.333% - 11px);
            width: calc(33.333% - 11px);
          }
        }
        @media (min-width: 768px) {
          .category-slide-item {
            flex: 0 0 calc(25% - 12px); /* في الشاشات العادية يظهر 4 ليطابق الحجم القديم */
            width: calc(25% - 12px);
          }
        }
      `}</style>
      <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="flex items-center gap-2 font-extrabold text-gray-800" style={{ fontSize: "clamp(17px, 3.5vw, 24px)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            {locale === "ar" ? "الأقسام" : "Categories"}
          </h2>

          <div className="flex items-center" style={{ gap: 10 }}>
            <Link
              to="/categories"
              className="font-semibold transition-all duration-300 flex items-center group shrink-0"
              style={{
                gap: 6,
                fontSize: 13,
                background: "linear-gradient(135deg, #2E7D32, #43A047)",
                color: "#fff",
                padding: "7px 16px",
                margin: "12px",
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* أزرار السحب في الشاشات الكبيرة لتسهيل تصفح الأقسام عند إضافة المزيد */}
            {/* <div className="hidden sm:flex items-center" style={{ gap: 6 }}>
              <button
                className="flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: "2px solid #2E7D32",
                  background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
                  color: "#2E7D32",
                  boxShadow: "0 2px 8px rgba(46,125,50,0.15)",
                }}
                onClick={() => {
                  document.getElementById("categories-grid").scrollBy({ left: isRTL ? 250 : -250, behavior: "smooth" });
                }}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: "22px", height: "22px", transform: "scaleX(-1)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                className="flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: "2px solid #2E7D32",
                  background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
                  color: "#2E7D32",
                  boxShadow: "0 2px 8px rgba(46,125,50,0.15)",
                }}
                onClick={() => {
                  document.getElementById("categories-grid").scrollBy({ left: isRTL ? -250 : 250, behavior: "smooth" });
                }}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: "22px", height: "22px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div> */}
          </div>
        </div>

        {/* Categories Wrapper (Scrollable Grid identical to the first one) */}
        <div
          id="categories-grid"
          ref={gridRef}
          className="flex overflow-x-auto hide-scroll-bar scroll-smooth pb-4 "
          style={{ gap: 16 }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 4000)}
          onMouseDown={(e) => {
            setIsPaused(true);
            e.currentTarget.isDown = true;
            e.currentTarget.startX = e.pageX - e.currentTarget.offsetLeft;
            e.currentTarget.sLeft = e.currentTarget.scrollLeft;
          }}
          onMouseLeave={(e) => { e.currentTarget.isDown = false; setTimeout(() => setIsPaused(false), 4000); }}
          onMouseUp={(e) => { e.currentTarget.isDown = false; setTimeout(() => setIsPaused(false), 4000); }}
          onMouseMove={(e) => {
            if (!e.currentTarget.isDown) return;
            e.preventDefault();
            const x = e.pageX - e.currentTarget.offsetLeft;
            const walk = (x - e.currentTarget.startX) * 2;
            e.currentTarget.scrollLeft = e.currentTarget.sLeft - walk;
          }}
        >
          {categories.map((cat) => (
            <Link
              to={`/products?category=${cat.id}`}
              key={cat.id}
              className="category-slide-item flex flex-col items-center justify-center text-center rounded-2xl border transition-all duration-300 group cursor-pointer hover:shadow-lg hover:-translate-y-1"
              style={{ padding: "24px 16px", textDecoration: "none", borderColor: "#bbf7d0", margin: "15px 0" }}
            >
              <div
                className="flex items-center justify-center rounded-xl shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-110"
                style={{ width: 80, height: 80, background: cat.image ? "transparent" : "linear-gradient(135deg, #e8f5e9, #c8e6c9)" }}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={locale === "ar" ? cat.titleAr : cat.titleEn}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
                  />
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                )}
              </div>
              <h3 className="font-bold text-gray-800" style={{ fontSize: "clamp(15px, 2.5vw, 17px)", marginTop: 8 }}>
                {locale === "ar" ? cat.titleAr : cat.titleEn}
              </h3>
            </Link>
          ))}
        </div>

        {/* Arrows (Visible if more than 4 categories) */}
        {categories.length > 4 && (
          <div className="flex items-center justify-center mt-6" style={{ gap: 12 }} dir="ltr">
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
                document.getElementById("categories-grid")?.scrollBy({
                  left: scrollAmount,
                  behavior: "smooth",
                });
              }}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ width: "24px", height: "24px", transform: "scaleX(-1)" }}>
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
                document.getElementById("categories-grid")?.scrollBy({
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
        )}
      </div>
    </section>
  );
}
