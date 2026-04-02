import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import authBg from "../assets/auth-bg.png";

/* ====== SVG Icons ====== */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export default function RegisterPage() {
  const { direction } = useLanguage();
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    account_type: "FARMER",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError(isRTL ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError(isRTL ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters");
      return;
    }

    const result = await register(formData);
    if (result.success) {
      if (result.user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError(result.error || (isRTL ? "حدث خطأ أثناء إنشاء الحساب" : "An error occurred during registration"));
    }
  };

  /* Password strength checker */
  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { level: 1, label: isRTL ? "ضعيفة" : "Weak", color: "#EF4444" };
    if (score <= 2) return { level: 2, label: isRTL ? "متوسطة" : "Fair", color: "#F59E0B" };
    if (score <= 3) return { level: 3, label: isRTL ? "جيدة" : "Good", color: "#3B82F6" };
    return { level: 4, label: isRTL ? "قوية" : "Strong", color: "#22C55E" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const features = isRTL
    ? ["منتجات طازجة يومياً", "أسعار تنافسية", "توصيل سريع"]
    : ["Fresh Products Daily", "Competitive Prices", "Fast Delivery"];

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
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
        @keyframes checkPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
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
        .auth-social-btn {
          transition: all 0.3s ease;
        }
        .auth-social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .auth-social-btn:active {
          transform: translateY(0);
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
        .feature-check {
          animation: checkPop 0.4s ease-out forwards;
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
          minHeight: "calc(100vh - 300px)",
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
            minHeight: 420,
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
                minHeight: 520,
                order: 2,
              }}
            >
              {/* Background Image */}
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
              {/* Gradient Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, rgba(14,53,20,0.88) 0%, rgba(46,125,50,0.72) 50%, rgba(20,83,45,0.88) 100%)",
                }}
              />
              {/* Diagonal Clip */}
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
              {/* Content */}
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
                {/* Floating Logo */}
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
                  {isRTL ? "انضم إلينا اليوم!" : "Join Us Today!"}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.8,
                    maxWidth: 340,
                    marginBottom: 32,
                  }}
                >
                  {isRTL
                    ? "أنشئ حسابك واحصل على أفضل المنتجات الطازجة بأسعار لا تُقاوم"
                    : "Create your account and get the best fresh products at irresistible prices"}
                </p>

                {/* Feature List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: isRTL ? "flex-end" : "flex-start" }}>
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="feature-check"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        animationDelay: `${i * 0.2 + 0.5}s`,
                        opacity: 0,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "rgba(129,199,132,0.25)",
                          border: "1px solid rgba(129,199,132,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#81C784",
                          flexShrink: 0,
                        }}
                      >
                        <CheckIcon />
                      </div>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative dots */}
                <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: i === 0 ? 32 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === 0 ? "#81C784" : "rgba(255,255,255,0.3)",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Shimmer overlay */}
              <div className="auth-shimmer" style={{ position: "absolute", inset: 0, zIndex: 1 }} />
            </div>

            {/* === Form Side === */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "24px 32px",
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
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    // background: "linear-gradient(135deg, #2E7D32 0%, #04ff69ff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(46,125,50,0.25)",
                  }}
                >
                  <img
                    src={logo}
                    alt="WashAlafas"
                    style={{ width: 48, height: 48, objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: 6,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {isRTL ? "إنشاء حساب" : "Create Account"}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginBottom: 24,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {isRTL
                  ? "سجّل الآن واستمتع بتجربة تسوق مميزة"
                  : "Register now and enjoy a unique shopping experience"}
              </p>

              {/* Social Login */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                <button
                  className="auth-social-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 46,
                    borderRadius: 14,
                    border: "1.5px solid #E2E8F0",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  <GoogleIcon />
                  Google
                </button>
                <button
                  className="auth-social-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 46,
                    borderRadius: 14,
                    border: "1.5px solid #1877F2",
                    background: "#1877F2",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  <FacebookIcon />
                  Facebook
                </button>
              </div>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                }}
              >
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {isRTL ? "أو سجّل بالبريد" : "or register with email"}
                </span>
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              </div>

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
                {/* Name & Phone - Two Columns */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 14,
                  }}
                  className="auth-name-phone-grid"
                >
                  {/* Full Name */}
                  <div className={`auth-input-group ${focusedField === "fullName" ? "focused" : ""}`}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      {isRTL ? "الاسم الكامل" : "Full Name"}
                    </label>
                    <div
                      className="auth-input-border"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        height: 48,
                        borderRadius: 14,
                        border: "1.5px solid #E2E8F0",
                        padding: "0 14px",
                        background: "#F9FAFB",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                        <UserIcon />
                      </span>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange("fullName")}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        placeholder={isRTL ? "الاسم الكامل" : "Your full name"}
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1a1a1a" }}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={`auth-input-group ${focusedField === "phone" ? "focused" : ""}`}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      {isRTL ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <div
                      className="auth-input-border"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        height: 48,
                        borderRadius: 14,
                        border: "1.5px solid #E2E8F0",
                        padding: "0 14px",
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
                        onChange={handleChange("phone")}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        placeholder={isRTL ? "رقم الهاتف" : "Phone number"}
                        dir="ltr"
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1a1a1a", textAlign: isRTL ? "right" : "left" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Account Type */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    {isRTL ? "نوع الحساب" : "Account Type"}
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, account_type: "FARMER" }))}
                      style={{
                        height: 48,
                        borderRadius: 14,
                        border: formData.account_type === "FARMER" ? "2px solid #2E7D32" : "1.5px solid #E2E8F0",
                        background: formData.account_type === "FARMER" ? "#F0FFF4" : "#F9FAFB",
                        color: formData.account_type === "FARMER" ? "#2E7D32" : "#6B7280",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      🌾 {isRTL ? "مزارع" : "Farmer"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, account_type: "TRADER" }))}
                      style={{
                        height: 48,
                        borderRadius: 14,
                        border: formData.account_type === "TRADER" ? "2px solid #2E7D32" : "1.5px solid #E2E8F0",
                        background: formData.account_type === "TRADER" ? "#F0FFF4" : "#F9FAFB",
                        color: formData.account_type === "TRADER" ? "#2E7D32" : "#6B7280",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      🛒 {isRTL ? "تاجر" : "Trader"}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div
                  className={`auth-input-group ${focusedField === "email" ? "focused" : ""}`}
                  style={{ marginBottom: 14 }}
                >
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                    {isRTL ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      height: 48,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 14px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
                      style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1a1a1a" }}
                    />
                  </div>
                </div>

                {/* Password & Confirm - Two Columns */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 6,
                  }}
                  className="auth-name-phone-grid"
                >
                  {/* Password */}
                  <div className={`auth-input-group ${focusedField === "password" ? "focused" : ""}`}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      {isRTL ? "كلمة المرور" : "Password"}
                    </label>
                    <div
                      className="auth-input-border"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        height: 48,
                        borderRadius: 14,
                        border: "1.5px solid #E2E8F0",
                        padding: "0 14px",
                        background: "#F9FAFB",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                        <LockIcon />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange("password")}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder={isRTL ? "كلمة المرور" : "Password"}
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1a1a1a" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#2E7D32")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className={`auth-input-group ${focusedField === "confirmPassword" ? "focused" : ""}`}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                      {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
                    </label>
                    <div
                      className="auth-input-border"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        height: 48,
                        borderRadius: 14,
                        border: "1.5px solid #E2E8F0",
                        padding: "0 14px",
                        background: "#F9FAFB",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                        <LockIcon />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder={isRTL ? "تأكيد كلمة المرور" : "Confirm password"}
                        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#1a1a1a" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: 0, transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#2E7D32")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div style={{ marginBottom: 16, marginTop: 8 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 2,
                            background: i <= passwordStrength.level ? passwordStrength.color : "#E5E7EB",
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}

                {/* Terms */}
                <div style={{ marginBottom: 20, marginTop: formData.password ? 0 : 14 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#6B7280",
                      lineHeight: 1.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#2E7D32",
                        cursor: "pointer",
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      {isRTL ? (
                        <>
                          أوافق على{" "}
                          <Link to="#" style={{ color: "#2E7D32", fontWeight: 600, textDecoration: "none" }}>
                            الشروط والأحكام
                          </Link>
                          {" "}و{" "}
                          <Link to="#" style={{ color: "#2E7D32", fontWeight: 600, textDecoration: "none" }}>
                            سياسة الخصوصية
                          </Link>
                        </>
                      ) : (
                        <>
                          I agree to the{" "}
                          <Link to="#" style={{ color: "#2E7D32", fontWeight: 600, textDecoration: "none" }}>
                            Terms & Conditions
                          </Link>
                          {" "}and{" "}
                          <Link to="#" style={{ color: "#2E7D32", fontWeight: 600, textDecoration: "none" }}>
                            Privacy Policy
                          </Link>
                        </>
                      )}
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 14,
                    border: "none",
                    background: (!agreeTerms || loading)
                      ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                      : "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: (agreeTerms && !loading) ? "pointer" : "not-allowed",
                    letterSpacing: 0.5,
                    opacity: (agreeTerms && !loading) ? 1 : 0.7,
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                  disabled={!agreeTerms || loading}
                >
                  {loading && (
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        border: "2.5px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                        display: "inline-block",
                      }}
                    />
                  )}
                  {loading
                    ? (isRTL ? "جاري إنشاء الحساب..." : "Creating Account...")
                    : (isRTL ? "إنشاء الحساب" : "Create Account")}
                </button>
              </form>

              {/* Login link */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 14,
                  color: "#6B7280",
                }}
              >
                {isRTL ? "لديك حساب بالفعل؟ " : "Already have an account? "}
                <Link
                  to="/login"
                  style={{
                    fontWeight: 700,
                    color: "#2E7D32",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14532D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2E7D32")}
                >
                  {isRTL ? "سجّل دخولك" : "Sign in"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles for two-column to single-column on small screens */}
      <style>{`
        @media (max-width: 640px) {
          .auth-name-phone-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
