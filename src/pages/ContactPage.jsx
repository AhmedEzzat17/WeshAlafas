import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png";
import authBg from "../assets/auth-bg.png";

/* ====== SVG Icons ====== */
const MailIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.436-4.136-7.032-7.032l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const MessageIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

export default function ContactPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
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
            {/* === Form Side === */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "32px 40px",
                order: 1,
              }}
              className="auth-slide-up"
            >
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
                {isRTL ? "تواصل معنا" : "Contact Us"}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  marginBottom: 28,
                  textAlign: isRTL ? "right" : "left",
                  lineHeight: 1.6,
                }}
              >
                {isRTL
                  ? "نحن هنا لمساعدتك والإجابة على أي استفسارات تخص منتجاتنا وخدماتنا."
                  : "We are here to assist you and answer any questions about our products and services."}
              </p>

              {/* Error Message */}
              {status === "error" && (
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
                  {isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields"}
                </div>
              )}

              {/* Success Message */}
              {status === "success" && (
                <div
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    color: "#166534",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 18,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isRTL ? "تم إرسال رسالتك بنجاح! سنرد عليك قريباً." : "Message sent successfully! We will get back to you soon."}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {/* Name */}
                  <div
                    className={`auth-input-group ${focusedField === "name" ? "focused" : ""}`}
                    style={{ marginBottom: 18 }}
                  >
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                      {isRTL ? "الاسم كامل" : "Full Name"}
                    </label>
                    <div className="auth-input-border" style={{ display: "flex", alignItems: "center", gap: 12, height: 50, borderRadius: 14, border: "1.5px solid #E2E8F0", padding: "0 16px", background: "#F9FAFB", transition: "all 0.3s ease" }}>
                      <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}><UserIcon /></span>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} placeholder={isRTL ? "أدخل اسمك" : "Enter your name"} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1a1a1a" }} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div
                    className={`auth-input-group ${focusedField === "phone" ? "focused" : ""}`}
                    style={{ marginBottom: 18 }}
                  >
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                      {isRTL ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <div className="auth-input-border" style={{ display: "flex", alignItems: "center", gap: 12, height: 50, borderRadius: 14, border: "1.5px solid #E2E8F0", padding: "0 16px", background: "#F9FAFB", transition: "all 0.3s ease" }}>
                      <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}><PhoneIcon /></span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} placeholder={isRTL ? "أدخل رقم هاتفك" : "Enter phone number"} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1a1a1a" }} />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div
                  className={`auth-input-group ${focusedField === "email" ? "focused" : ""}`}
                  style={{ marginBottom: 18 }}
                >
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    {isRTL ? "البريد الإلكتروني" : "Email Address"} <span style={{color: "#DC2626"}}>*</span>
                  </label>
                  <div className="auth-input-border" style={{ display: "flex", alignItems: "center", gap: 12, height: 50, borderRadius: 14, border: "1.5px solid #E2E8F0", padding: "0 16px", background: "#F9FAFB", transition: "all 0.3s ease" }}>
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex" }}><MailIcon /></span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1a1a1a" }} />
                  </div>
                </div>

                {/* Message */}
                <div
                  className={`auth-input-group ${focusedField === "message" ? "focused" : ""}`}
                  style={{ marginBottom: 26 }}
                >
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    {isRTL ? "رسالتك" : "Message"} <span style={{color: "#DC2626"}}>*</span>
                  </label>
                  <div className="auth-input-border" style={{ display: "flex", alignItems: "flex-start", gap: 12, borderRadius: 14, border: "1.5px solid #E2E8F0", padding: "12px 16px", background: "#F9FAFB", transition: "all 0.3s ease" }}>
                    <span className="auth-input-icon" style={{ color: "#9CA3AF", display: "flex", marginTop: 2 }}><MessageIcon /></span>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} placeholder={isRTL ? "كيف يمكننا مساعدتك؟" : "How can we help you?"} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#1a1a1a", minHeight: 100, resize: "vertical" }} />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="auth-submit-btn" disabled={status === "loading"} style={{ width: "100%", height: 52, borderRadius: 14, border: "none", background: status === "loading" ? "linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)" : "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer", letterSpacing: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {status === "loading" && (
                    <span style={{ width: 20, height: 20, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  )}
                  {status === "loading" ? (isRTL ? "جاري الإرسال..." : "Sending...") : (isRTL ? "إرسال الرسالة" : "Send Message")}
                </button>
              </form>
            </div>

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
                    ? { left: -1, background: "linear-gradient(to right, #fff 0%, #fff 50%, transparent 100%)", clipPath: "polygon(0 0, 100% 8%, 60% 100%, 0% 100%)" }
                    : { right: -1, background: "linear-gradient(to left, #fff 0%, #fff 50%, transparent 100%)", clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 92%)" }),
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
                  {isRTL ? "دائماً بالقرب منك!" : "Always Near You!"}
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
                    ? "نستقبل رسائلكم وملاحظاتكم بصدر رحب لتطوير خدماتنا للوصول لتجربة مستخدم أفضل"
                    : "We welcome your messages and feedback to improve our services and reach a better user experience"}
                </p>
                
                {/* Contact Direct Info */}
                <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 280, textAlign: isRTL ? "right" : "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: 12 }}>
                    <span style={{ color: "#fff", display: "flex" }}><PhoneIcon /></span>
                    <span style={{ color: "#fff", fontSize: 14 }}>+20 123 456 7890</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: 12 }}>
                    <span style={{ color: "#fff", display: "flex" }}><MailIcon /></span>
                    <span style={{ color: "#fff", fontSize: 14 }}>info@washalafas.com</span>
                  </div>
                </div>

                <div className="auth-shimmer" style={{ position: "absolute", inset: 0, zIndex: -1 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
