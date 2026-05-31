import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png";
import authBg from "../assets/auth-bg.png";
import { ContactFormSkeleton } from "../components/Skeleton";

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
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        /* Animations */
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

        /* Responsive Layout Classes */
        .contact-page-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: calc(100vh - 200px);
        }

        .contact-card {
          display: grid;
          grid-template-columns: 1fr;
          border-radius: 24px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05);
          width: 100%;
        }

        .contact-form-side {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 32px 24px;
          order: 2;
        }

        .contact-image-side {
          display: none;
          position: relative;
          overflow: hidden;
          min-height: 400px;
          order: 1;
        }

        .contact-input-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        /* Tablet and Desktop Responsiveness */
        @media (min-width: 768px) {
          .contact-page-wrapper {
            padding: 60px 32px;
          }
          .contact-form-side {
            padding: 40px 32px;
          }
          .contact-input-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .contact-card {
            grid-template-columns: 1fr 1fr;
            min-height: 600px;
          }
          .contact-form-side {
            padding: 48px 56px;
            order: 1;
          }
          .contact-image-side {
            display: flex;
            order: 2;
            min-height: 100%;
          }
        }

        /* Utilities */
        .auth-slide-up { animation: authSlideUp 0.7s ease-out forwards; }
        .auth-fade-in { animation: authFadeIn 0.8s ease-out forwards; }
        .auth-float { animation: authFloat 6s ease-in-out infinite; }
        .auth-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        /* Form Elements */
        .auth-input-group {
          position: relative;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }
        .auth-input-group.focused {
          transform: translateY(-2px);
        }
        .auth-input-border {
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 14px;
          border: 1.5px solid #E2E8F0;
          background: #F9FAFB;
          transition: all 0.3s ease;
        }
        .auth-input-border.single-line {
          height: 50px;
          padding: 0 16px;
        }
        .auth-input-border.multi-line {
          padding: 12px 16px;
        }
        .auth-input-group.focused .auth-input-border {
          border-color: #2E7D32;
          box-shadow: 0 0 0 3px rgba(46,125,50,0.1);
        }
        .auth-input-icon {
          color: #9CA3AF;
          display: flex;
          transition: color 0.3s ease;
        }
        .auth-input-group.focused .auth-input-icon {
          color: #2E7D32;
        }
        .auth-submit-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          width: 100%;
          height: 52px;
          border-radius: 14px;
          border: none;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .auth-submit-btn.idle {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
        }
        .auth-submit-btn.loading {
          background: linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%);
          cursor: not-allowed;
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
        
        .contact-title {
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .contact-desc {
          font-size: clamp(14px, 2vw, 15px);
          color: #6B7280;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .input-field {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #1a1a1a;
          width: 100%;
        }
      `}</style>

      <div className="contact-page-wrapper">
        <div className="contact-card auth-slide-up">
          
          {/* === Form Side === */}
          <div className="contact-form-side">
            {isPageLoading ? (
              <ContactFormSkeleton />
            ) : (
              <>
                <h1 className="contact-title" style={{ textAlign: isRTL ? "right" : "left" }}>
                  {isRTL ? "تواصل معنا" : "Contact Us"}
                </h1>
                <p className="contact-desc" style={{ textAlign: isRTL ? "right" : "left" }}>
                  {isRTL
                    ? "نحن هنا لمساعدتك والإجابة على أي استفسارات تخص منتجاتنا وخدماتنا."
                    : "We are here to assist you and answer any questions about our products and services."}
                </p>

            {/* Error Message */}
            {status === "error" && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13, fontWeight: 500, marginBottom: 20, textAlign: isRTL ? "right" : "left" }}>
                {isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields"}
              </div>
            )}

            {/* Success Message */}
            {status === "success" && (
              <div style={{ padding: "14px 16px", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", fontSize: 14, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{isRTL ? "تم إرسال رسالتك بنجاح! سنرد عليك قريباً." : "Message sent successfully! We will get back to you soon."}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="contact-input-row">
                {/* Name */}
                <div className={`auth-input-group ${focusedField === "name" ? "focused" : ""}`}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, textAlign: isRTL ? "right" : "left" }}>
                    {isRTL ? "الاسم كامل" : "Full Name"}
                  </label>
                  <div className="auth-input-border single-line">
                    <span className="auth-input-icon"><UserIcon /></span>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      onFocus={() => setFocusedField("name")} 
                      onBlur={() => setFocusedField(null)} 
                      placeholder={isRTL ? "أدخل اسمك" : "Enter your name"} 
                      className="input-field" 
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className={`auth-input-group ${focusedField === "phone" ? "focused" : ""}`}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, textAlign: isRTL ? "right" : "left" }}>
                    {isRTL ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <div className="auth-input-border single-line">
                    <span className="auth-input-icon"><PhoneIcon /></span>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      onFocus={() => setFocusedField("phone")} 
                      onBlur={() => setFocusedField(null)} 
                      placeholder={isRTL ? "أدخل رقم هاتفك" : "Enter phone number"} 
                      className="input-field" 
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className={`auth-input-group ${focusedField === "email" ? "focused" : ""}`}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, textAlign: isRTL ? "right" : "left" }}>
                  {isRTL ? "البريد الإلكتروني" : "Email Address"} <span style={{color: "#DC2626"}}>*</span>
                </label>
                <div className="auth-input-border single-line">
                  <span className="auth-input-icon"><MailIcon /></span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    onFocus={() => setFocusedField("email")} 
                    onBlur={() => setFocusedField(null)} 
                    placeholder={isRTL ? "أدخل بريدك الإلكتروني" : "Enter your email address"} 
                    className="input-field" 
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Message */}
              <div className={`auth-input-group ${focusedField === "message" ? "focused" : ""}`}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, textAlign: isRTL ? "right" : "left" }}>
                  {isRTL ? "رسالتك" : "Message"} <span style={{color: "#DC2626"}}>*</span>
                </label>
                <div className="auth-input-border multi-line">
                  <span className="auth-input-icon" style={{ marginTop: 2 }}><MessageIcon /></span>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onFocus={() => setFocusedField("message")} 
                    onBlur={() => setFocusedField(null)} 
                    placeholder={isRTL ? "كيف يمكننا مساعدتك؟" : "How can we help you?"} 
                    className="input-field" 
                    style={{ minHeight: 100, resize: "vertical" }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className={`auth-submit-btn ${status === "loading" ? "loading" : "idle"}`}
                disabled={status === "loading"}
              >
                {status === "loading" && (
                  <span style={{ width: 20, height: 20, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                )}
                {status === "loading" ? (isRTL ? "جاري الإرسال..." : "Sending...") : (isRTL ? "إرسال الرسالة" : "Send Message")}
              </button>
            </form>
            </>
          )}
          </div>

          {/* === Image Side === */}
          <div className="contact-image-side auth-fade-in">
            <img
              src={authBg}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(14,53,20,0.85) 0%, rgba(46,125,50,0.7) 50%, rgba(20,83,45,0.85) 100%)" }} />
            
            <div
              style={{
                position: "absolute",
                top: 0, bottom: 0, width: 120,
                ...(isRTL
                  ? { left: -1, background: "linear-gradient(to right, #fff 0%, #fff 50%, transparent 100%)", clipPath: "polygon(0 0, 100% 8%, 60% 100%, 0% 100%)" }
                  : { right: -1, background: "linear-gradient(to left, #fff 0%, #fff 50%, transparent 100%)", clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 92%)" }),
              }}
            />
            
            <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px 40px", textAlign: "center", width: "100%" }}>
              <div className="auth-float" style={{ width: 100, height: 100, borderRadius: 24, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
                <img src={logo} alt="WashAlafas" style={{ width: 70, height: 70, objectFit: "contain" }} />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12, lineHeight: 1.3 }}>
                {isRTL ? "دائماً بالقرب منك!" : "Always Near You!"}
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.8, maxWidth: 340 }}>
                {isRTL
                  ? "نستقبل رسائلكم وملاحظاتكم بصدر رحب لتطوير خدماتنا للوصول لتجربة مستخدم أفضل"
                  : "We welcome your messages and feedback to improve our services and reach a better user experience"}
              </p>
              
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 280, textAlign: isRTL ? "right" : "left" }}>
                <a href="tel:+201115313444" style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: 12, textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
                  <span style={{ color: "#fff", display: "flex" }}><PhoneIcon /></span>
                  <span style={{ color: "#fff", fontSize: 14 }} dir="ltr">+201115313444</span>
                </a>
                <a href="mailto:info@washalafas.com" style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: 12, textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
                  <span style={{ color: "#fff", display: "flex" }}><MailIcon /></span>
                  <span style={{ color: "#fff", fontSize: 14 }}>info@washalafas.com</span>
                </a>
              </div>

              <div className="auth-shimmer" style={{ position: "absolute", inset: 0, zIndex: -1 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
