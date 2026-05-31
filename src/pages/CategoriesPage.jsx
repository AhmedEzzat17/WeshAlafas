import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useDashboardData } from "../Dashboard/shared/DashboardDataContext";
import { CategorySkeleton } from "../components/Skeleton";

const gradients = [
  { bg: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", text: "#2E7D32" },
  { bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)", text: "#E65100" },
  { bg: "linear-gradient(135deg, #fef9e7 0%, #f9e79f 100%)", text: "#795548" },
  { bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)", text: "#C62828" },
  { bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", text: "#1565C0" },
  { bg: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)", text: "#6A1B9A" },
];

export default function CategoriesPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const { categories: apiCategories, loading } = useDashboardData();

  const categories = useMemo(() => {
    return apiCategories.map((cat, index) => {
      const theme = gradients[index % gradients.length];
      const isOffers = 
        cat.slug === "offers" || 
        cat.nameAr === "العروض" || 
        cat.nameAr === "العروض الحصرية" || 
        cat.nameAr === "العروض الحصريه" || 
        String(cat.id) === "offers";

      return {
        id: isOffers ? "offers" : cat.id,       // Map to 'offers' to match the filter page!
        slug: cat.slug,
        titleEn: isOffers ? "Exclusive Offers" : (cat.nameEn || cat.name?.en || cat.name || "Category"),
        titleAr: isOffers ? "العروض الحصرية" : (cat.nameAr || cat.name?.ar || cat.name || "قسم"),
        descEn: isOffers ? "Exclusive deals and discounts on your favorites" : (cat.description?.en || cat.description || "Browse our fresh products in this category"),
        descAr: isOffers ? "عروض وخصومات حصرية على منتجاتك المفضلة" : (cat.description?.ar || cat.description || "تصفح منتجاتنا الطازجة في هذا القسم"),
        image: cat.image || null,
        gradient: theme.bg,
        accentColor: theme.text,
      };
    });
  }, [apiCategories]);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      style={{ minHeight: "80vh", background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)" }}
    >
      <style>{`
        @keyframes categoryFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .category-card-page {
          animation: categoryFadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .category-card-page:nth-child(1) { animation-delay: 0.1s; }
        .category-card-page:nth-child(2) { animation-delay: 0.2s; }
        .category-card-page:nth-child(3) { animation-delay: 0.3s; }
        .category-card-page:nth-child(4) { animation-delay: 0.4s; }
        .category-card-page:hover .cat-img {
          transform: scale(1.08);
        }
        .category-card-page:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(46,125,50,0.15);
        }
        .cat-img {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-card-page .cat-overlay {
          transition: opacity 0.3s ease;
          opacity: 0;
        }
        .category-card-page:hover .cat-overlay {
          opacity: 1;
        }
      `}</style>

      {/* Page Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #2E7D32 0%, #43A047 50%, #66BB6A 100%)",
          padding: "48px 24px 56px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,0.15)",
              marginBottom: 16,
              backdropFilter: "blur(10px)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 36px)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              marginBottom: 8,
            }}
          >
            {locale === "ar" ? "جميع الأقسام" : "All Categories"}
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 2.5vw, 16px)",
              color: "rgba(255,255,255,0.85)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {locale === "ar"
              ? "تصفّح أقسامنا المختلفة واختر ما يناسبك من منتجات طازجة وعضوية"
              : "Browse our different categories and choose fresh organic products that suit you"}
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 24px 0",
        }}
      >
        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#6b7280" }}>
          <Link to="/" style={{ color: "#2E7D32", textDecoration: "none", fontWeight: 600 }}>
            {locale === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isRTL ? "scaleX(-1)" : "none" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span style={{ fontWeight: 600, color: "#374151" }}>
            {locale === "ar" ? "الأقسام" : "Categories"}
          </span>
        </nav>
      </div>

      {/* Categories Grid or States */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map(i => <CategorySkeleton key={i} />)}
          </div>
        ) : apiCategories.length === 0 ? (
          <div className="flex items-center justify-center w-full py-20">
            <div className="text-xl font-bold text-gray-500">
              {isRTL ? "لا توجد أقسام حالياً." : "No categories found."}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
        {categories.map((cat) => (
          <Link
            to={`/products?category=${cat.id}`}
            key={cat.id}
            className="category-card-page"
            style={{
              textDecoration: "none",
              borderRadius: 20,
              overflow: "hidden",
              background: "#fff",
              border: "1px solid #e5e7eb",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
            }}
          >
            {/* Image Container */}
            <div
              style={{
                width: "100%",
                height: 220,
                overflow: "hidden",
                position: "relative",
                background: cat.gradient,
              }}
            >
              <img
                className="cat-img"
                src={cat.image}
                alt={locale === "ar" ? cat.titleAr : cat.titleEn}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* Hover overlay */}
              <div
                className="cat-overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(46,125,50,0.7) 100%)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingBottom: 16,
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(255,255,255,0.2)",
                    padding: "6px 16px",
                    borderRadius: 20,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {locale === "ar" ? "تصفّح المنتجات" : "Browse Products"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isRTL ? "scaleX(-1)" : "none" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Text Content */}
            <div style={{ padding: "20px 24px 24px" }}>
              <h2
                style={{
                  fontSize: "clamp(18px, 3vw, 22px)",
                  fontWeight: 700,
                  color: "#1f2937",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {locale === "ar" ? cat.titleAr : cat.titleEn}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {locale === "ar" ? cat.descAr : cat.descEn}
              </p>
              {/* Arrow indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 16,
                  color: cat.accentColor,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {locale === "ar" ? "عرض المنتجات" : "View Products"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isRTL ? "scaleX(-1)" : "none" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
          </div>
        )}
      </div>
    </section>
  );
}
