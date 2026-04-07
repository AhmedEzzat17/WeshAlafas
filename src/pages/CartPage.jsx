import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { locale, direction } = useLanguage();
  const { cartItems, updateCartQuantity, removeFromCart, cartTotal, cartCount, cartTotalQuantity } = useCart();
  const isRTL = direction === "rtl";

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

      <div className="max-w-[1600px] mx-auto" style={{ padding: "20px 16px" }}>
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
          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: "clamp(16px, 3vw, 24px)" }}>
            {/* Cart Items Column */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: "clamp(10px, 2vw, 16px)" }}>
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
                  }}
                >
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
                        className="flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
                        style={{
                          width: "clamp(34px, 7vw, 42px)",
                          height: "100%",
                          fontSize: "clamp(16px, 3vw, 20px)",
                          border: "none",
                          background: "none",
                        }}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
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
                <Link
                  to="/checkout"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 flex justify-center items-center cursor-pointer active:scale-[0.97]"
                  style={{
                    padding: "clamp(12px, 2.5vw, 16px) 16px",
                    borderRadius: 14,
                    fontSize: "clamp(14px, 2.8vw, 16px)",
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
