import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { locale, direction } = useLanguage();
  const { toggleCart, toggleWishlist, isInWishlist, isInCart } = useCart();
  const isRTL = direction === "rtl";

  // Short tagline under title
  const taglines = {
    1: { en: "🍎 Farm Fresh • Organic", ar: "🍎 طازج من المزرعة • عضوي" },
    2: { en: "🍓 Sweet & Juicy • Vitamin C", ar: "🍓 حلو وعصيري • فيتامين سي" },
    3: { en: "🍌 Energy Boost • Potassium", ar: "🍌 طاقة ونشاط • بوتاسيوم" },
    4: { en: "🥑 Healthy Fats • Creamy", ar: "🥑 دهون صحية • كريمي" },
    5: { en: "🍇 Seedless • Sweet", ar: "🍇 بدون بذور • حلو" },
    6: { en: "🍊 Vitamin C • Fresh", ar: "🍊 فيتامين سي • طازج" },
    7: { en: "🫐 Antioxidants • Super", ar: "🫐 مضادات أكسدة • سوبر" },
    8: { en: "🥭 Tropical • Sweet", ar: "🥭 استوائي • حلو" },
  };
  const tagline = taglines[product.id] || {
    en: "✨ Premium Quality",
    ar: "✨ جودة ممتازة",
  };

  const isWished = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative h-full"
      style={{ borderRadius: 16, border: "1px solid #ececec" }}
    >
      {/* Badge */}
      <div
        className={`absolute z-10 text-white font-bold ${product.badgeColor || "bg-flash"}`}
        style={{
          top: 8,
          left: isRTL ? "auto" : 8,
          right: isRTL ? 8 : "auto",
          fontSize: 10,
          padding: "3px 10px",
          borderRadius: 6,
          letterSpacing: 0.3,
        }}
      >
        {locale === "ar" ? product.badgeAr : product.badgeEn}
      </div>

      {/* Discount percentage badge */}
      {product.oldPrice && (
        <div
          className="absolute z-10 bg-red-500 text-white font-bold"
          style={{
            top: 8,
            right: isRTL ? "auto" : 8,
            left: isRTL ? 8 : "auto",
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: 6,
          }}
        >
          -
          {Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100,
          )}
          %
        </div>
      )}

      {/* Image */}
      <div className="relative w-full bg-gradient-to-b from-[#f0f5f0] to-[#e8f0e8] overflow-hidden aspect-[4/3] sm:aspect-square">
        <img
          src={product.image}
          alt={locale === "ar" ? product.nameAr : product.nameEn}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = "/images/fallback.png";
          }}
        />

        {/* Hover overlay with quick-view */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow" style={{ padding: "20px" }}>
        {/* Rating */}
        <div className="flex items-center" style={{ gap: 1, marginBottom: 5 }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <span
              key={idx}
              className={
                idx < product.rating ? "text-amber-400" : "text-gray-200"
              }
              style={{ fontSize: 13 }}
            >
              ★
            </span>
          ))}
          <span
            className="text-gray-400 font-medium"
            style={{ fontSize: 10, marginInlineStart: 4 }}
          >
            ({product.reviews})
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-gray-800 group-hover:text-primary transition-colors leading-snug"
          style={{
            fontSize: "clamp(13px, 3.5vw, 17px)",
            marginBottom: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "clamp(36px, 9vw, 44px)",
          }}
        >
          {locale === "ar" ? product.nameAr : product.nameEn}
        </h3>

        {/* Tagline - the special touch */}
        <p
          className="font-semibold truncate"
          style={{
            fontSize: "clamp(11px, 2.5vw, 13px)",
            marginBottom: 2,
            color: "#2E7D32",
            opacity: 0.8,
            letterSpacing: 0.2,
          }}
        >
          {locale === "ar" ? tagline.ar : tagline.en}
        </p>

        {/* Weight */}
        <p
          className="text-gray-400 font-medium"
          style={{ fontSize: "clamp(11px, 2.5vw, 13px)", marginBottom: 5 }}
        >
          {locale === "ar" ? product.weightAr : product.weightEn}
        </p>

        {/* Price & Buttons */}
        <div
          className="mt-auto flex items-end justify-between"
          style={{ gap: 6 }}
        >
          {/* Price */}
          <div>
            {product.oldPrice && (
              <span
                className="text-gray-300 line-through font-medium block"
                style={{ fontSize: 12, lineHeight: 1 }}
              >
                {product.oldPrice.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            )}
            <span
              className="font-extrabold text-primary"
              style={{ fontSize: "clamp(16px, 4vw, 20px)", lineHeight: 1.3 }}
            >
              {product.price.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center" style={{ gap: 6 }}>
            {/* Fav Button */}
            <button
              className={`flex items-center justify-center transition-all duration-200 active:scale-90 w-8 h-8 sm:w-[34px] sm:h-[34px] shrink-0 border border-solid rounded-[10px] ${
                isWished
                  ? "bg-red-50 text-red-500 border-red-200"
                  : "bg-gray-50 text-gray-400 hover:text-red-400 hover:bg-red-50 border-[#eee]"
              }`}
              style={{ cursor: "pointer" }}
              aria-label="Favorite"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
            >
              <svg
                style={{ width: 16, height: 16 }}
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

            {/* Cart Button - Toggle (add once) */}
            <button
              className={`flex items-center justify-center transition-all duration-200 shadow-md active:scale-90 w-8 h-8 sm:w-[34px] sm:h-[34px] shrink-0 rounded-[10px] ${
                inCart
                  ? "bg-primary/15 text-primary border-[1.5px] border-solid border-primary/30"
                  : "bg-primary text-white border-none hover:bg-primary-dark shadow-primary/25"
              }`}
              style={{ cursor: "pointer" }}
              aria-label={
                inCart
                  ? locale === "ar"
                    ? "في السلة"
                    : "In cart"
                  : locale === "ar"
                    ? "أضف للسلة"
                    : "Add to cart"
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCart(product);
              }}
            >
              {inCart ? (
                <svg
                  style={{ width: 16, height: 16 }}
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
                  style={{ width: 16, height: 16 }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
