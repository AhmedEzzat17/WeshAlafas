import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useDashboardData } from "../Dashboard/shared/DashboardDataContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { locale, direction } = useLanguage();
  const { products: mockProducts } = useDashboardData();
  // const { addToCart, toggleCart, toggleWishlist, isInWishlist, isInCart } =
  const { addToCart, toggleWishlist, isInWishlist, isInCart } =
    useCart();
  const isRTL = direction === "rtl";

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product =
    mockProducts.find((p) => p.id === parseInt(id)) || mockProducts[0];

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setActiveImage(0);
    setQuantity(1);
    setPrevId(id);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return null;

  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 6);
  const isWished = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  // Taglines
  const taglines = {
    1: { en: "🍎 Farm Fresh • Organic", ar: "🍎 طازج من المزرعة • عضوي" },
    2: { en: "🍓 Sweet & Juicy", ar: "🍓 حلو وعصيري" },
    3: { en: "🍌 Energy Boost", ar: "🍌 طاقة ونشاط" },
    4: { en: "🥑 Healthy Fats", ar: "🥑 دهون صحية" },
    5: { en: "🍇 Seedless • Sweet", ar: "🍇 بدون بذور • حلو" },
    6: { en: "🍊 Vitamin C • Fresh", ar: "🍊 فيتامين سي • طازج" },
    7: { en: "🫐 Antioxidants", ar: "🫐 مضادات أكسدة" },
    8: { en: "🥭 Tropical • Sweet", ar: "🥭 استوائي • حلو" },
  };
  const tagline = taglines[product.id] || { en: "✨ Premium", ar: "✨ ممتاز" };

  return (
    <div
      className="min-h-screen"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ background: "#f8faf8", paddingBottom: 48 }}
    >
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 flex-wrap text-gray-400 font-medium"
        style={{ fontSize: 13, padding: "16px 12px" }}
      >
        <Link to="/" className="hover:text-primary transition-colors">
          {locale === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition-colors">
          {locale === "ar" ? "المنتجات" : "Products"}
        </Link>
        <span>/</span>
        <span className="text-gray-700">
          {locale === "ar" ? product.nameAr : product.nameEn}
        </span>
      </nav>

      {/* ====== Product Card wrapper for accurate padding ====== */}
      <div
        className="max-w-[1920px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16"
        style={{ paddingBottom: 24, paddingTop: 16 }}
      >
        {/* ====== Product Card ====== */}
        <div
          className="bg-white overflow-hidden w-full"
          style={{
            borderRadius: 20,
            border: "1px solid #ececec",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* ====== Info ====== */}
            <div
              className="flex flex-col order-last md:order-none"
              style={{ padding: "clamp(16px, 4vw, 36px)" }}
            >
              {/* Tagline */}
              <p
                className="font-semibold text-primary"
                style={{
                  fontSize: 12,
                  marginBottom: 8,
                  opacity: 0.8,
                  letterSpacing: 0.3,
                }}
              >
                {locale === "ar" ? tagline.ar : tagline.en}
              </p>

              {/* Title */}
              <h1
                className="font-extrabold text-gray-800 leading-tight"
                style={{ fontSize: "clamp(22px, 4vw, 34px)", marginBottom: 10 }}
              >
                {locale === "ar" ? product.nameAr : product.nameEn}
              </h1>

              {/* Rating */}
              <div
                className="flex items-center"
                style={{ gap: 3, marginBottom: 16 }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={
                      s <= product.rating ? "text-amber-400" : "text-gray-200"
                    }
                    style={{ fontSize: 18 }}
                  >
                    ★
                  </span>
                ))}
                <span
                  className="text-gray-400 font-medium"
                  style={{ fontSize: 13, marginInlineStart: 6 }}
                >
                  ({product.reviews} {locale === "ar" ? "تقييم" : "reviews"})
                </span>
              </div>

              {/* Price */}
              <div
                className="flex items-end flex-wrap"
                style={{
                  gap: 10,
                  marginBottom: 16,
                  paddingBottom: 16,
                  borderBottom: "1px solid #eee",
                }}
              >
                <span
                  className="font-extrabold text-primary"
                  style={{ fontSize: "clamp(26px, 5vw, 38px)", lineHeight: 1 }}
                >
                  {product.price.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
                </span>
                {product.oldPrice && (
                  <span
                    className="text-gray-300 line-through font-medium"
                    style={{ fontSize: 16, lineHeight: 1, marginBottom: 3 }}
                  >
                    {product.oldPrice.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
                  </span>
                )}
                {product.oldPrice && (
                  <span
                    className="bg-red-50 text-red-500 font-bold"
                    style={{
                      fontSize: 12,
                      padding: "2px 8px",
                      borderRadius: 6,
                      marginBottom: 2,
                    }}
                  >
                    {locale === "ar" ? "وفر" : "Save"}{" "}
                    {(product.oldPrice - product.price).toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className="text-gray-500 leading-relaxed"
                style={{ fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}
              >
                {locale === "ar"
                  ? product.descriptionAr
                  : product.descriptionEn}
              </p>

              {/* Features chips */}
              <div
                className="flex flex-wrap"
                style={{ gap: 8, marginBottom: 20 }}
              >
                {[
                  {
                    en: "Fresh",
                    ar: "طازج",
                    icon: "/icons/etwtznjn.json",
                  },
                  {
                    en: "Fast Delivery",
                    ar: "توصيل سريع",
                    icon: "/icons/surcxhka.json",
                  },
                  {
                    en: "Guaranteed",
                    ar: "مضمون",
                    icon: "/icons/surjmvno.json",
                  },
                ].map((f, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-700 font-medium flex items-center"
                    style={{
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 8,
                      gap: 4,
                    }}
                  >
                    <lord-icon
                      src={f.icon}
                      trigger="loop"
                      delay="2500"
                      colors="primary:#2E7D32"
                      style={{ width: "18px", height: "18px" }}
                    />
                    {locale === "ar" ? f.ar : f.en}
                  </span>
                ))}
              </div>

              {/* ====== Extra Product Details ====== */}
              <div
                className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 border border-green-100"
                style={{
                  borderRadius: 14,
                  padding: "16px 18px",
                  marginBottom: 20,
                }}
              >
                <h4
                  className="font-bold text-gray-800 flex items-center"
                  style={{ fontSize: 14, marginBottom: 14, gap: 6 }}
                >
                  <lord-icon
                    src="/icons/jfhbogmw.json"
                    trigger="loop"
                    delay="3000"
                    colors="primary:#2E7D32"
                    style={{ width: "22px", height: "22px" }}
                  />
                  {locale === "ar" ? "معلومات المنتج" : "Product Information"}
                </h4>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {(product.originEn || product.originAr) && (
                    <div className="flex items-start" style={{ gap: 10 }}>
                      <lord-icon
                        src="/icons/surcxhka.json"
                        trigger="loop"
                        delay="4000"
                        colors="primary:#2E7D32"
                        style={{ width: "24px", height: "24px", flexShrink: 0 }}
                      />
                      <div>
                        <span
                          className="font-semibold text-gray-700"
                          style={{ fontSize: 12 }}
                        >
                          {locale === "ar" ? "المنشأ:" : "Origin:"}
                        </span>
                        <span
                          className="text-gray-500"
                          style={{ fontSize: 12, marginInlineStart: 4 }}
                        >
                          {locale === "ar"
                            ? product.originAr
                            : product.originEn}
                        </span>
                      </div>
                    </div>
                  )}
                  {(product.storageEn || product.storageAr) && (
                    <div className="flex items-start" style={{ gap: 10 }}>
                      <lord-icon
                        src="/icons/kkvxgpti.json"
                        trigger="loop"
                        delay="4000"
                        colors="primary:#2E7D32"
                        style={{ width: "24px", height: "24px", flexShrink: 0 }}
                      />
                      <div>
                        <span
                          className="font-semibold text-gray-700"
                          style={{ fontSize: 12 }}
                        >
                          {locale === "ar" ? "التخزين:" : "Storage:"}
                        </span>
                        <span
                          className="text-gray-500"
                          style={{ fontSize: 12, marginInlineStart: 4 }}
                        >
                          {locale === "ar"
                            ? product.storageAr
                            : product.storageEn}
                        </span>
                      </div>
                    </div>
                  )}
                  {(product.shelfLifeEn || product.shelfLifeAr) && (
                    <div className="flex items-start" style={{ gap: 10 }}>
                      <lord-icon
                        src="/icons/abfverha.json"
                        trigger="loop"
                        delay="4000"
                        colors="primary:#2E7D32"
                        style={{ width: "24px", height: "24px", flexShrink: 0 }}
                      />
                      <div>
                        <span
                          className="font-semibold text-gray-700"
                          style={{ fontSize: 12 }}
                        >
                          {locale === "ar" ? "مدة الصلاحية:" : "Shelf Life:"}
                        </span>
                        <span
                          className="text-gray-500"
                          style={{ fontSize: 12, marginInlineStart: 4 }}
                        >
                          {locale === "ar"
                            ? product.shelfLifeAr
                            : product.shelfLifeEn}
                        </span>
                      </div>
                    </div>
                  )}
                  {(product.nutritionEn || product.nutritionAr) && (
                    <div className="flex items-start" style={{ gap: 10 }}>
                      <lord-icon
                        src="/icons/etwtznjn.json"
                        trigger="loop"
                        delay="4000"
                        colors="primary:#2E7D32"
                        style={{ width: "24px", height: "24px", flexShrink: 0 }}
                      />
                      <div>
                        <span
                          className="font-semibold text-gray-700"
                          style={{ fontSize: 12 }}
                        >
                          {locale === "ar" ? "القيمة الغذائية:" : "Nutrition:"}
                        </span>
                        <span
                          className="text-gray-500"
                          style={{ fontSize: 12, marginInlineStart: 4 }}
                        >
                          {locale === "ar"
                            ? product.nutritionAr
                            : product.nutritionEn}
                        </span>
                      </div>
                    </div>
                  )}
                  {(product.usageEn || product.usageAr) && (
                    <div className="flex items-start" style={{ gap: 10 }}>
                      <lord-icon
                        src="/icons/ojnjgkun.json"
                        trigger="loop"
                        delay="4000"
                        colors="primary:#2E7D32"
                        style={{ width: "24px", height: "24px", flexShrink: 0 }}
                      />
                      <div>
                        <span
                          className="font-semibold text-gray-700"
                          style={{ fontSize: 12 }}
                        >
                          {locale === "ar" ? "الاستخدام:" : "Usage:"}
                        </span>
                        <span
                          className="text-gray-500"
                          style={{ fontSize: 12, marginInlineStart: 4 }}
                        >
                          {locale === "ar" ? product.usageAr : product.usageEn}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weight & Quantity row */}
              <div
                className="flex items-end flex-wrap"
                style={{ gap: 16, marginBottom: 24 }}
              >
                {/* Weight */}
                <div>
                  <h4
                    className="font-semibold text-gray-700"
                    style={{ fontSize: 13, marginBottom: 6 }}
                  >
                    {locale === "ar" ? "وحدة الكمية" : "Unit"}
                  </h4>
                  <span
                    className="inline-flex items-center justify-center border-2 border-primary bg-primary/5 text-primary font-bold"
                    style={{
                      padding: "6px 16px",
                      borderRadius: 10,
                      fontSize: 13,
                    }}
                  >
                    {locale === "ar" ? product.weightAr : product.weightEn}
                  </span>
                </div>

                {/* Quantity */}
                <div>
                  <h4
                    className="font-semibold text-gray-700"
                    style={{ fontSize: 13, marginBottom: 6 }}
                  >
                    {locale === "ar" ? "الكمية" : "Quantity"}
                  </h4>
                  <div
                    className="inline-flex items-center bg-white overflow-hidden"
                    style={{
                      borderRadius: 10,
                      height: 40,
                      border: "2px solid #e8e8e8",
                    }}
                  >
                    <button
                      className="flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{
                        width: 40,
                        height: "100%",
                        fontSize: 18,
                        border: "none",
                        background: "none",
                      }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </button>
                    <span
                      className="flex items-center justify-center font-bold bg-gray-50"
                      style={{
                        width: 44,
                        height: "100%",
                        fontSize: 15,
                        borderLeft: "2px solid #e8e8e8",
                        borderRight: "2px solid #e8e8e8",
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      className="flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{
                        width: 40,
                        height: "100%",
                        fontSize: 18,
                        border: "none",
                        background: "none",
                      }}
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex mt-auto" style={{ gap: 10 }}>
                <button
                  className={`flex-grow flex items-center justify-center font-bold transition-all duration-300 hover:shadow-xl active:scale-[0.97] cursor-pointer ${
                    inCart
                      ? "bg-primary/10 text-primary border-2 border-primary/30"
                      : "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25"
                  }`}
                  style={{
                    height: 48,
                    borderRadius: 12,
                    fontSize: 15,
                    border: inCart ? undefined : "none",
                    gap: 8,
                  }}
                  onClick={() => {
                    if (inCart) {
                      // Already in cart - do nothing or navigate to cart
                      return;
                    }
                    addToCart(product, quantity);
                  }}
                >
                  {inCart ? (
                    <svg
                      style={{ width: 20, height: 20 }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      style={{ width: 20, height: 20 }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  )}
                  {inCart
                    ? locale === "ar"
                      ? "✓ تم الإضافة للسلة"
                      : "✓ Added to Cart"
                    : locale === "ar"
                      ? "أضف للسلة"
                      : "Add to Cart"}
                </button>

                <button
                  className={`flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer ${
                    isWished
                      ? "text-red-500 bg-red-50 border-red-200"
                      : "bg-white text-gray-400 hover:text-red-400 hover:border-red-300 hover:bg-red-50 border-[#e8e8e8]"
                  }`}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    borderStyle: "solid",
                    borderWidth: 2,
                    flexShrink: 0,
                  }}
                  aria-label="Favorite"
                  onClick={() => toggleWishlist(product)}
                >
                  <svg
                    style={{ width: 22, height: 22 }}
                    fill={isWished ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ====== Images ====== */}
            <div
              className="order-first md:order-none"
              style={{
                padding: 12,
                background: "linear-gradient(135deg, #f0f5f0, #e8f0e8)",
              }}
            >
              {/* Main Image */}
              <div
                className="relative w-full overflow-hidden bg-white"
                style={{
                  borderRadius: 16,
                  aspectRatio: "1/1",
                  marginBottom: product.images?.length > 1 ? 10 : 0,
                }}
              >
                {/* Badge */}
                <div
                  className={`absolute z-10 text-white font-bold ${product.badgeColor || "bg-flash"}`}
                  style={{
                    top: 10,
                    left: isRTL ? "auto" : 10,
                    right: isRTL ? 10 : "auto",
                    fontSize: 11,
                    padding: "4px 12px",
                    borderRadius: 8,
                  }}
                >
                  {locale === "ar" ? product.badgeAr : product.badgeEn}
                </div>

                {/* Discount */}
                {product.oldPrice && (
                  <div
                    className="absolute z-10 bg-red-500 text-white font-bold"
                    style={{
                      top: 10,
                      right: isRTL ? "auto" : 10,
                      left: isRTL ? 10 : "auto",
                      fontSize: 11,
                      padding: "4px 10px",
                      borderRadius: 8,
                    }}
                  >
                    -
                    {Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) *
                        100,
                    )}
                    %
                  </div>
                )}

                <img
                  src={product.images?.[activeImage] || product.image}
                  alt={locale === "ar" ? product.nameAr : product.nameEn}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  style={{ borderRadius: 16 }}
                  onError={(e) => {
                    e.target.src = "/images/fallback.png";
                  }}
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div
                  className="flex overflow-x-auto no-scrollbar pb-2"
                  style={{ gap: 8 }}
                >
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`shrink-0 overflow-hidden transition-all cursor-pointer ${
                        activeImage === idx
                          ? "ring-2 ring-primary ring-offset-2 shadow-md"
                          : "opacity-50 hover:opacity-100"
                      }`}
                      style={{ width: 56, height: 56, borderRadius: 10 }}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/fallback.png";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ====== Related Products Slider ====== */}
      <div style={{ padding: "32px 30px 0", width: "100%" }}>
        <div className="max-w-[1920px] w-full mx-auto">
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
                stroke="#2E7D32"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {locale === "ar" ? "منتجات ذات صلة" : "Related Products"}
            </h2>
            <div className="flex items-center" style={{ gap: 6 }}>
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
                  document
                    .getElementById("related-slider")
                    .scrollBy({ left: isRTL ? -250 : 250, behavior: "smooth" });
                }}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  style={{ width: "22px", height: "22px" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
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
                  document
                    .getElementById("related-slider")
                    .scrollBy({ left: isRTL ? 250 : -250, behavior: "smooth" });
                }}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  style={{
                    width: "22px",
                    height: "22px",
                    transform: "scaleX(-1)",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Slider - full width */}
          <div
            id="related-slider"
            className="flex overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-8 md:px-12 lg:px-16 pb-4"
            style={{ gap: "clamp(12px, 2vw, 20px)"}}
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
            {relatedProducts.map((rp) => (
              <div
                key={`related-${rp.id}`}
                className="shrink-0 transition-transform duration-300"
                style={{ width: "clamp(240px, 75vw, 320px)" }}
              >
                <ProductCard product={rp} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
