import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo.png";
import authBg from "../assets/auth-bg.png";
import toast from "react-hot-toast";
import { loginWithGoogle, loginWithFacebook } from "../utils/socialAuth";

/* ====== SVG Icons ====== */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
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

export default function LoginPage() {
  const { direction } = useLanguage();
  const { login, loginWithSocial, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const isRTL = direction === "rtl";

  const handleGoogleLogin = () => {
    loginWithGoogle(
      async (accessToken) => {
        const result = await loginWithSocial("google", accessToken);
        handleSocialLoginResult("google", accessToken, result);
      },
      (error) => {
        console.error("Google Auth error:", error);
        toast.error(error?.message || (isRTL ? "فشل الاتصال بجوجل" : "Google connection failed"));
      }
    );
  };

  const handleFacebookLogin = () => {
    loginWithFacebook(
      async (accessToken) => {
        const result = await loginWithSocial("facebook", accessToken);
        handleSocialLoginResult("facebook", accessToken, result);
      },
      (error) => {
        console.error("Facebook Auth error:", error);
        toast.error(error?.message || (isRTL ? "فشل الاتصال بفيسبوك" : "Facebook connection failed"));
      }
    );
  };

  const handleSocialLoginResult = (provider, accessToken, result) => {
    if (result.success) {
      if (result.registrationCompleted) {
        toast.success(isRTL ? "تم تسجيل الدخول بنجاح!" : "Login successful!");
        const userRole = result.user?.role?.toUpperCase();
        if (redirect) {
          navigate(redirect);
        } else if (userRole === "ADMIN" || userRole === "FARMER") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        toast.success(isRTL ? "تم التحقق من الحساب. يرجى إكمال التسجيل." : "Account verified. Please complete your registration.");
        navigate("/complete-profile", {
          state: {
            provider,
            accessToken,
            socialDetails: result.socialDetails,
          },
        });
      }
    } else {
      const msg = result.error || (isRTL ? "فشل تسجيل الدخول الاجتماعي" : "Social login failed");
      toast.error(msg);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError(isRTL ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "Please enter email and password");
      return;
    }

    const result = await login({ email, password });
    if (result.success) {
      toast.success(isRTL ? "تم تسجيل الدخول بنجاح!" : "Login successful!");
      
      const userRole = result.user?.role?.toUpperCase();
      
      if (redirect) {
        navigate(redirect);
      } else if (userRole === "ADMIN" || userRole === "FARMER") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      const msg = result.error || (isRTL ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password");
      setError(msg);
      toast.error(msg);
    }
  };

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
                  background: "linear-gradient(135deg, rgba(14,53,20,0.85) 0%, rgba(46,125,50,0.7) 50%, rgba(20,83,45,0.85) 100%)",
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
                  {isRTL ? "مرحباً بعودتك!" : "Welcome Back!"}
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.8,
                    maxWidth: 340,
                  }}
                >
                  {isRTL
                    ? "سجّل دخولك واستمتع بأفضل المنتجات الطازجة بأسعار تنافسية مباشرة من المزارعين"
                    : "Sign in and enjoy the best fresh products at competitive prices directly from farmers"}
                </p>
                {/* Decorative dots */}
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
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    // background: "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)",
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
                {isRTL ? "تسجيل الدخول" : "Sign In"}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginBottom: 28,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {isRTL
                  ? "أدخل بياناتك للوصول إلى حسابك"
                  : "Enter your credentials to access your account"}
              </p>

              {/* Social Login */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="auth-social-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 48,
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
                  type="button"
                  onClick={handleFacebookLogin}
                  className="auth-social-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    height: 48,
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
                  marginBottom: 28,
                }}
              >
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                <span
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isRTL ? "أو تسجيل بالبريد" : "or continue with email"}
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
                {/* Email */}
                <div
                  className={`auth-input-group ${focusedField === "email" ? "focused" : ""}`}
                  style={{ marginBottom: 18 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    {isRTL ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: 50,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 16px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <MailIcon />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"}
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

                {/* Password */}
                <div
                  className={`auth-input-group ${focusedField === "password" ? "focused" : ""}`}
                  style={{ marginBottom: 16 }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    {isRTL ? "كلمة المرور" : "Password"}
                  </label>
                  <div
                    className="auth-input-border"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      height: 50,
                      borderRadius: 14,
                      border: "1.5px solid #E2E8F0",
                      padding: "0 16px",
                      background: "#F9FAFB",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}>
                      <LockIcon />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      placeholder={isRTL ? "أدخل كلمة المرور" : "Enter your password"}
                      style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        fontSize: 14,
                        color: "#1a1a1a",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#9CA3AF",
                        display: "flex",
                        padding: 0,
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#2E7D32")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#6B7280",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#2E7D32",
                        cursor: "pointer",
                      }}
                    />
                    {isRTL ? "تذكرني" : "Remember Me"}
                  </label>
                  <Link
                    to="#"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#2E7D32",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#14532D")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#2E7D32")}
                  >
                    {isRTL ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 14,
                    border: "none",
                    background: loading
                      ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)"
                      : "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                    color: "#fff",
                    fontSize: 16,
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
                    ? (isRTL ? "جاري تسجيل الدخول..." : "Signing In...")
                    : (isRTL ? "تسجيل الدخول" : "Sign In")}
                </button>
              </form>

              {/* Register link */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: 24,
                  fontSize: 14,
                  color: "#6B7280",
                }}
              >
                {isRTL ? "ليس لديك حساب؟ " : "Don't have an account? "}
                <Link
                  to="/account-type"
                  style={{
                    fontWeight: 700,
                    color: "#2E7D32",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#14532D")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#2E7D32")}
                >
                  {isRTL ? "أنشئ حساباً مجاناً" : "Create account for free"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
