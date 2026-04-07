import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useDashboardData } from "../Dashboard/shared/DashboardDataContext";
import ProductCard from "../components/ProductCard";

const FilterSectionTitle = ({ icon, children }) => (
  <div className="flex items-center gap-2.5" style={{ marginBottom: 14 }}>
    <span className="flex items-center justify-center" style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)" }}>
      {icon}
    </span>
    <h3 className="font-bold text-gray-800" style={{ fontSize: 15 }}>{children}</h3>
  </div>
);

export default function FilterPage() {
  const { locale, direction } = useLanguage();
  const { products: mockProducts } = useDashboardData();
  const isRTL = direction === "rtl";
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("category") || "all";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [isReadyToShip, setIsReadyToShip] = useState(true);
  const [selectedRating, setSelectedRating] = useState(0);
  const [qualityGrades, setQualityGrades] = useState({
    gradeA: false,
    gradeB: false,
    organic: false,
    exportQuality: false,
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);



  useEffect(() => {
    const qSearch = queryParams.get("search");
    const qCat = queryParams.get("category");
    
    const targetSearch = qSearch !== null ? qSearch : initialSearch;
    const targetCat = qCat !== null ? qCat : initialCategory;
    
    const timeout = setTimeout(() => {
      setSearch(prev => prev !== targetSearch ? targetSearch : prev);
      setSelectedCategory(prev => prev !== targetCat ? targetCat : prev);
    }, 0);
    
    return () => clearTimeout(timeout);
  }, [location.search, initialSearch, initialCategory]);

  const categories = [
    { id: "all", en: "All Products", ar: "جميع المنتجات" },
    { id: "fruits", en: "Fruits", ar: "الفواكه" },
    { id: "vegetables", en: "Vegetables", ar: "الخضراوات" },
    { id: "grains", en: "Grains", ar: "حبوب ومحاصيل" },
    { id: "offers", en: "Special Offers", ar: "العروض" },
  ];

  const sortOptions = [
    { id: "relevance", en: "Relevance", ar: "الملاءمة" },
    { id: "price_asc", en: "Price: Low to High", ar: "السعر: من الأقل للأعلى" },
    { id: "price_desc", en: "Price: High to Low", ar: "السعر: من الأعلى للأقل" },
    { id: "az", en: "Name: A to Z", ar: "الاسم: أ - ي" },
    { id: "za", en: "Name: Z to A", ar: "الاسم: ي - أ" },
  ];

  const handleResetAll = () => {
    setSearch("");
    setSelectedCategory("all");
    setPriceRange([0, 200000]);
    setIsReadyToShip(true);
    setSelectedRating(0);
    setQualityGrades({ gradeA: false, gradeB: false, organic: false, exportQuality: false });
  };

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.nameEn.toLowerCase().includes(q) || p.nameAr.includes(q));
    }
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const name = p.nameEn.toLowerCase();
        if (selectedCategory === "fruits") return name.includes("apple") || name.includes("strawberry") || name.includes("banana") || name.includes("grape") || name.includes("orange") || name.includes("blueberry") || name.includes("mango");
        if (selectedCategory === "vegetables") return name.includes("tomato") || name.includes("potato");
        if (selectedCategory === "offers") return p.oldPrice != null;
        if (selectedCategory === "fruits_avocado") return name.includes("avocado");
        return true;
      });
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedRating > 0) {
      result = result.filter((p) => p.rating >= selectedRating);
    }
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "az") result.sort((a, b) => locale === "ar" ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn));
    else if (sortBy === "za") result.sort((a, b) => locale === "ar" ? b.nameAr.localeCompare(a.nameAr) : b.nameEn.localeCompare(a.nameEn));
    return result;
  }, [mockProducts, search, selectedCategory, priceRange, sortBy, selectedRating, locale]);

  /* ——— The sidebar filters content ——— */
  const renderFilters = () => (
    <>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 18, marginBottom: 20, borderBottom: "1px solid #ececec" }}>
        <h2 className="font-extrabold text-gray-800 flex items-center" style={{ fontSize: 18, gap: 8 }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          {locale === "ar" ? "الفلاتر" : "Filters"}
        </h2>
        <button onClick={handleResetAll} className="text-primary/80 hover:text-primary font-semibold transition-colors" style={{ fontSize: 13 }}>
          {locale === "ar" ? "ارجاع الكل" : "Reset All"}
        </button>
      </div>

      {/* ── Category ── */}
      <div style={{ marginBottom: 24 }}>
        <FilterSectionTitle icon={<svg width="16" height="16" fill="none" stroke="#2E7D32" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}>
          {locale === "ar" ? "القسم" : "Category"}
        </FilterSectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className="transition-all duration-200 cursor-pointer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 12, border: "none",
                  background: active ? "linear-gradient(135deg, #e8f5e9, #f1f8e9)" : "transparent",
                  color: active ? "#2E7D32" : "#4b5563", fontWeight: active ? 700 : 500, fontSize: 14,
                  boxShadow: active ? "0 2px 8px rgba(46,125,50,0.08)" : "none",
                }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", border: active ? "2px solid #2E7D32" : "2px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E7D32" }} />}
                </span>
                {locale === "ar" ? cat.ar : cat.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div style={{ marginBottom: 24, paddingTop: 4 }}>
        <FilterSectionTitle icon={<svg width="16" height="16" fill="none" stroke="#2E7D32" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
          {locale === "ar" ? "نطاق السعر" : "Price Range"}
        </FilterSectionTitle>
        <div style={{ padding: "0 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="bg-green-50 text-primary font-bold" style={{ fontSize: 13, padding: "4px 12px", borderRadius: 8 }}>0 {locale === "ar" ? "ج.م" : "EGP"}</span>
            <span className="bg-green-50 text-primary font-bold" style={{ fontSize: 13, padding: "4px 12px", borderRadius: 8 }}>{priceRange[1]} {locale === "ar" ? "ج.م" : "EGP"}</span>
          </div>
          <input type="range" min="0" max="200000" step="50" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
        </div>
      </div>

      {/* ── Star Rating ── */}
      {/* <div style={{ marginBottom: 24 }}>
        <FilterSectionTitle icon={<svg width="16" height="16" fill="#2E7D32" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}>
          {locale === "ar" ? "التقييم" : "Rating"}
        </FilterSectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const active = selectedRating === star;
            return (
              <button key={star} onClick={() => setSelectedRating(active ? 0 : star)}
                className="transition-all duration-200 cursor-pointer group"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 12, border: "none",
                  background: active ? "linear-gradient(135deg, #fffbeb, #fef3c7)" : "transparent",
                  boxShadow: active ? "0 2px 8px rgba(245,158,11,0.1)" : "none",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ fontSize: 16, color: s <= star ? "#f59e0b" : "#e5e7eb", transition: "transform 0.15s" }}>★</span>
                  ))}
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#b45309" : "#6b7280" }}>
                  {locale === "ar" ? `${star}  من النجوم` : `${star}+ Stars`}
                </span>
              </button>
            );
          })}
        </div>
      </div> */}

      {/* ── Availability ── */}
      <div style={{ marginBottom: 24 }}>
        <FilterSectionTitle icon={<svg width="16" height="16" fill="none" stroke="#2E7D32" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
          {locale === "ar" ? "التوافر" : "Availability"}
        </FilterSectionTitle>
        <label className="cursor-pointer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: isReadyToShip ? "linear-gradient(135deg, #e8f5e9, #f1f8e9)" : "#f9fafb", border: isReadyToShip ? "1px solid #c8e6c9" : "1px solid #e5e7eb", transition: "all 0.2s" }}>
          <span style={{ fontSize: 14, fontWeight: isReadyToShip ? 600 : 500, color: isReadyToShip ? "#2E7D32" : "#6b7280" }}>
            {locale === "ar" ? "جاهز للشحن" : "Ready to ship"}
          </span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={isReadyToShip} onChange={() => setIsReadyToShip(!isReadyToShip)} />
            <div style={{ width: 44, height: 24, borderRadius: 12, background: isReadyToShip ? "#2E7D32" : "#d1d5db", transition: "background 0.2s" }} />
            <div style={{ position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transition: "transform 0.2s", ...(isReadyToShip ? (isRTL ? { right: 23, left: "auto" } : { left: 23 }) : (isRTL ? { right: 3, left: "auto" } : { left: 3 })) }} />
          </div>
        </label>
      </div>

      {/* ── Quality Grade ── */}
      <div>
        <FilterSectionTitle icon={<svg width="16" height="16" fill="none" stroke="#2E7D32" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}>
          {locale === "ar" ? "درجة الجودة" : "Quality Grade"}
        </FilterSectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { id: "gradeA", en: "Grade A", ar: "درجة اولى" },
            { id: "gradeB", en: "Grade B", ar: "درجة ثانية" },
            { id: "gradeC", en: "Grade C", ar: "درجة ثالثة" },
            { id: "organic", en: "Organic", ar: "عضوي" },
            { id: "exportQuality", en: "Export Quality", ar: "جودة التصدير" },
          ].map((grade) => {
            const checked = qualityGrades[grade.id];
            return (
              <label key={grade.id} className="cursor-pointer transition-all duration-200"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 14px", borderRadius: 12,
                  background: checked ? "linear-gradient(135deg, #e8f5e9, #f1f8e9)" : "transparent",
                  boxShadow: checked ? "0 2px 8px rgba(46,125,50,0.08)" : "none",
                }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: checked ? "2px solid #2E7D32" : "2px solid #d1d5db",
                  background: checked ? "#2E7D32" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}>
                  {checked && <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => setQualityGrades((prev) => ({ ...prev, [grade.id]: e.target.checked }))} />
                <span style={{ fontSize: 14, fontWeight: checked ? 600 : 500, color: checked ? "#2E7D32" : "#4b5563" }}>
                  {locale === "ar" ? grade.ar : grade.en}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen font-sans" style={{ background: "#f8faf8", paddingBottom: 48 }}>
      <style>{`
        @keyframes fadeUpList { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up-list { animation: fadeUpList 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        @keyframes slideInFilter { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ══════ Page Header ══════ */}
      <div className="text-white" style={{ background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)", paddingTop: 32, paddingBottom: 48, paddingLeft: 24, paddingRight: 24 }}>
        <div className="max-w-[1920px] w-full mx-auto relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/80" style={{ marginBottom: 12 }}>
            <Link to="/" className="hover:text-white transition-colors">{locale === "ar" ? "الرئيسية" : "Home"}</Link>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: isRTL ? "rotate(180deg)" : "none" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-white font-medium">{locale === "ar" ? "المنتجات" : "Products"}</span>
          </nav>
          <h1 className="font-bold" style={{ fontSize: "clamp(24px, 4vw, 36px)" }}>{locale === "ar" ? "تصفح المنتجات" : "Browse Products"}</h1>
          {search && <p className="text-white/90" style={{ marginTop: 8, fontSize: 14 }}>{locale === "ar" ? `نتائج البحث عن: "${search}"` : `Search results for: "${search}"`}</p>}
        </div>
      </div>

      {/* ══════ Main Layout ══════ */}
      <div className="max-w-[1920px] w-full mx-auto" style={{ padding: "0 16px", marginTop: -24 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }} className="flex-col lg:flex-row">

          {/* ── Mobile Filter Toggle ── */}
          <div className="lg:hidden w-full" style={{ marginBottom: 4 }}>
            <button onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-white transition-all duration-200 cursor-pointer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 16, border: "1px solid #ececec", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <span className="text-primary font-bold" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                {locale === "ar" ? "الفلاتر وتصفية النتائج" : "Filters"}
              </span>
              <span className="text-gray-500 font-medium" style={{ fontSize: 13 }}>{filteredProducts.length} {locale === "ar" ? "نتائج" : "Results"}</span>
            </button>
          </div>

          {/* ── Sidebar (Desktop) ── */}
          <aside className={`w-full lg:w-[310px] flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`} style={{ position: "sticky", top: 100, zIndex: 10 }}>
            <div className="bg-white" style={{ borderRadius: 20, border: "1px solid #ececec", padding: "clamp(20px, 3vw, 28px)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", animation: showMobileFilters ? "slideInFilter 0.3s ease-out" : "none", maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
              {renderFilters()}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 w-full" style={{ minWidth: 0 }}>
            {/* Top Bar */}
            <div className="hidden lg:flex items-center justify-between bg-white" style={{ padding: "16px 22px", borderRadius: 16, border: "1px solid #ececec", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
              <h2 className="font-bold text-gray-800" style={{ fontSize: 17 }}>
                {locale === "ar" ? "النتائج" : "Results"}
                <span className="text-gray-400 font-medium" style={{ fontSize: 14, marginInlineStart: 8 }}>({filteredProducts.length})</span>
              </h2>
              <div className="flex items-center" style={{ gap: 10 }}>
                <span className="text-gray-500 font-semibold" style={{ fontSize: 13 }}>{locale === "ar" ? "الترتيب حسب:" : "Sort by:"}</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer" style={{ border: "none", background: "#f3f4f6", color: "#1f2937", fontSize: 13, fontWeight: 700, borderRadius: 10, padding: "8px 14px", outline: "none" }}>
                  {sortOptions.map((opt) => <option key={opt.id} value={opt.id}>{locale === "ar" ? opt.ar : opt.en}</option>)}
                </select>
              </div>
            </div>

            {/* Sort – visible only below 1024px */}
            <div className="flex lg:hidden" style={{ justifyContent: "flex-end", marginBottom: 16 }}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer bg-white" style={{ border: "1px solid #ececec", fontSize: 13, fontWeight: 700, borderRadius: 12, padding: "10px 14px", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                {sortOptions.map((opt) => <option key={opt.id} value={opt.id}>{locale === "ar" ? opt.ar : opt.en}</option>)}
              </select>
            </div>

            {/* Grid  */}{/*//////////////////*/}{/* ProductCard  */}
            {/* Grid  */}{/*//////////////////*/}{/* ProductCard  */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4" style={{ gap: "clamp(10px, 2.5vw, 28px)" }}>
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="h-full animate-fade-up-list" style={{ animationDelay: `${index * 0.08}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white flex flex-col items-center text-center" style={{ borderRadius: 20, border: "1px solid #ececec", padding: "clamp(32px, 6vw, 56px) 24px" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <svg width="40" height="40" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="font-bold text-gray-800" style={{ fontSize: 20, marginBottom: 8 }}>{locale === "ar" ? "لم يتم العثور على نتائج" : "No results found"}</h3>
                <p className="text-gray-500" style={{ fontSize: 14, maxWidth: 360 }}>{locale === "ar" ? "لا توجد منتجات تطابق الفلاتر المحددة. يرجى تخفيف البحث." : "No products match the selected filters. Please broaden your search."}</p>
                <button onClick={handleResetAll} className="bg-primary text-white font-bold hover:bg-primary-dark transition-colors cursor-pointer" style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, border: "none", fontSize: 14 }}>
                  {locale === "ar" ? "مسح الفلاتر" : "Clear Filters"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
