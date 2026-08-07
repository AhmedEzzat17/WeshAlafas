import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { locale, direction } = useLanguage();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    cartTotalQuantity,
    toggleSelectItem,
    toggleSelectAll
  } = useCart();
  const isRTL = direction === "rtl";
  const [searchParams] = useSearchParams();
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  useEffect(() => {
    if (searchParams.get("login_required") === "true") {
      setShowLoginWarning(true);
    }
  }, [searchParams]);

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected !== false);
  const selectedCount = cartItems.filter((item) => item.selected !== false).length;

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ background: "#f8faf8", paddingBottom: 64 }}>
      {/* Header Area */}
      <div className="bg-white" style={{ borderBottom: "1px solid #eee" }}>
        {/* <div className="max-w-[1600px] mx-auto" style={{ padding: "28px 24px 24px" }}>
          <div className="flex items-center" style={{ gap: 10, marginBottom: 6 }}>
            <svg width="36" height="36" fill="none" stroke="#2E7D32" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <h1 className="font-extrabold text-gray-800" style={{ fontSize: "clamp(22px, 5vw, 30px)" }}>
              {locale === "ar" ? "سلة التسوق" : "Shopping Cart"}
            </h1>
          </div>
          <p className="text-gray-500 font-medium" style={{ fontSize: "clamp(13px, 2.5vw, 15px)" }}>
            {locale === "ar"
              ? `لديك ${cartCount} ${cartCount === 1 ? "عنصر" : "عناصر"} في السلة`
              : `You have ${cartCount} ${cartCount === 1 ? "item" : "items"} in your cart`}
          </p>
        </div> */}
      </div>

      <div className="max-w-[1600px] mx-auto" style={{ padding: "20px 15px" }}>
        {cartItems.length === 0 ? (
          /* ===== Empty Cart ===== */
          <div
            className="flex flex-col items-center justify-center bg-white"
            style={{
              padding: "clamp(60px, 12vw, 100px) 20px",
              textAlign: "center",
              borderRadius: 24,
              border: "1px dashed #e2e8f0",
              boxShadow: "0 10px 40px rgba(0,0,0,0.03)"
            }}
          >
            <div 
              className="flex items-center justify-center bg-green-50 mb-6"
              style={{ width: "clamp(90px, 15vw, 130px)", height: "clamp(90px, 15vw, 130px)", borderRadius: "50%" }}
            >
              <svg width="45%" height="45%" fill="none" stroke="#2E7D32" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
            </div>
            <h2
              className="font-bold text-gray-800"
              style={{ fontSize: "clamp(20px, 3.5vw, 26px)", marginBottom: 12 }}
            >
              {locale === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
            </h2>
            <p
              className="text-gray-500 font-medium"
              style={{ fontSize: "clamp(14px, 2.5vw, 16px)", marginBottom: 32, maxWidth: 320 }}
            >
              {locale === "ar"
                ? "يبدو أنك لم تضف أي منتجات بعد، تصفح منتجاتنا المميزة وابدأ التسوق!"
                : "Looks like you haven't added anything yet, explore our featured products and start shopping!"}
            </p>
            <Link
              to="/"
              className="bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
              style={{
                padding: "14px 36px",
                borderRadius: 14,
                fontSize: "clamp(15px, 2.5vw, 17px)",
                gap: 10,
                boxShadow: "0 8px 20px rgba(46,125,50,0.25)",
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              {locale === "ar" ? "تسوق الآن" : "Shop Now"}
            </Link>
          </div>
        ) : (

          /* ===== Cart with Items ===== */
          <>
            {showLoginWarning && !isAuthenticated && (
              <div
                className="mb-6 bg-amber-50 text-amber-900 border border-amber-200 transition-all duration-300 success-wrap"
                style={{
                  borderRadius: 20,
                  padding: "24px",
                  boxShadow: "0 10px 30px rgba(245,158,11,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Soft decorative background shape */}
                <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(245,158,11,0.1)", zIndex: 0 }} />

                <div className="flex items-start" style={{ gap: 16, position: "relative", zIndex: 1 }}>
                  {/* Warning Icon SVG */}
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#fef3c7",
                      border: "1.5px solid #fde68a"
                    }}
                  >
                    <svg width="24" height="24" fill="none" stroke="#d97706" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3
                      className="font-bold text-amber-800"
                      style={{ fontSize: "clamp(16px, 3vw, 19px)", marginBottom: 6 }}
                    >
                      {locale === "ar" ? "تسجيل الدخول مطلوب لإتمام العملية" : "Login Required to Complete the Process"}
                    </h3>
                    <p
                      className="text-amber-700 font-medium"
                      style={{ fontSize: "clamp(13px, 2.5vw, 15px)", lineHeight: 1.6, margin: 0 }}
                    >
                      {locale === "ar"
                        ? "عذراً، يجب عليك تسجيل الدخول إلى حسابك أولاً لتتمكن من إتمام الطلب وتأكيد شراء المنتجات المحددة في السلة."
                        : "Sorry, you must be logged in to your account first to complete the order and confirm purchasing the selected items in the cart."}
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowLoginWarning(false)}
                    className="text-amber-500 hover:text-amber-700 transition-colors cursor-pointer"
                    style={{ background: "none", border: "none", padding: 4 }}
                    aria-label={locale === "ar" ? "إغلاق" : "Close"}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap" style={{ gap: 12, paddingStart: 64, position: "relative", zIndex: 1 }}>
                  {/* Primary Login Button */}
                  <Link
                    to="/login?redirect=/checkout"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all duration-300 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 12,
                      fontSize: "clamp(13px, 2.3vw, 15px)",
                      gap: 8,
                      boxShadow: "0 4px 12px rgba(217,119,6,0.2)",
                      textDecoration: "none"
                    }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {locale === "ar" ? "تسجيل الدخول الآن" : "Log In Now"}
                  </Link>

                  {/* Secondary Register Button */}
                  <Link
                    to="/account-type"
                    className="bg-white hover:bg-amber-100 text-amber-700 font-bold transition-all duration-300 flex items-center justify-center border border-amber-200"
                    style={{
                      padding: "10px 24px",
                      borderRadius: 12,
                      fontSize: "clamp(13px, 2.3vw, 15px)",
                      gap: 8,
                      textDecoration: "none"
                    }}
                  >
                    {locale === "ar" ? "إنشاء حساب جديد" : "Create New Account"}
                  </Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: "clamp(16px, 3vw, 24px)" }}>
            {/* Cart Items Column */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 2vw, 16px)" }}>
              
              {/* Select All Control Bar */}
              <div
                className="bg-white hover:shadow-md transition-all duration-300"
                style={{
                  borderRadius: 16,
                  border: "1px solid #ececec",
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <label
                  className="flex items-center cursor-pointer select-none font-bold text-gray-700"
                  style={{ gap: 12, fontSize: "clamp(14px, 2.5vw, 16px)" }}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className="flex items-center justify-center transition-all duration-200 border-2 rounded-md"
                      style={{
                        width: 22,
                        height: 22,
                        borderColor: allSelected ? "#2E7D32" : "#ccc",
                        backgroundColor: allSelected ? "#2E7D32" : "transparent",
                      }}
                    >
                      {allSelected && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span>{locale === "ar" ? "اختيار الكل" : "Select All"}</span>
                </label>

                <div
                  className="text-gray-500 font-medium"
                  style={{ fontSize: "clamp(13px, 2.3vw, 15px)" }}
                >
                  {locale === "ar"
                    ? `تم تحديد (${selectedCount} من ${cartItems.length})`
                    : `Selected (${selectedCount} of ${cartItems.length})`}
                </div>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white hover:shadow-lg transition-all duration-300"
                  style={{
                    borderRadius: 16,
                    border: "1px solid #ececec",
                    padding: "clamp(12px, 2.5vw, 20px)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "clamp(12px, 2.5vw, 20px)",
                    alignItems: "center",
                    opacity: item.selected === false ? 0.75 : 1,
                    transition: "opacity 0.3s, box-shadow 0.3s",
                  }}
                >
                  {/* Select Checkbox */}
                  <div
                    className="relative flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform duration-200"
                    onClick={() => toggleSelectItem(item.id)}
                    style={{ width: 24, height: 24 }}
                  >
                    <input
                      type="checkbox"
                      checked={item.selected !== false}
                      onChange={() => {}} // toggling handled by click
                      className="sr-only"
                    />
                    <div
                      className="flex items-center justify-center transition-all duration-200 border-2 rounded-md"
                      style={{
                        width: 22,
                        height: 22,
                        borderColor: item.selected !== false ? "#2E7D32" : "#ccc",
                        backgroundColor: item.selected !== false ? "#2E7D32" : "transparent",
                      }}
                    >
                      {item.selected !== false && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {/* Image */}
                  <Link
                    to={`/product/${item.id}`}
                    className="shrink-0 overflow-hidden flex items-center justify-center"
                    style={{
                      width: "clamp(80px, 18vw, 110px)",
                      height: "clamp(80px, 18vw, 110px)",
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #f0f5f0, #e8f0e8)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={locale === "ar" ? item.nameAr : item.nameEn}
                      style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }}
                    />
                  </Link>

                  {/* Details */}
                  <div style={{ flex: "1 1 150px", minWidth: 0 }}>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-bold text-gray-800 hover:text-primary transition-colors block"
                      style={{
                        fontSize: "clamp(14px, 2.8vw, 17px)",
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textDecoration: "none",
                      }}
                    >
                      {locale === "ar" ? item.nameAr : item.nameEn}
                    </Link>
                    <p
                      className="text-gray-400 font-medium"
                      style={{ fontSize: "clamp(11px, 2vw, 13px)", marginBottom: 6 }}
                    >
                      {locale === "ar" ? item.weightAr : item.weightEn}
                    </p>
                    <div
                      className="font-extrabold text-primary"
                      style={{ fontSize: "clamp(16px, 3vw, 20px)" }}
                    >
                      {item.price.toFixed(2)}{" "}
                      <span style={{ fontSize: "clamp(12px, 2vw, 14px)" }}>
                        {locale === "ar" ? "ج.م" : "EGP"}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Delete wrapper */}
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      paddingTop: "clamp(10px, 2vw, 14px)",
                      borderTop: "1px solid #f0f0f0",
                    }}
                    className="sm:w-auto sm:border-t-0 sm:pt-0"
                  >
                    {/* Quantity Controls */}
                    <div
                      className="inline-flex items-center bg-white overflow-hidden"
                      style={{
                        borderRadius: 12,
                        height: "clamp(36px, 7vw, 42px)",
                        border: "2px solid #e8e8e8",
                      }}
                    >
                      <button
                        className="flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
                        style={{
                          width: "clamp(34px, 7vw, 42px)",
                          height: "100%",
                          fontSize: "clamp(16px, 3vw, 20px)",
                          border: "none",
                          background: "none",
                        }}
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span
                        className="flex items-center justify-center font-bold bg-gray-50"
                        style={{
                          width: "clamp(36px, 8vw, 46px)",
                          height: "100%",
                          fontSize: "clamp(14px, 2.5vw, 16px)",
                          borderLeft: "2px solid #e8e8e8",
                          borderRight: "2px solid #e8e8e8",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:hover:text-gray-500"
                        style={{
                          width: "clamp(34px, 7vw, 42px)",
                          height: "100%",
                          fontSize: "clamp(16px, 3vw, 20px)",
                          border: "none",
                          background: "none",
                          cursor: item.quantity >= (item.stock || 9999) ? "not-allowed" : "pointer"
                        }}
                        disabled={item.quantity >= (item.stock || 9999)}
                        onClick={() => {
                          const newQty = Math.min((item.stock || 9999), item.quantity + 1);
                          updateCartQuantity(item.id, newQty);
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total */}
                    <div
                      className="font-bold text-gray-600 hidden sm:block"
                      style={{ fontSize: "clamp(13px, 2.5vw, 15px)", minWidth: 80, textAlign: "center" }}
                    >
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      <span className="text-gray-400" style={{ fontSize: 12 }}>
                        {locale === "ar" ? "ج.م" : "EGP"}
                      </span>
                    </div>

                    {/* Delete Button */}
                    <button
                      className="flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer active:scale-90"
                      style={{
                        width: "clamp(36px, 7vw, 42px)",
                        height: "clamp(36px, 7vw, 42px)",
                        borderRadius: 12,
                        border: "1.5px solid #fee2e2",
                        background: "#fff5f5",
                        flexShrink: 0,
                      }}
                      onClick={() => removeFromCart(item.id)}
                      aria-label={locale === "ar" ? "حذف" : "Remove"}
                    >
                      <lord-icon
                        src="/icons/skkahier.json"
                        trigger="hover"
                        colors="primary:#ef4444"
                        style={{ width: "20px", height: "20px" }}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-white sticky top-24"
                style={{
                  borderRadius: 20,
                  border: "1px solid #ececec",
                  padding: "clamp(18px, 3.5vw, 28px)",
                }}
              >
                <div className="flex items-center" style={{ gap: 8, marginBottom: "clamp(14px, 3vw, 20px)", paddingBottom: "clamp(14px, 3vw, 20px)", borderBottom: "1px solid #f0f0f0" }}>
                  <lord-icon
                    src="/icons/jfhbogmw.json"
                    trigger="loop"
                    delay="3000"
                    colors="primary:#2E7D32"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <h3
                    className="font-bold text-gray-800"
                    style={{ fontSize: "clamp(16px, 3vw, 19px)" }}
                  >
                    {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 2vw, 14px)", marginBottom: "clamp(18px, 3.5vw, 24px)" }}>
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span
                      className="text-gray-500 font-medium"
                      style={{ fontSize: "clamp(13px, 2.5vw, 15px)" }}
                    >
                      {locale === "ar" ? "المجموع الفرعي" : "Subtotal"}
                      <span className="text-gray-400" style={{ marginInlineStart: 6, fontSize: "clamp(11px, 2vw, 13px)" }}>
                        ({cartTotalQuantity} {locale === "ar" ? "عناصر" : "items"})
                      </span>
                    </span>
                    <span
                      className="font-bold text-gray-700"
                      style={{ fontSize: "clamp(14px, 2.5vw, 16px)" }}
                    >
                      {cartTotal.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center">
                    <span
                      className="text-gray-500 font-medium flex items-center"
                      style={{ fontSize: "clamp(13px, 2.5vw, 15px)", gap: 6 }}
                    >
                      <lord-icon
                        src="/icons/surcxhka.json"
                        trigger="loop"
                        delay="4000"
                        colors="primary:#22c55e"
                        style={{ width: "18px", height: "18px" }}
                      />
                      {locale === "ar" ? "التوصيل" : "Shipping"}
                    </span>
                    <span
                      className="font-bold text-green-600"
                      style={{
                        fontSize: "clamp(12px, 2.5vw, 14px)",
                        background: "#f0fdf4",
                        padding: "2px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {locale === "ar" ? "مجاني" : "Free"}
                    </span>
                  </div>

                  {/* Taxes */}
                  <div className="flex justify-between items-center" style={{ paddingBottom: "clamp(10px, 2vw, 14px)", borderBottom: "1px solid #f0f0f0" }}>
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
                    >
                      {locale === "ar" ? "الضرائب" : "Taxes"}
                    </span>
                    <span
                      className="text-gray-400 font-medium"
                      style={{ fontSize: "clamp(12px, 2vw, 14px)" }}
                    >
                      0.00 {locale === "ar" ? "ج.م" : "EGP"}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-end" style={{ paddingTop: 4 }}>
                    <span
                      className="font-bold text-gray-800"
                      style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
                    >
                      {locale === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span
                      className="font-extrabold text-primary"
                      style={{ fontSize: "clamp(22px, 4.5vw, 28px)", lineHeight: 1 }}
                    >
                      {cartTotal.toFixed(2)}{" "}
                      <span style={{ fontSize: "clamp(13px, 2.5vw, 16px)" }}>
                        {locale === "ar" ? "ج.م" : "EGP"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                {selectedCount > 0 ? (
                  isAuthenticated ? (
                    <Link
                      to="/checkout"
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 flex justify-center items-center cursor-pointer active:scale-[0.97]"
                      style={{
                        padding: "clamp(12px, 2.5vw, 16px) 16px",
                        borderRadius: 14,
                        fontSize: "clamp(14px, 2.7vw, 16px)",
                        gap: 8,
                        border: "none",
                        boxShadow: "0 4px 16px rgba(46,125,50,0.25)",
                        marginBottom: 12,
                        textDecoration: "none"
                      }}
                    >
                      <lord-icon
                        src="/icons/surjmvno.json"
                        trigger="hover"
                        colors="primary:#ffffff"
                        style={{ width: "22px", height: "22px" }}
                      />
                      {locale === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}
                      <svg
                        className={isRTL ? "rotate-180" : ""}
                        style={{ width: 18, height: 18 }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLoginWarning(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 flex justify-center items-center cursor-pointer active:scale-[0.97]"
                      style={{
                        padding: "clamp(12px, 2.5vw, 16px) 16px",
                        borderRadius: 14,
                        fontSize: "clamp(14px, 2.8vw, 16px)",
                        gap: 8,
                        border: "none",
                        boxShadow: "0 4px 16px rgba(46,125,50,0.25)",
                        marginBottom: 12,
                      }}
                    >
                      <lord-icon
                        src="/icons/surjmvno.json"
                        trigger="hover"
                        colors="primary:#ffffff"
                        style={{ width: "22px", height: "22px" }}
                      />
                      {locale === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}
                      <svg
                        className={isRTL ? "rotate-180" : ""}
                        style={{ width: 18, height: 18 }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )
                ) : (
                  <div
                    className="w-full bg-gray-200 text-gray-400 font-bold flex justify-center items-center cursor-not-allowed select-none"
                    style={{
                      padding: "clamp(12px, 2.5vw, 16px) 16px",
                      borderRadius: 14,
                      fontSize: "clamp(14px, 2.8vw, 16px)",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <lord-icon
                      src="/icons/surjmvno.json"
                      trigger="hover"
                      colors="primary:#9ca3af"
                      style={{ width: "22px", height: "22px" }}
                    />
                    {locale === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}
                    <svg
                      className={isRTL ? "rotate-180" : ""}
                      style={{ width: 18, height: 18 }}
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}

                {/* Login Required Warning Banner */}
                {selectedCount > 0 && !isAuthenticated && (
                  <div
                    className="bg-blue-50 text-blue-800 font-medium"
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      fontSize: 13,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: 12,
                      border: "1px solid #dbeafe",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, color: "#2563eb" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span style={{ fontWeight: 700 }}>
                        {locale === "ar" ? "تسجيل الدخول مطلوب" : "Login Required"}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: "#1e40af", lineHeight: 1.5 }}>
                      {locale === "ar"
                        ? "يجب تسجيل الدخول إلى حسابك أولاً لتتمكن من تأكيد طلب الشراء وإتمام الدفع بنجاح."
                        : "You must be logged in to your account first to complete the checkout and confirm payment."}
                    </p>
                    <Link
                      to="/login?redirect=/checkout"
                      style={{
                        alignSelf: isRTL ? "flex-start" : "flex-end",
                        color: "#2563eb",
                        fontWeight: 700,
                        fontSize: 12,
                        textDecoration: "underline",
                        marginTop: 4,
                      }}
                    >
                      {locale === "ar" ? "سجل دخولك الآن ←" : "Sign in now →"}
                    </Link>
                  </div>
                )}

                {/* Warning Banner if nothing is selected */}
                {selectedCount === 0 && (
                  <div
                    className="bg-amber-50 text-amber-700 font-medium"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                      border: "1px solid #fef3c7",
                    }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                      {locale === "ar"
                        ? "يرجى اختيار عنصر واحد على الأقل لإتمام الطلب"
                        : "Please select at least one item to proceed"}
                    </span>
                  </div>
                )}

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-all duration-200 flex justify-center items-center"
                  style={{
                    padding: "clamp(10px, 2vw, 14px) 16px",
                    borderRadius: 14,
                    fontSize: "clamp(13px, 2.5vw, 15px)",
                    gap: 8,
                    border: "1px solid #eee",
                    textDecoration: "none",
                  }}
                >
                  <lord-icon
                    src="/icons/nlbraydi.json"
                    trigger="hover"
                    colors="primary:#4b5563"
                    style={{ width: "18px", height: "18px" }}
                  />
                  {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                </Link>

                {/* Trust badges */}
                <div
                  style={{
                    marginTop: "clamp(16px, 3vw, 24px)",
                    paddingTop: "clamp(14px, 3vw, 20px)",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "center",
                    gap: "clamp(16px, 3vw, 24px)",
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    {
                      icon: "/icons/surjmvno.json",
                      label: locale === "ar" ? "دفع آمن" : "Secure Pay",
                    },
                    {
                      icon: "/icons/surcxhka.json",
                      label: locale === "ar" ? "توصيل سريع" : "Fast Delivery",
                    },
                    {
                      icon: "/icons/etwtznjn.json",
                      label: locale === "ar" ? "جودة مضمونة" : "Quality",
                    },
                  ].map((badge, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center"
                      style={{ gap: 4 }}
                    >
                      <lord-icon
                        src={badge.icon}
                        trigger="loop"
                        delay="3000"
                        colors="primary:#9ca3af"
                        style={{ width: "24px", height: "24px", opacity: 0.6 }}
                      />
                      <span
                        className="text-gray-400 font-medium"
                        style={{ fontSize: "clamp(10px, 1.8vw, 12px)" }}
                      >
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 640px) {
          .sm\\:w-auto { width: auto !important; }
          .sm\\:border-t-0 { border-top: none !important; }
          .sm\\:pt-0 { padding-top: 0 !important; }
        }
      `}</style>
    </div>
  );
}
