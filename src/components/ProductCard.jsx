import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, isOffer = false }) {
  const { locale, direction } = useLanguage();
  const { toggleCart, toggleWishlist, isInWishlist, isInCart, addToCart } = useCart();
  const isRTL = direction === "rtl";
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isOfferMode = isOffer || !!product.oldPrice;

  // Tagline under title
  const tagline = {
    ar: "✨ جودة ممتازة",
    en: "✨ Premium Quality"
  };

  const isWished = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If item is in wishlist and NOT in cart, show confirmation dialog
    if (isWished && !inCart) {
      setShowMoveDialog(true);
      return;
    }
    // Otherwise toggle normally
    toggleCart(product);
  };

  const confirmMoveToCart = () => {
    addToCart(product, 1);
    toggleWishlist(product); // Remove from wishlist
    setShowMoveDialog(false);
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  return (
    <>
      <Link
        to={product.isApiListing ? `/listings/${product.id}` : `/product/${product.id}`}
        className="group bg-white flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative h-full"
        style={{ borderRadius: 16, border: "1px solid #ececec" }}
      >
        {/* Shine Effect */}
        <div 
          className="absolute inset-0 pointer-events-none z-20"
        >
          <div 
            className="absolute top-0 bottom-0 -left-[100%] w-1/2 opacity-0 group-hover:opacity-100 group-hover:left-[200%] transition-all duration-1000 ease-in-out"
            style={{
              background: "linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)",
              transform: "skewX(-25deg)",
            }}
          />
        </div>
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
            style={{ gap: 4 }}
          >
            {/* Price */}
            <div style={{ minWidth: 0, flex: 1, paddingInlineEnd: 4, wordBreak: "break-word" }}>
              {product.oldPrice && (
                <span
                  className="text-gray-300 line-through font-medium block"
                  style={{ fontSize: 12, lineHeight: 1 }}
                >
                  {product.oldPrice.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
                </span>
              )}
              <span
                className={`font-extrabold ${isOfferMode ? "text-orange-500" : "text-primary"}`}
                style={{
                  fontSize: "clamp(16px, 4vw, 20px)",
                  lineHeight: 1.3,
                  color: isOfferMode ? "#F97316" : undefined
                }}
              >
                {product.price.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center shrink-0" style={{ gap: 6 }}>
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

              {/* Cart Button */}
              <button
                className={`flex items-center justify-center transition-all duration-200 shadow-md active:scale-90 w-8 h-8 sm:w-[34px] sm:h-[34px] shrink-0 rounded-[10px] ${
                  inCart
                    ? isOfferMode
                      ? "bg-orange-500/15 text-orange-500 border-[1.5px] border-solid border-orange-500/30"
                      : "bg-primary/15 text-primary border-[1.5px] border-solid border-primary/30"
                    : isOfferMode
                      ? "bg-orange-500 text-white border-none hover:bg-orange-600 shadow-orange-500/25"
                      : "bg-primary text-white border-none hover:bg-primary-dark shadow-primary/25"
                }`}
                style={{ 
                  cursor: "pointer",
                  backgroundColor: inCart
                    ? isOfferMode
                      ? "rgba(249, 115, 22, 0.15)"
                      : undefined
                    : isOfferMode
                      ? "#F97316"
                      : undefined,
                  color: isOfferMode
                    ? inCart
                      ? "#F97316"
                      : "#ffffff"
                    : undefined,
                  borderColor: isOfferMode && inCart ? "rgba(249, 115, 22, 0.3)" : undefined
                }}
                onMouseOver={(e) => {
                  if (isOfferMode && !inCart) {
                    e.currentTarget.style.backgroundColor = "#ea580c";
                  }
                }}
                onMouseOut={(e) => {
                  if (isOfferMode && !inCart) {
                    e.currentTarget.style.backgroundColor = "#F97316";
                  }
                }}
                aria-label={
                  inCart
                    ? locale === "ar"
                      ? "في السلة"
                      : "In cart"
                    : locale === "ar"
                      ? "أضف للسلة"
                      : "Add to cart"
                }
                onClick={handleCartClick}
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

      {/* ==================== MOVE TO CART DIALOG ==================== */}
      {showMoveDialog && (
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
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(6px)",
            padding: 24,
            animation: "moveDialogFadeIn 0.25s ease-out",
          }}
          onClick={() => setShowMoveDialog(false)}
        >
          <style>{`
            @keyframes moveDialogFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes moveDialogSlideUp {
              from { opacity: 0; transform: scale(0.92) translateY(16px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
          <div
            dir={isRTL ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 20,
              padding: "clamp(24px, 5vw, 32px)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0,0,0,0.08)",
              width: "100%",
              maxWidth: 420,
              border: "1px solid #E2E8F0",
              animation: "moveDialogSlideUp 0.3s ease-out",
            }}
          >
            {/* Icon */}
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
                  width: 72,
                  height: 72,
                  background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  border: "2px solid #bbf7d0",
                }}
              >
                <svg width="32" height="32" fill="none" stroke="#2E7D32" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: "clamp(17px, 4vw, 20px)",
                  color: "#1a1a1a",
                  fontWeight: 700,
                  marginBottom: 10,
                  lineHeight: 1.4,
                }}
              >
                {locale === "ar"
                  ? "نقل إلى سلة التسوق"
                  : "Move to Shopping Cart"}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: "#6B7280",
                  fontSize: "clamp(13px, 3vw, 15px)",
                  marginBottom: 8,
                  lineHeight: 1.7,
                  maxWidth: 320,
                }}
              >
                {locale === "ar"
                  ? `هل ترغب في نقل "${product.nameAr}" من قائمة المفضلة إلى سلة التسوق الخاصة بك؟ سيتم إزالة المنتج من المفضلة وإضافته مباشرةً إلى السلة.`
                  : `Would you like to move "${product.nameEn}" from your Wishlist to the Shopping Cart? The item will be removed from your Wishlist and added directly to your Cart.`}
              </p>

              {/* Product preview */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#f9fafb",
                  padding: "10px 14px",
                  borderRadius: 14,
                  border: "1px solid #f3f4f6",
                  marginBottom: 24,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 10,
                    background: "#f0f5f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={product.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: isRTL ? "right" : "left" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {locale === "ar" ? product.nameAr : product.nameEn}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", marginTop: 2 }}>
                    {product.price.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: 12, width: "100%" }}>
                <button
                  onClick={() => setShowMoveDialog(false)}
                  style={{
                    flex: 1,
                    padding: "13px 16px",
                    borderRadius: 12,
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: 14,
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#E5E7EB";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#F3F4F6";
                  }}
                >
                  {locale === "ar" ? "تراجع" : "Cancel"}
                </button>
                <button
                  onClick={confirmMoveToCart}
                  style={{
                    flex: 1,
                    padding: "13px 16px",
                    borderRadius: 12,
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: 14,
                    background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(46, 125, 50, 0.35)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(46, 125, 50, 0.25)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                  {locale === "ar" ? "نقل إلى السلة" : "Move to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUCCESS TOAST ==================== */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
            animation: "moveDialogFadeIn 0.35s ease-out",
          }}
        >
          <style>{`
            @keyframes toastSlideDown {
              from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 24px",
              borderRadius: 14,
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
              border: "1px solid #34D399",
              minWidth: 280,
              maxWidth: 500,
              cursor: "pointer",
            }}
            onClick={() => setShowToast(false)}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>
              {locale === "ar"
                ? "تم نقل المنتج إلى سلة التسوق بنجاح"
                : "Item has been moved to your cart successfully"}
            </span>
            <span style={{ opacity: 0.6, fontSize: 18, padding: "0 4px" }}>×</span>
          </div>
        </div>
      )}
    </>
  );
}
