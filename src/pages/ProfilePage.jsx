import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { authService } from "../service/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { locale, direction, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // "menu" | "orders" | "payments" | "addresses" | "settings"
  const [currentView, setCurrentView] = useState("menu");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Added States for Editing
  const [address, setAddress] = useState(locale === "ar" ? "123 شارع السلام، مبنى 4، الدور الثاني، القاهرة، مصر" : "123 El Salam St, Bldg 4, 2nd Floor, Cairo, Egypt");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 1234");
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [tempPayment, setTempPayment] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const isRTL = direction === "rtl";

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      await logout();
      navigate("/");
    }, 1000);
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    return user.fullName || user.name || (locale === "ar" ? "عميل" : "User");
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : (locale === "ar" ? "١ يناير ٢٠٢٤ ١٠:٠٠ ص" : "Jan 1, 2024, 10:00 AM");

  // Mock data for display
  const orders = [
    {
      id: "WA-78291",
      date: locale === "ar" ? "١٠ ابريل ٢٠٢٤" : "Apr 10, 2024",
      total: "155,000.00",
      status: locale === "ar" ? "مكتمل" : "Completed",
      statusColor: "#22c55e",
      items: [
        { name: locale === "ar" ? "تفاح عضوي طازج" : "Fresh Organic Apple", qty: 2, price: "45,000.00" },
        { name: locale === "ar" ? "فراولة ممتازة" : "Premium Strawberries", qty: 1, price: "65,000.00" }
      ]
    },
    {
      id: "WA-65412",
      date: locale === "ar" ? "٢٢ مارس ٢٠٢٤" : "Mar 22, 2024",
      total: "50,000.00",
      status: locale === "ar" ? "قيد المعالجة" : "Processing",
      statusColor: "#f59e0b",
      items: [
        { name: locale === "ar" ? "موز عضوي" : "Organic Bananas", qty: 2, price: "25,000.00" }
      ]
    },
  ];

  /* ===== BACK BUTTON ===== */
  const BackButton = () => (
    <button
      onClick={() => setCurrentView("menu")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "transparent",
        border: "none",
        color: "#4b5563",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        padding: "8px 0",
        marginBottom: 20,
      }}
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: isRTL ? "rotate(180deg)" : "none" }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      {locale === "ar" ? "العودة للقائمة" : "Back to Menu"}
    </button>
  );

  /* ===== RENDER MENU HUB ===== */
  const renderMenu = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Profile Summary Card */}
      <div style={{
        background: "linear-gradient(135deg, #2E7D32 0%, #1A4D2E 100%)",
        borderRadius: 24,
        padding: 32,
        color: "#fff",
        textAlign: "center",
        marginBottom: 24,
        boxShadow: "0 10px 30px rgba(46,125,50,0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative background circle */}
        <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>

        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "#fff", color: "#2E7D32", 
          fontSize: 32, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px", boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
          {getUserDisplayName().charAt(0).toUpperCase()}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px" }}>{getUserDisplayName()}</h2>
        <p style={{ opacity: 0.9, fontSize: 14, margin: "0 0 16px" }}>{user?.email}</p>
        
        <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", padding: "8px 16px", borderRadius: 20, fontSize: 13, backdropFilter: "blur(4px)" }}>
          {locale === "ar" ? "تاريخ الانضمام: " : "Joined: "} <strong>{formattedDate}</strong>
        </div>
      </div>

      {/* Grid Menu Options */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <button onClick={() => navigate("/dashboard")} className="hub-btn">
          <div className="icon-wrap" style={{ background: "#f0fdf4", color: "#2E7D32" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div style={{ textAlign: isRTL ? "right" : "left" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "التقارير والإحصائيات" : "Reports & Stats"}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{locale === "ar" ? "عرض التقارير المالية والتحليلات" : "View financial reports and analytics"}</p>
          </div>
        </button>

        <button onClick={() => setCurrentView("payments")} className="hub-btn">
          <div className="icon-wrap" style={{ background: "#eff6ff", color: "#2563eb" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          </div>
          <div style={{ textAlign: isRTL ? "right" : "left" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "وسائل الدفع" : "Payment Methods"}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{locale === "ar" ? "إدارة بطاقاتك وطرق الدفع" : "Manage your cards and payments"}</p>
          </div>
        </button>

        <button onClick={() => setCurrentView("addresses")} className="hub-btn">
          <div className="icon-wrap" style={{ background: "#FEF3C7", color: "#D97706" }}>
             <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div style={{ textAlign: isRTL ? "right" : "left" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "عناويني المحفوظة" : "Saved Addresses"}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{locale === "ar" ? "تعديل وإضافة عناوين التوصيل" : "Edit and add shipping addresses"}</p>
          </div>
        </button>

        {/* Dashboard Access Logic: STRICTLY Only for Admin or Farmer. */}
        {(() => {
          const accType = user?.account_type?.toUpperCase() || "";
          const role = user?.role?.toLowerCase() || "";
          const isFarmer = accType === "FARMER" || role === "farmer";
          const isAdmin = role === "admin";
          const isTrader = accType === "TRADER";
          const isEntity = accType === "ENTITY";

          // Show only if (Farmer or Admin) AND NOT (Trader or Entity)
          if ((isFarmer || isAdmin) && !isTrader && !isEntity) {
            return (
              <button 
                onClick={() => {
                  localStorage.setItem("dashboard_access", "true");
                  navigate("/dashboard");
                }} 
                className="hub-btn" 
                style={{ border: "1px solid #dcfce7", background: "#f0fdf4" }}
              >
                <div className="icon-wrap" style={{ background: "#dcfce7", color: "#166534" }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <div style={{ textAlign: isRTL ? "right" : "left" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#166534" }}>{locale === "ar" ? "لوحة التحكم" : "Dashboard"}</h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#15803d" }}>{locale === "ar" ? "عرض وإدارة لوحة التحكم الخاصة بك" : "View and manage your dashboard"}</p>
                </div>
              </button>
            );
          }
          return null;
        })()}

        <button onClick={() => setCurrentView("settings")} className="hub-btn">
          <div className="icon-wrap" style={{ background: "#F3F4F6", color: "#4B5563" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div style={{ textAlign: isRTL ? "right" : "left" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{locale === "ar" ? "الإعدادات" : "Settings"}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{locale === "ar" ? "اللغة والإشعارات وتفضيلاتك" : "Language, notifications, and preferences"}</p>
          </div>
        </button>

        <button onClick={() => setShowLogoutModal(true)} className="hub-btn" style={{ border: "1px solid #FECACA", background: "#FEF2F2" }}>
          <div className="icon-wrap" style={{ background: "#FEE2E2", color: "#DC2626" }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
          <div style={{ textAlign: isRTL ? "right" : "left" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#DC2626" }}>{locale === "ar" ? "تسجيل الخروج" : "Sign Out"}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#EF4444" }}>{locale === "ar" ? "الخروج من الحساب الخاص بك" : "Sign out of your account"}</p>
          </div>
        </button>
      </div>
    </div>
  );

  /* ===== RENDER ORDERS ===== */
  const renderOrders = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <BackButton />
      <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(20px, 4vw, 32px)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", marginBottom: 24 }}>{locale === "ar" ? "سجل الطلبات" : "Order History"}</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order, i) => (
            <div key={i} className="content-card" style={{ padding: 20, borderRadius: 16, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#111827" }}>{order.id}</h4>
                  <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{order.date}</p>
                </div>
                <div style={{ textAlign: isRTL ? "left" : "right" }}>
                  <span style={{ display: "block", fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{locale === "ar" ? "الإجمالي" : "Total"}</span>
                  <span style={{ fontWeight: 800, color: "#2E7D32", fontSize: 18 }}>{order.total} {locale === "ar" ? "ج.م" : "EGP"}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: "1px dashed #e5e7eb" }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${order.statusColor}15`, color: order.statusColor }}>
                  {order.status}
                </span>
                
                <button 
                  onClick={() => setSelectedOrder(order)}
                  style={{ background: "transparent", border: "none", color: "#2E7D32", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: isRTL ? "rotate(180deg)" : "none" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ===== RENDER PAYMENTS ===== */
  const renderPayments = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <BackButton />
      <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(20px, 4vw, 32px)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", margin: 0 }}>{locale === "ar" ? "وسائل الدفع" : "Payment Methods"}</h2>
          <button onClick={() => { setTempPayment(""); setIsEditingPayment(true); }} style={{ padding: "8px 16px", borderRadius: 12, background: "#2E7D32", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            {locale === "ar" ? "+ إضافة بطاقة" : "+ Add Card"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {/* Active Credit Card */}
          <div style={{ padding: 24, borderRadius: 20, background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <span style={{ background: "#2E7D32", color: "#fff", fontSize: 11, padding: "4px 12px", borderRadius: 12, fontWeight: 700 }}>{locale === "ar" ? "الأساسية" : "Primary"}</span>
              <button onClick={() => { setTempPayment(cardNumber); setIsEditingPayment(true); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                {locale === "ar" ? "تعديل البطاقة" : "Edit Card"}
              </button>
            </div>
            <p style={{ margin: "0 0 12px", fontSize: 20, fontFamily: "monospace", letterSpacing: 4, opacity: 0.9 }}>{cardNumber}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, opacity: 0.8, textTransform: "uppercase", fontWeight: 600 }}>
              <span>{getUserDisplayName()}</span>
              <span>12/26</span>
            </div>
          </div>
          
          {/* Cash On Delivery Option */}
          <div style={{ padding: 24, borderRadius: 20, border: "2px solid #e5e7eb", background: "#f9fafb", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2E7D32", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1f2937" }}>{locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}</h4>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
              {locale === "ar" ? "وسيلة الدفع الافتراضية متاحة لجميع طلباتك المحلية للتمتع بتجربة آمنة." : "Default payment method available securely for all your local orders."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ===== RENDER ADDRESSES ===== */
  const renderAddresses = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <BackButton />
      <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(20px, 4vw, 32px)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", margin: 0 }}>{locale === "ar" ? "عناويني المحفوظة" : "Saved Addresses"}</h2>
          <button onClick={() => { setTempAddress(""); setIsEditingAddress(true); }} style={{ padding: "8px 16px", borderRadius: 12, background: "#2E7D32", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            {locale === "ar" ? "+ إضافة عنوان" : "+ Add Address"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          <div style={{ padding: 24, borderRadius: 20, border: "2px solid #2E7D32", background: "#f0fdf4", position: "relative" }}>
            <span style={{ position: "absolute", top: 16, [isRTL ? "left" : "right"]: 16, background: "#2E7D32", color: "#fff", fontSize: 11, padding: "4px 12px", borderRadius: 12, fontWeight: 800 }}>
              {locale === "ar" ? "الرئيسي" : "Default"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <svg width="24" height="24" fill="none" stroke="#2E7D32" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1f2937" }}>{locale === "ar" ? "المنزل" : "Home"}</h4>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: 14, color: "#4b5563", fontWeight: 600 }}>{getUserDisplayName()}</p>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{address}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => { setTempAddress(address); setIsEditingAddress(true); }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
              >
                {locale === "ar" ? "تعديل" : "Edit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ===== RENDER SETTINGS ===== */
  const renderSettings = () => (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      <BackButton />
      <div style={{ background: "#fff", borderRadius: 24, padding: "clamp(20px, 4vw, 32px)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", margin: "0 0 24px" }}>{locale === "ar" ? "الإعدادات" : "Settings"}</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Language Feature */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", color: "#1f2937" }}>{locale === "ar" ? "لغة عرض الموقع" : "Display Language"}</h4>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{locale === "ar" ? "تغيير الواجهة إلى الأنجليزية أو العربية" : "Change interface to Arabic or English"}</p>
            </div>
            <button 
              onClick={toggleLanguage}
              style={{ padding: "10px 24px", borderRadius: 12, border: "2px solid #e5e7eb", background: "#fff", fontWeight: 800, cursor: "pointer", color: "#374151", transition: "all 0.2s" }}
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </div>
          
          <div style={{ borderTop: "1px solid #f3f4f6" }} />

          {/* Change Password */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", color: "#1f2937" }}>{locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}</h4>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{locale === "ar" ? "تحديث وتأمين حسابك بكلمة مرور جديدة" : "Update and secure your account with a new password"}</p>
            </div>
            <button 
              onClick={() => { setPasswordSuccess(false); setPasswords({current: "", new: "", confirm: ""}); setShowPasswordModal(true); }}
              style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "#e0f2fe", fontWeight: 800, cursor: "pointer", color: "#0284c7", transition: "all 0.2s" }}
            >
              {locale === "ar" ? "تغيير" : "Change"}
            </button>
          </div>
          
          <div style={{ borderTop: "1px solid #f3f4f6" }} />

          {/* Notifications */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 6px", color: "#1f2937" }}>{locale === "ar" ? "الإشعارات والعروض" : "Notifications & Offers"}</h4>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{locale === "ar" ? "الموافقة على تلقي العروض الحصرية على حسابك" : "Agree to receive exclusive offers on your account"}</p>
            </div>
            {/* Toggle styling */}
            <div style={{ width: 50, height: 28, background: "#2E7D32", borderRadius: 14, position: "relative", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: 2, left: isRTL ? 2 : 24, width: 24, height: 24, background: "#fff", borderRadius: "50%", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "calc(10px + 1vw) 0 80px", background: "#f8faf8", direction: isRTL ? "rtl" : "ltr", fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}>
      <style>{`
        .hub-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .hub-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          border-color: #2E7D32;
        }
        .hub-btn .icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalFade {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(16px, 3vw, 24px)" }}>
        {/* Render logic based on state */}
        {currentView === "menu" && renderMenu()}
        {currentView === "orders" && renderOrders()}
        {currentView === "payments" && renderPayments()}
        {currentView === "addresses" && renderAddresses()}
        {currentView === "settings" && renderSettings()}
      </div>

      {/* ==================== ORDER DETAILS MODAL ==================== */}
      {selectedOrder && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 24, padding: "clamp(24px, 4vw, 32px)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: 500, border: "1px solid #E2E8F0", animation: "modalFade 0.2s ease-out" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6", paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 20, color: "#1f2937", fontWeight: 800, margin: "0 0 4px" }}>{locale === "ar" ? "تفاصيل الطلب" : "Order Details"}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: "#f3f4f6", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4b5563" }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div style={{ background: "#f9fafb", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: "#6b7280" }}>{locale === "ar" ? "التاريخ:" : "Date:"}</span>
                <strong style={{ color: "#1f2937" }}>{selectedOrder.date}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "#6b7280" }}>{locale === "ar" ? "الحالة:" : "Status:"}</span>
                <strong style={{ color: selectedOrder.statusColor }}>{selectedOrder.status}</strong>
              </div>
            </div>

            <h4 style={{ fontSize: 16, fontWeight: 800, color: "#1f2937", marginBottom: 12 }}>{locale === "ar" ? "المنتجات" : "Items"}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24, maxHeight: 200, overflowY: "auto", paddingRight: isRTL ? 0 : 8, paddingLeft: isRTL ? 8 : 0 }}>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: "1px dashed #e5e7eb" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: 14, color: "#1f2937", marginBottom: 4 }}>{item.name}</strong>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>{locale === "ar" ? "الكمية: " : "Qty: "}{item.qty}</span>
                  </div>
                  <strong style={{ fontSize: 15, color: "#2E7D32" }}>{item.price} {locale === "ar" ? "ج.م" : "EGP"}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", padding: 16, borderRadius: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#166534" }}>{locale === "ar" ? "الإجمالي الكلي" : "Grand Total"}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#166534" }}>{selectedOrder.total} {locale === "ar" ? "ج.م" : "EGP"}</span>
            </div>

          </div>
        </div>
      )}

      {/* ==================== LOGOUT MODAL ==================== */}
      {showLogoutModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 24, padding: "32px 24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: 400, border: "1px solid #E2E8F0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", animation: "modalFade 0.2s ease-out" }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#FEF2F2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#EF4444" }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
            </div>
            <h3 style={{ fontSize: 22, color: "#1f2937", fontWeight: 800, margin: "0 0 12px" }}>
              {locale === "ar" ? "تسجيل الخروج" : "Sign Out"}
            </h3>
            <p style={{ color: "#64748b", fontSize: 15, margin: "0 0 28px", lineHeight: 1.6 }}>
              {locale === "ar" ? "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟" : "Are you sure you want to sign out of your account?"}
            </p>
            <div style={{ display: "flex", gap: 12, width: "100%" }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#374151", fontWeight: 700, backgroundColor: "#F3F4F6", border: "none", cursor: "pointer", transition: "all 0.2s" }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#E5E7EB"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#F3F4F6"; }}>
                {locale === "ar" ? "تراجع" : "Cancel"}
              </button>
              <button onClick={confirmLogout} disabled={isLoggingOut} style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#ffffff", fontWeight: 700, backgroundColor: "#DC2626", border: "none", cursor: "pointer", transition: "all 0.2s", display: "flex", justifyContent: "center", alignItems: "center" }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#B91C1C"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#DC2626"; }}>
                {isLoggingOut ? (
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" /></svg>
                ) : (
                  locale === "ar" ? "نعم، متأكد" : "Yes, Sign Out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================== EDIT ADDRESS MODAL ==================== */}
      {isEditingAddress && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 24, padding: "clamp(24px, 4vw, 32px)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: 500, animation: "modalFade 0.2s ease-out" }}>
            <h3 style={{ fontSize: 20, color: "#1f2937", fontWeight: 800, marginBottom: 16 }}>{locale === "ar" ? "تعديل العنوان" : "Edit Address"}</h3>
            <textarea 
              value={tempAddress}
              onChange={(e) => setTempAddress(e.target.value)}
              style={{ width: "100%", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", minHeight: 100, fontSize: 15, color: "#374151", marginBottom: 24, outline: "none" }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsEditingAddress(false)} style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#374151", fontWeight: 700, backgroundColor: "#F3F4F6", border: "none", cursor: "pointer" }}>{locale === "ar" ? "إلغاء" : "Cancel"}</button>
              <button 
                onClick={() => { setAddress(tempAddress); setIsEditingAddress(false); }} 
                style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#fff", fontWeight: 700, backgroundColor: "#2E7D32", border: "none", cursor: "pointer" }}
              >{locale === "ar" ? "حفظ" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT PAYMENT MODAL ==================== */}
      {isEditingPayment && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 24, padding: "clamp(24px, 4vw, 32px)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: 400, animation: "modalFade 0.2s ease-out" }}>
            <h3 style={{ fontSize: 20, color: "#1f2937", fontWeight: 800, marginBottom: 16 }}>{locale === "ar" ? "تعديل بيانات البطاقة" : "Edit Card Details"}</h3>
            <input 
              value={tempPayment}
              onChange={(e) => setTempPayment(e.target.value)}
              placeholder={locale === "ar" ? "رقم البطاقة" : "Card Number"}
              style={{ width: "100%", padding: 16, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 15, color: "#374151", marginBottom: 24, outline: "none", textAlign: isRTL ? "right" : "left", direction: "ltr" }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setIsEditingPayment(false)} style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#374151", fontWeight: 700, backgroundColor: "#F3F4F6", border: "none", cursor: "pointer" }}>{locale === "ar" ? "إلغاء" : "Cancel"}</button>
              <button 
                onClick={() => { setCardNumber(tempPayment || "•••• •••• •••• 1234"); setIsEditingPayment(false); }} 
                style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#fff", fontWeight: 700, backgroundColor: "#2E7D32", border: "none", cursor: "pointer" }}
              >{locale === "ar" ? "حفظ" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CHANGE PASSWORD MODAL ==================== */}
      {showPasswordModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: 24, padding: "clamp(24px, 4vw, 32px)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", width: "100%", maxWidth: 450, animation: "modalFade 0.2s ease-out" }}>
            <h3 style={{ fontSize: 20, color: "#1f2937", fontWeight: 800, marginBottom: 24 }}>{locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}</h3>
            
            {passwordSuccess ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ width: 64, height: 64, background: "#dcfce7", color: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 style={{ fontSize: 18, color: "#1f2937", margin: "0 0 8px" }}>{locale === "ar" ? "تم بنجاح!" : "Success!"}</h4>
                <p style={{ color: "#6b7280", marginBottom: 24 }}>{locale === "ar" ? "تم تغيير كلمة المرور وحفظها محلياً." : "Password has been successfully changed."}</p>
                <button onClick={() => setShowPasswordModal(false)} style={{ width: "100%", padding: "14px", borderRadius: 12, color: "#fff", fontWeight: 700, backgroundColor: "#2E7D32", border: "none", cursor: "pointer" }}>{locale === "ar" ? "إغلاق" : "Close"}</button>
              </div>
            ) : (
              // Form
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#4b5563", marginBottom: 8 }}>{locale === "ar" ? "كلمة المرور الحالية" : "Current Password"}</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#4b5563", marginBottom: 8 }}>{locale === "ar" ? "كلمة المرور الجديدة" : "New Password"}</label>
                  <input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#4b5563", marginBottom: 8 }}>{locale === "ar" ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setShowPasswordModal(false)} style={{ flex: 1, padding: "14px", borderRadius: 12, color: "#374151", fontWeight: 700, backgroundColor: "#F3F4F6", border: "none", cursor: "pointer" }}>{locale === "ar" ? "إلغاء" : "Cancel"}</button>
                  <button 
                    onClick={async () => {
                      if (!passwords.current || !passwords.new || !passwords.confirm) {
                        toast.error(locale === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
                        return;
                      }
                      if (passwords.new !== passwords.confirm) {
                        toast.error(locale === "ar" ? "كلمة المرور غير متطابقة" : "Passwords do not match");
                        return;
                      }
                      
                      setPasswordLoading(true);
                      try {
                        const res = await authService.updatePassword({
                          current_password: passwords.current,
                          password: passwords.new,
                          password_confirmation: passwords.confirm
                        });
                        
                        if (res.success) {
                          setPasswordSuccess(true);
                          toast.success(locale === "ar" ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully");
                        } else {
                          toast.error(res.message || (locale === "ar" ? "فشل تغيير كلمة المرور" : "Failed to change password"));
                        }
                      } catch (err) {
                        console.error("Password update error:", err);
                        toast.error(locale === "ar" ? "حدث خطأ أثناء الاتصال بالخادم" : "Error connecting to server");
                      } finally {
                        setPasswordLoading(false);
                      }
                    }} 
                    disabled={passwordLoading}
                    style={{ 
                      flex: 1, 
                      padding: "14px", 
                      borderRadius: 12, 
                      color: "#fff", 
                      fontWeight: 700, 
                      backgroundColor: passwordLoading ? "#94A3B8" : "#0284c7", 
                      border: "none", 
                      cursor: passwordLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {passwordLoading ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" /><path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" /></svg>
                    ) : (
                      locale === "ar" ? "حفظ التغييرات" : "Save Changes"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
