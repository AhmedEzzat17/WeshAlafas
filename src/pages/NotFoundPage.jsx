import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function NotFoundPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        minHeight: "calc(100vh - 180px)", // Account for navbar/footer
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #f8faf8 0%, #e8f0e8 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(46,125,50,0.2)); }
          50% { filter: drop-shadow(0 0 35px rgba(46,125,50,0.5)); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .error-float { animation: float 6s ease-in-out infinite; }
        .error-glow { animation: pulseGlow 4s ease-in-out infinite; }
        .error-sway { animation: sway 4s ease-in-out infinite; display: inline-block; transform-origin: top center; }
        
        .decor-circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(46,125,50,0.08) 0%, rgba(129,199,132,0.03) 100%);
          z-index: 0;
        }
      `}</style>

      {/* Decorative background elements */}
      <div className="decor-circle" style={{ width: 500, height: 500, top: -150, left: -150 }} />
      <div className="decor-circle" style={{ width: 350, height: 350, bottom: -100, right: -100 }} />

      <div
        className="error-float"
        style={{
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          padding: "60px 40px",
          borderRadius: 32,
          boxShadow: "0 25px 50px rgba(0,0,0,0.08), 0 4px 15px rgba(46,125,50,0.05)",
          maxWidth: 540,
          width: "100%",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.6)"
        }}
      >
        {/* Animated Custom SVG Icon */}
        <div 
          className="error-glow" 
          style={{ 
            position: "relative", 
            marginBottom: 35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
            {/* Background Blob */}
            <path opacity="0.1" d="M100 180 C30 180 20 140 20 100 C20 50 60 20 100 20 C140 20 180 50 180 100 C180 150 170 180 100 180 Z" fill="#2E7D32" />
            <path opacity="0.15" d="M100 160 C55 160 40 125 40 100 C40 70 65 40 100 40 C135 40 160 65 160 100 C160 135 145 160 100 160 Z" fill="#2E7D32" />
            
            {/* Paper Document */}
            <g transform="translate(60, 45)">
              <rect x="0" y="0" width="80" height="100" rx="10" fill="#ffffff" stroke="#2E7D32" strokeWidth="8" />
              <path d="M20 30 L60 30" stroke="#2E7D32" strokeWidth="7" strokeLinecap="round" />
              <path d="M20 55 L60 55" stroke="#2E7D32" strokeWidth="7" strokeLinecap="round" />
              <path d="M20 80 L40 80" stroke="#81C784" strokeWidth="7" strokeLinecap="round" />
            </g>

            {/* Error badge */}
            <circle cx="160" cy="50" r="22" fill="#FEF2F2" stroke="#EF4444" strokeWidth="4" />
            <path d="M152 42 L168 58 M168 42 L152 58" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />

            {/* Magnifying Glass with sway animation */}
            <g className="error-sway" transform="translate(100, 100)">
              <g transform="translate(-100, -100)">
                <circle cx="95" cy="115" r="30" fill="#f8faf8" stroke="#1B5E20" strokeWidth="7" />
                <path d="M115 135 L145 165" stroke="#1B5E20" strokeWidth="10" strokeLinecap="round" />
                {/* 404 text inside glass */}
                <text x="95" y="125" fontFamily="sans-serif" fontSize="24" fontWeight="900" fill="#14532D" textAnchor="middle">404</text>
              </g>
            </g>
          </svg>
        </div>

        <h1 
          className="font-extrabold text-gray-800"
          style={{ 
            fontSize: "clamp(26px, 5vw, 42px)", 
            marginBottom: 16,
            lineHeight: 1.2,
            letterSpacing: "-0.5px"
          }}
        >
          {locale === "ar" ? "404 - الصفحة غير موجودة" : "404 - Page Not Found"}
        </h1>

        <p 
          className="text-gray-500 font-medium"
          style={{ 
            fontSize: 16, 
            marginBottom: 36,
            lineHeight: 1.7,
            maxWidth: 380,
            margin: "0 auto 36px"
          }}
        >
          {locale === "ar" 
            ? "عذراً، يبدو أن الصفحة التي تحاول الوصول إليها غير متوفرة حالياً، أو تم تعديل رابطها." 
            : "Sorry, it seems the page you are trying to reach is currently unavailable or has been moved."}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <Link
            to="/"
            className="inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
            style={{
              background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 36px",
              borderRadius: 14,
              textDecoration: "none",
              gap: 12
            }}
          >
            {isRTL ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            )}
            {locale === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Link>
          
          <Link
            to="/products"
            className="inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              color: "#374151",
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 32px",
              borderRadius: 14,
              textDecoration: "none",
              gap: 10
            }}
          >
            {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
          </Link>
        </div>
      </div>
    </section>
  );
}
