import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import checkoutService from "../service/api/checkoutService";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { locale, direction } = useLanguage();
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: user?.address || "",
    city: "",
    phone: user?.phone || "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  useEffect(() => {
    if (cartCount === 0 && !orderSuccess) {
      navigate("/cart");
    }
  }, [cartCount, orderSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
      const matches = v.match(/\d{4,16}/g);
      const match = (matches && matches[0]) || "";
      let parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      setFormData({ ...formData, [name]: parts.length ? parts.join(" ") : value });
      return;
    }

    if (name === "cardExpiry") {
      let v = value.replace(/\D/g, "");
      if (v.length > 2) v = v.replace(/^(.{2})/, "$1/");
      setFormData({ ...formData, [name]: v });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // In a real multi-item cart, we might create multiple orders or a single order with items
      // Since the backend currently has a single listing_id per order, we'll loop or just take the first one
      // FOR THE DEMO: We'll assume the backend can handle the first item for now.
      
      const payload = {
        items: cartItems.map(item => ({
          listing_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          negotiation_id: item.negotiation_id || null
        })),
        total_price: cartTotal,
        net_amount: cartTotal,
        payment_method: paymentMethod,
        shipping_address: `${formData.address}, ${formData.city}`,
        contact_phone: formData.phone,
        notes: formData.notes
      };

      const result = await checkoutService.placeOrder(payload);
      
      setIsProcessing(false);
      setOrderId(result.data?.id || Math.floor(Math.random() * 90000) + 10000);
      setOrderSuccess(true);
      toast.success(locale === "ar" ? "تم تأكيد طلبك بنجاح!" : "Order confirmed successfully!");
      if (clearCart) clearCart();
      
      // Auto-redirect after 3 seconds or via button
      setTimeout(() => {
        navigate("/dashboard/orders");
      }, 3000);
    } catch (err) {
      console.error("Order error:", err);
      
      let msg = locale === "ar" ? "فشل إتمام الطلب. يرجى المحاولة مرة أخرى." : "Failed to place order. Please try again.";
      
      if (err.status === 401) {
        msg = locale === "ar" ? "جلسة العمل انتهت. يرجى تسجيل الدخول مرة أخرى." : "Session expired. Please login again.";
      } else if (err.status === 403) {
        msg = locale === "ar" ? "عذراً، ليس لديك صلاحية لإتمام هذا الطلب. يجب أن يكون حسابك من نوع تاجر." : "Sorry, you don't have permission to place this order. Your account must be a TRADER.";
      } else if (err.message) {
        msg = err.message;
      }
      
      setError(msg);
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  /* ========== SUCCESS SCREEN ========== */
  if (orderSuccess) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          minHeight: "calc(100vh - 180px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          background: "#f8faf8",
        }}
      >
        <style>{`
          @keyframes dash { 0% { stroke-dashoffset: 1000; } 100% { stroke-dashoffset: 0; } }
          @keyframes dash-check { 0% { stroke-dashoffset: 100; } 100% { stroke-dashoffset: 0; } }
          @keyframes scale-up { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          .circle-anim { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: dash 1s ease-out forwards; }
          .check-anim { stroke-dasharray: 100; stroke-dashoffset: 100; animation: dash-check 0.5s ease-out 0.6s forwards; }
          .success-wrap { animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}</style>

        <div
          style={{
            background: "#fff",
            padding: "clamp(40px, 8vw, 60px) clamp(24px, 5vw, 48px)",
            textAlign: "center",
            borderRadius: 24,
            boxShadow: "0 25px 50px rgba(46,125,50,0.08)",
            maxWidth: 500,
            width: "100%",
            border: "1px solid #f0fdf4",
          }}
        >
          {/* Animated Check */}
          <div
            className="success-wrap"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "#f0fdf4",
              margin: "0 auto 24px",
            }}
          >
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="#22c55e" strokeWidth="6" className="circle-anim" fill="none" />
              <path d="M28 53 L42 66 L74 34" stroke="#2E7D32" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className="check-anim" fill="none" />
            </svg>
          </div>

          <h2 style={{ fontSize: "clamp(22px, 5vw, 30px)", fontWeight: 800, color: "#1f2937", marginBottom: 12 }}>
            {locale === "ar" ? "تم تأكيد طلبك بنجاح!" : "Order Confirmed!"}
          </h2>
          <p style={{ fontSize: "clamp(14px, 2.5vw, 16px)", color: "#6b7280", fontWeight: 500, marginBottom: 32, lineHeight: 1.7 }}>
            {locale === "ar"
              ? "شكراً لك. تم استلام طلبك وسنقوم بتجهيزه في أسرع وقت. سيصلك بريد إلكتروني بالتفاصيل."
              : "Thank you. Your order has been received and will be processed shortly. You'll receive an email with details."}
          </p>

          <div
            style={{
              background: "#f9fafb",
              padding: "14px 20px",
              borderRadius: 14,
              marginBottom: 32,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "clamp(13px, 2.5vw, 15px)",
              border: "1px solid #f3f4f6",
            }}
          >
            <span style={{ color: "#6b7280" }}>{locale === "ar" ? "رقم الطلب:" : "Order Number:"}</span>
            <span style={{ fontWeight: 700, color: "#1f2937" }}>#WA-{orderId}</span>
          </div>

          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "clamp(15px, 2.5vw, 17px)",
              padding: "16px 24px",
              borderRadius: 14,
              boxShadow: "0 10px 25px rgba(46,125,50,0.3)",
              gap: 8,
              textDecoration: "none",
              transition: "transform 0.3s",
            }}
          >
            {locale === "ar" ? "العودة للتسوق" : "Back to Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  /* ========== CHECKOUT FORM ========== */
  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fafafa",
    fontSize: 15,
    transition: "all 0.3s ease",
    color: "#374151",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#4b5563",
    marginBottom: 8,
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", padding: "32px 0 80px", background: "#f8faf8" }}>
      <style>{`
        .checkout-input:focus {
          border-color: #2E7D32 !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(46,125,50,0.1) !important;
        }
        .checkout-input::placeholder { color: #9ca3af; }
        .method-card { cursor: pointer; transition: all 0.2s ease; }
        .method-card:hover { border-color: #a7cfa9; }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
        }
        .anim-card { animation: float-card 4s ease-in-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
        @media (max-width: 900px) {
          .checkout-layout { flex-direction: column !important; }
          .checkout-left, .checkout-right { width: 100% !important; }
          .decorative-card-wrap { display: none !important; }
        }
        @media (max-width: 600px) {
          .payment-methods-grid { grid-template-columns: 1fr !important; }
          .card-fields-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px, 1vw, 24px)" }}>

        {/* Page Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: "clamp(24px, 4vw, 10px)",
            paddingBottom: 5,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h1 style={{ fontSize: "clamp(20px, 4vw, 30px)", fontWeight: 800, color: "#1f2937", display: "flex", alignItems: "center", gap: 12 }}>
            <lord-icon src="/icons/surjmvno.json" trigger="loop" colors="primary:#2E7D32" style={{ width: "32px", height: "32px" }} />
            {locale === "ar" ? "إتمام الطلب" : "Secure Checkout"}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {locale === "ar" ? "دفع آمن 100%" : "100% Secure Checkout"}
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="checkout-layout" style={{ display: "flex", gap: "clamp(20px, 3vw, 32px)" }}>

          {/* LEFT COLUMN */}
          <div className="checkout-left" style={{ flex: "1 1 65%", display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 24px)" }}>

            {/* 1. Shipping Details */}
            <div
              style={{
                background: "#fff",
                padding: "clamp(20px, 4vw, 10px)",
                borderRadius: 24,
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: 0, [isRTL ? "left" : "right"]: 0, width: 120, height: 120, background: "#f0fdf4", borderRadius: isRTL ? "0 0 100px 0" : "0 0 0 100px", opacity: 0.5, zIndex: 0 }} />

              <h2 style={{ fontSize: "clamp(17px, 3vw, 20px)", fontWeight: 700, color: "#1f2937", marginBottom: "clamp(16px, 3vw, 24px)", display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#2E7D32", color: "#fff", fontSize: 14, fontWeight: 700 }}>1</span>
                {locale === "ar" ? "بيانات التوصيل" : "Shipping Details"}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, position: "relative", zIndex: 1 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>{locale === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="checkout-input" style={inputStyle} placeholder={locale === "ar" ? "أحمد محمد" : "John Doe"} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>{locale === "ar" ? "البريد الإلكتروني" : "Email Address"}</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="checkout-input" style={inputStyle} placeholder="example@mail.com" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>{locale === "ar" ? "العنوان بالتفصيل" : "Street Address"}</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleInputChange} className="checkout-input" style={inputStyle} placeholder={locale === "ar" ? "123 شارع السلام، مبنى 4" : "123 Main St, Apt 4"} />
                </div>
                <div>
                  <label style={labelStyle}>{locale === "ar" ? "المدينة" : "City"}</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="checkout-input" style={inputStyle} placeholder={locale === "ar" ? "القاهرة" : "Cairo"} />
                </div>
                <div>
                  <label style={labelStyle}>{locale === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="checkout-input" style={inputStyle} placeholder="01xxxxxxxxx" />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div
              style={{
                background: "#fff",
                padding: "clamp(20px, 4vw, 10px)",
                borderRadius: 24,
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              }}
            >
              <h2 style={{ fontSize: "clamp(17px, 3vw, 20px)", fontWeight: 700, color: "#1f2937", marginBottom: "clamp(16px, 3vw, 24px)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#2E7D32", color: "#fff", fontSize: 14, fontWeight: 700 }}>2</span>
                {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
              </h2>

              {/* Payment Choices */}
              <div className="payment-methods-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
                {/* Card */}
                <div
                  className="method-card"
                  onClick={() => setPaymentMethod("card")}
                  style={{
                    border: `2px solid ${paymentMethod === "card" ? "#2E7D32" : "#e5e7eb"}`,
                    borderRadius: 16,
                    padding: 16,
                    background: paymentMethod === "card" ? "#f0fdf4" : "#fff",
                    boxShadow: paymentMethod === "card" ? "0 4px 12px rgba(46,125,50,0.1)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 14 }}>{locale === "ar" ? "بطاقة ائتمان / خصم" : "Credit / Debit Card"}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{locale === "ar" ? "دفع آمن مشفر" : "Encrypted secure pay"}</p>
                  </div>
                  <div dir="ltr" style={{ display: "flex", gap: 4 }}>
                    <svg width="32" viewBox="0 0 50 16" fill="none"><path d="M14.9 0L9.8 15.3H6.5L4.2 3.3C4 .8 3.6 0 1.2 0H0V1.5C2.5 2.1 4.5 3.5 5.5 5.8L7.4 15.3H11.5L18.4 0H14.9ZM36.2 11C36.2 6.5 29.5 6.3 29.5 4.5C29.5 3.9 30.2 3.3 32.1 3.1C33.1 3 35.8 3.1 37.1 4L37.8 0.6C36.5 0 34.6 0 32.4 0C29.4 0 26.2 1.6 26.1 5.3C26 8 28.5 9.5 30.5 10.5C32.4 11.4 33.1 12 33.1 12.8C33.1 14 31.6 14.6 30 14.6C26.8 14.6 25 13.5 24 12.8L23.3 16C24.7 16.7 27.2 17.2 29.7 17.2C33.1 17.4 36.2 15.7 36.2 11ZM46.3 15.3C47 15.3 47.7 14.9 48 14.3L50 0H46.7L45.4 7C45.2 6 42.8 0 42.8 0H39.2C38.6 0 38.3 0.4 38.2 0.8L35 15.3H38.5L39.2 13.2H43.3L43.8 15.3H46.3ZM40.1 10.5L41.7 5.8L42.6 10.5H40.1ZM23 0H19.8L15.9 15.3H19.3L23 0Z" fill="#1434CB" /></svg>
                  </div>
                </div>

                {/* Cash */}
                <div
                  className="method-card"
                  onClick={() => setPaymentMethod("cash")}
                  style={{
                    border: `2px solid ${paymentMethod === "cash" ? "#2E7D32" : "#e5e7eb"}`,
                    borderRadius: 16,
                    padding: 16,
                    background: paymentMethod === "cash" ? "#f0fdf4" : "#fff",
                    boxShadow: paymentMethod === "cash" ? "0 4px 12px rgba(46,125,50,0.1)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 14 }}>{locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}</p>
                    <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{locale === "ar" ? "ادفع نقداً عند استلام طلبك" : "Pay when you receive"}</p>
                  </div>
                  <svg width="28" height="28" fill="none" stroke="#2E7D32" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>

              {/* Card Form (if card selected) */}
              {paymentMethod === "card" && (
                <div>
                  {/* Decorative Card Preview */}
                  <div className="decorative-card-wrap" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
                    <div
                      className="anim-card"
                      dir="ltr"
                      style={{
                        width: 280,
                        height: 160,
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                        color: "#fff",
                        padding: 10,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                      <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <svg width="30" height="24" viewBox="0 0 24 16" fill="none"><rect width="24" height="16" rx="4" fill="#EAB308" opacity="0.8" /><path d="M4 8h16M8 4v8M16 4v8" stroke="#FEF08A" strokeWidth="0.5" /></svg>
                        <svg width="40" viewBox="0 0 50 16" fill="none"><path d="M14.9 0L9.8 15.3H6.5L4.2 3.3C4 .8 3.6 0 1.2 0H0V1.5C2.5 2.1 4.5 3.5 5.5 5.8L7.4 15.3H11.5L18.4 0H14.9ZM36.2 11C36.2 6.5 29.5 6.3 29.5 4.5C29.5 3.9 30.2 3.3 32.1 3.1C33.1 3 35.8 3.1 37.1 4L37.8 0.6C36.5 0 34.6 0 32.4 0C29.4 0 26.2 1.6 26.1 5.3C26 8 28.5 9.5 30.5 10.5C32.4 11.4 33.1 12 33.1 12.8C33.1 14 31.6 14.6 30 14.6C26.8 14.6 25 13.5 24 12.8L23.3 16C24.7 16.7 27.2 17.2 29.7 17.2C33.1 17.4 36.2 15.7 36.2 11ZM46.3 15.3C47 15.3 47.7 14.9 48 14.3L50 0H46.7L45.4 7C45.2 6 42.8 0 42.8 0H39.2C38.6 0 38.3 0.4 38.2 0.8L35 15.3H38.5L39.2 13.2H43.3L43.8 15.3H46.3ZM40.1 10.5L41.7 5.8L42.6 10.5H40.1ZM23 0H19.8L15.9 15.3H19.3L23 0Z" fill="#fff" /></svg>
                      </div>

                      <div style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.15em", marginBottom: 8, opacity: 0.9 }}>
                        {formData.cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                        <span>{formData.name || (locale === "ar" ? "الاسم" : "NAME")}</span>
                        <span>{formData.cardExpiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Fields */}
                  <div className="card-fields-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={labelStyle}>{locale === "ar" ? "رقم البطاقة" : "Card Number"}</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="cardNumber"
                          required={paymentMethod === "card"}
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="checkout-input"
                          style={{ ...inputStyle, paddingInlineStart: 44 }}
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          dir="ltr"
                        />
                        <svg style={{ position: "absolute", top: 14, [isRTL ? "right" : "left"]: 14, color: "#9ca3af" }} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>{locale === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</label>
                      <input type="text" name="cardExpiry" required={paymentMethod === "card"} value={formData.cardExpiry} onChange={handleInputChange} className="checkout-input" style={inputStyle} placeholder="MM/YY" maxLength="5" dir="ltr" />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <div style={{ position: "relative" }}>
                        <input type="password" name="cardCvc" required={paymentMethod === "card"} value={formData.cardCvc} onChange={handleInputChange} className="checkout-input" style={{ ...inputStyle, paddingInlineEnd: 40 }} placeholder="123" maxLength="4" dir="ltr" />
                        <svg style={{ position: "absolute", top: 14, [isRTL ? "left" : "right"]: 14, color: "#9ca3af" }} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="checkout-right" style={{ flex: "1 1 35%", minWidth: 0 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 24,
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                padding: "clamp(20px, 3.5vw, 10px)",
                position: "sticky",
                top: 96,
              }}
            >
              {/* Summary Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
                <h2 style={{ fontSize: "clamp(16px, 2.5vw, 18px)", fontWeight: 700, color: "#1f2937" }}>
                  {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
                </h2>
                <span style={{ background: "rgba(46,125,50,0.1)", color: "#2E7D32", fontSize: 12, padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                  {cartCount} {locale === "ar" ? "منتجات" : "Items"}
                </span>
              </div>

              {/* Product List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20, maxHeight: 195, overflowY: "auto", paddingInlineEnd: 8, scrollbarWidth: "thin" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 12, background: "#f9fafb", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: 4, flexShrink: 0 }}>
                      <img src={item.image} alt={item.nameEn} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {locale === "ar" ? item.nameAr : item.nameEn}
                      </h4>
                      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{locale === "ar" ? "الكمية:" : "Qty:"} {item.quantity}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#2E7D32", marginTop: 4 }}>
                        {(item.price * item.quantity).toFixed(2)} <span style={{ fontSize: 12, fontWeight: 400 }}>{locale === "ar" ? "ج.م" : "EGP"}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Numbers */}
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280" }}>
                  <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{cartTotal.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#6b7280" }}>
                  <span>{locale === "ar" ? "الشحن" : "Shipping"}</span>
                  <span style={{ fontWeight: 600, color: "#16a34a", background: "#f0fdf4", padding: "2px 10px", borderRadius: 6, fontSize: 12 }}>{locale === "ar" ? "مجاني" : "Free"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 18, fontWeight: 800, color: "#1f2937", borderTop: "1px dashed #e5e7eb", paddingTop: 12, marginTop: 4 }}>
                  <span>{locale === "ar" ? "الإجمالي" : "Total"}</span>
                  <span style={{ color: "#2E7D32" }}>
                    {cartTotal.toFixed(2)} <span style={{ fontSize: 14 }}>{locale === "ar" ? "ج.م" : "EGP"}</span>
                  </span>
                </div>
              </div>

              {error && (
                <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: '#fef2f2', color: '#dc2626', fontSize: 13, fontWeight: 600, border: '1px solid #fee2e2' }}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  width: "100%",
                  marginTop: 24,
                  background: isProcessing ? "#86efac" : "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  padding: 16,
                  borderRadius: 14,
                  border: "none",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  boxShadow: "0 8px 24px rgba(46,125,50,0.25)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.3s",
                }}
              >
                {isProcessing ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="#fff" />
                    </svg>
                    {locale === "ar" ? "جاري المعالجة..." : "Processing..."}
                  </>
                ) : (
                  <>
                    {locale === "ar" ? "تأكيد الطلب والدفع" : "Confirm & Pay"}
                  </>
                )}
              </button>

              {/* Secure Text */}
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                {locale === "ar" ? "عملية آمنة ومحمية" : "Secure encoded transaction"}
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
