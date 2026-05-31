import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import authBg from "../assets/auth-bg.png";
import toast from "react-hot-toast";

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.143-5.12-3.439-6.264-6.264l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const TagIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.5 1.5 0 002.122 0l4.318-4.318a1.5 1.5 0 000-2.122L11.16 3.659A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.053.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

export default function CompleteProfilePage() {
  const { direction, locale } = useLanguage();
  const { registerWithSocial, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRTL = direction === "rtl";

  // Retrieve state passed from social login flow
  const { provider, accessToken, socialDetails } = location.state || {};

  // If no social metadata exists (e.g. direct access), redirect to login
  useEffect(() => {
    if (!provider || !accessToken || !socialDetails) {
      toast.error(isRTL ? "يرجى تسجيل الدخول بواسطة جوجل أو فيسبوك أولاً" : "Please log in using Google or Facebook first.");
      navigate("/login");
    }
  }, [provider, accessToken, socialDetails, navigate, isRTL]);

  const [formData, setFormData] = useState({
    name: socialDetails?.name || "",
    phone: "",
    account_type: "FARMER",
    business_name: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  if (!provider || !accessToken || !socialDetails) {
    return null; // Will trigger redirect in useEffect
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError(isRTL ? "يرجى إدخال الاسم بالكامل" : "Please enter your full name");
      return;
    }
    if (!formData.phone.trim()) {
      setError(isRTL ? "يرجى إدخال رقم الهاتف" : "Please enter your phone number");
      return;
    }
    if (!formData.business_name.trim()) {
      setError(isRTL ? "يرجى إدخال اسم المنشأة / المزرعة" : "Please enter your business/farm name");
      return;
    }

    const payload = {
      provider,
      access_token: accessToken,
      name: formData.name,
      phone: formData.phone,
      account_type: formData.account_type,
      business_name: formData.business_name,
    };

    const result = await registerWithSocial(payload);
    if (result.success) {
      toast.success(isRTL ? "تم إنشاء الحساب وإكمال الملف الشخصي بنجاح!" : "Account created and profile completed successfully!");
      const userRole = result.user?.role?.toUpperCase();
      if (userRole === "ADMIN" || userRole === "FARMER") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      const msg = result.error || (isRTL ? "حدث خطأ أثناء حفظ البيانات" : "An error occurred while saving your details.");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "calc(100vh - 180px)" }}>
      <style>{`
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes authFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes authFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .auth-slide-up { animation: authSlideUp 0.7s ease-out forwards; }
        .auth-fade-in { animation: authFadeIn 0.8s ease-out forwards; }
        .auth-float { animation: authFloat 6s ease-in-out infinite; }
        .auth-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        .auth-input-group {
          position: relative;
          transition: all 0.3s ease;
        }
        .auth-input-group.focused {
          transform: translateY(-2px);
        }
        .auth-input-group.focused .auth-input-border {
          border-color: #2E7D32;
          box-shadow: 0 0 0 3px rgba(46,125,50,0.1);
        }
        .auth-input-group .auth-input-icon {
          transition: color 0.3s ease;
        }
        .auth-input-group.focused .auth-input-icon {
          color: #2E7D32;
        }
        .auth-submit-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .auth-submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .auth-submit-btn:hover::before {
          left: 100%;
        }
        .auth-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(46,125,50,0.4);
        }
        .auth-submit-btn:active {
          transform: translateY(0);
        }
        .profile-avatar-preview {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #2E7D32;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
      `}</style>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 200px)",
        }}
      >
        <div
          className="auth-slide-up"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            borderRadius: 24,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
            minHeight: 500,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
            }}
            className="lg:!grid-cols-2"
          >
            {/* === Image Side === */}
            <div
              className="hidden lg:flex auth-fade-in"
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: 580,
                order: 2,
              }}
            >
              <img
                src={authBg}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(14,53,20,0.85) 0%, rgba(46,125,50,0.7) 50%, rgba(20,83,45,0.85) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 120,
                  ...(isRTL
                    ? { right: -1, background: "linear-gradient(to left, #fff 0%, #fff 50%, transparent 100%)", clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 92%)" }
                    : { left: -1, background: "linear-gradient(to right, #fff 0%, #fff 50%, transparent 100%)", clipPath: "polygon(0 0, 100% 8%, 60% 100%, 0% 100%)" }),
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "48px 40px",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <div
                  className="auth-float"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 24,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 28,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                >
                  <img
                    src={logo}
                    alt="WashAlafas"
                    style={{ width: 70, height: 70, objectFit: "contain" }}
                  />
                </div>
                <h2
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 12,
                    lineHeight: 1.3,
                  }}
                >
                  {isRTL ? "إكمال الملف الشخصي" : "Complete Profile"}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.8,
                    maxWidth: 340,
                  }}
                >
                  {isRTL
                    ? "أكمل تفاصيل حسابك لبدء استخدام المنصة والتواصل مع المزارعين والتجار بشكل مباشر"
                    : "Complete your details to start using the platform and connect directly with farmers and traders"}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: i === 1 ? 32 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === 1 ? "#81C784" : "rgba(255,255,255,0.3)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="auth-shimmer" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
            </div>

            {/* === Form Side === */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "32px 32px",
                order: 1,
              }}
              className="auth-slide-up"
            >
              {/* Mobile Logo */}
              <div
                className="lg:hidden"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(46,125,50,0.25)",
                  }}
                >
                  <img
                    src={logo}
                    alt="WashAlafas"
                    style={{ width: 44, height: 44, objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* Verified Profile Avatar Header */}
              {socialDetails?.avatar && (
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, background: "#f0fdf4", padding: 12, borderRadius: 16, border: "1px solid #dcfce7" }}>
                  <img src={socialDetails.avatar} alt="Avatar" className="profile-avatar-preview" />
                  <div>
                    <h4 style={{ margin: "0 0 2px", fontWeight: 700, color: "#1f2937", fontSize: 15 }}>
                      {socialDetails.name}
                    </h4>
                    <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {isRTL ? "تم التحقق من الحساب الاجتماعي" : "Social account verified"}
                    </span>
                  </div>
                </div>
              )}

              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 6,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {isRTL ? "إكمال الحساب" : "Complete Profile"}
              </h1>
              <p
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginBottom: 24,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 1.5,
                }}
              >
                {isRTL
                  ? "خطوة أخيرة لتأمين حسابك وبدء الاستمتاع بجميع الميزات"
                  : "One final step to secure your account and start enjoying all features"}
              </p>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    color: "#DC2626",
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 18,
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div
                  className={`auth-input-group ${focusedField === "name" ? "focused" : ""}`}
                  style={{ marginBottom: 16 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 6,
                    }}
                  >
                    {isRTL ? "الاسم بالكامل" : "Full Name"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: 48,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 16px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isRTL ? "الاسم الكامل الخاص بك" : "Your full name"}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: "#1a1a1a",
                      }}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div
                  className={`auth-input-group ${focusedField === "phone" ? "focused" : ""}`}
                  style={{ marginBottom: 16 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 6,
                    }}
                  >
                    {isRTL ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: 48,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 16px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <PhoneIcon />
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isRTL ? "أدخل رقم الهاتف (مثال: 01012345678)" : "Phone number (e.g. 01012345678)"}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: "#1a1a1a",
                      }}
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div
                  className={`auth-input-group ${focusedField === "account_type" ? "focused" : ""}`}
                  style={{ marginBottom: 16 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 6,
                    }}
                  >
                    {isRTL ? "نوع الحساب" : "Account Type"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: 48,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 16px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <TagIcon />
                    </span>
                    <select
                      value={formData.account_type}
                      onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                      onFocus={() => setFocusedField("account_type")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: "#1a1a1a",
                        cursor: "pointer",
                        appearance: "none",
                        WebkitAppearance: "none",
                      }}
                    >
                      <option value="FARMER">{isRTL ? "مزارع (Farmer)" : "Farmer"}</option>
                      <option value="TRADER">{isRTL ? "تاجر (Trader)" : "Trader"}</option>
                      <option value="COMPANY">{isRTL ? "شركة (Company)" : "Company"}</option>
                    </select>
                  </div>
                </div>

                {/* Business Name */}
                <div
                  className={`auth-input-group ${focusedField === "business_name" ? "focused" : ""}`}
                  style={{ marginBottom: 24 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 6,
                    }}
                  >
                    {isRTL ? "اسم المنشأة أو المزرعة" : "Business or Farm Name"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: 48,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 16px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <BuildingIcon />
                    </span>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      onFocus={() => setFocusedField("business_name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isRTL ? "مثال: مزرعة الياسمين" : "e.g. Al-Yasmine Farm"}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: "#1a1a1a",
                      }}
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 50,
                    borderRadius: 14,
                    border: "none",
                    background: loading
                      ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                      : "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: 0.5,
                    opacity: loading ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  {loading && (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }}
                    />
                  )}
                  {loading
                    ? (isRTL ? "جاري حفظ البيانات..." : "Saving Details...")
                    : (isRTL ? "حفظ البيانات وإكمال التسجيل" : "Save & Complete Registration")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
