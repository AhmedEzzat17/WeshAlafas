import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
// import logo from "../assets/logo.png";

const FarmerIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20l-4 2v-6l4 2 10-5 4 2v6l-4-2z" />
    <path d="M7 16l4-2" />
    <path d="M17 11l-4 2" />
    <path d="M12 2v3" />
    <path d="M12 7v1" />
    <path d="M12 10v1" />
  </svg>
);

const TraderIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const EntityIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M3 7v14" />
    <path d="M21 7v14" />
    <path d="M3 7l9-4 9 4" />
    <path d="M9 21V11h6v10" />
  </svg>
);

export default function AccountTypePage() {
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";

  const accountTypes = [
    {
      id: "farmer",
      titleEn: "Farmer",
      titleAr: "مزارع",
      descEn: "Join as a producer and showcase your fresh crops.",
      descAr: "انضم كمنتج واعرض محاصيلك الطازجة مباشرة للمشترين.",
      icon: <FarmerIcon />,
      color: "#2E7D32",
      bg: "#F0FFF4",
    },
    {
      id: "trader",
      titleEn: "Trader",
      titleAr: "تاجر",
      descEn: "Find the best deals and source directly from farms.",
      descAr: "احصل على أفضل الصفقات والمنتجات مباشرة من المزارع.",
      icon: <TraderIcon />,
      color: "#1976D2",
      bg: "#E3F2FD",
    },
    {
      id: "entity",
      titleEn: "Entity / Establishment",
      titleAr: "منشأة / شركة",
      descEn: "Register your business for bulk orders and partnerships.",
      descAr: "سجل منشأتك للطلبات الكبيرة والشراكات التجارية الواسعة.",
      icon: <EntityIcon />,
      color: "#7B1FA2",
      bg: "#F3E5F5",
    },
  ];

  const handleSelect = (typeId) => {
    navigate(`/register?type=${typeId}`);
  };

  return (
    <section dir={isRTL ? "rtl" : "ltr"} style={{ minHeight: "100vh", backgroundColor: "#f8fafc", paddingTop: 10, paddingBottom: 60 }}>
      <style>{`
        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .account-type-card {
          animation: cardPop 0.5s ease-out forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .account-type-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }
        .type-icon-box {
          transition: transform 0.4s ease;
        }
        .account-type-card:hover .type-icon-box {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          {/* <img src={logo} alt="Logo" style={{ width: 80, height: 80, marginBottom: 20 }} /> */}
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, color: "#1a1a1a", marginBottom: 12 }}>
            {isRTL ? "اختر نوع الحساب" : "Choose Your Account Type"}
          </h1>
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)", color: "#64748b", maxWidth: 600, margin: "0 auto" }}>
            {isRTL 
              ? "اختر الفئة التي تنتمي إليها لنقدم لك التجربة الأنسب لاحتياجاتك" 
              : "Select the category that suits you best to provide the most relevant experience for your needs"}
          </p>
        </div>

        {/* Categories Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: 24 
        }}>
          {accountTypes.map((type, idx) => (
            <div
              key={type.id}
              className="account-type-card"
              onClick={() => handleSelect(type.id)}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: "40px 32px",
                textAlign: "center",
                border: "2px solid transparent",
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                animationDelay: `${idx * 0.15}s`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <div
                className="type-icon-box"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: type.bg,
                  color: type.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  boxShadow: `0 10px 20px ${type.color}15`
                }}
              >
                {type.icon}
              </div>

              <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
                {isRTL ? type.titleAr : type.titleEn}
              </h3>
              
              <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 30, flexGrow: 1 }}>
                {isRTL ? type.descAr : type.descEn}
              </p>

              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  backgroundColor: type.color,
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
              >
                {isRTL ? "متابعة" : "Continue"}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            {isRTL ? "لديك حساب بالفعل؟ " : "Already have an account? "}
            <Link to="/login" style={{ color: "#2E7D32", fontWeight: 700, textDecoration: "none" }}>
              {isRTL ? "تسجيل الدخول" : "Sign In"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
