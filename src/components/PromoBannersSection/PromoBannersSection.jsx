import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";
import { useDashboardData } from "../../Dashboard/shared/DashboardDataContext";
import { useState, useEffect } from "react";

function parseBilingual(text, locale) {
  if (!text) return "";
  const arMatch = text.match(/\[ar:(.*?)\]/);
  const enMatch = text.match(/\[en:(.*?)\]/);
  
  if (!arMatch && !enMatch) {
    return text.trim();
  }
  
  if (locale === "en") {
    return enMatch ? enMatch[1].trim() : (arMatch ? arMatch[1].trim() : text.trim());
  }
  // Default to Arabic
  return arMatch ? arMatch[1].trim() : text.trim();
}

/* ── resolve one offer from API ─────────────────────────── */
const resolveOffer = (offer, locale = "ar") => {
  if (!offer) return null;
  const rawName = offer.name || offer.title || "";
  let rawDesc = offer.description || "";
  if (rawDesc.includes("#wide")) {
    rawDesc = rawDesc.replace("#wide", "").trim();
  }
  const name = parseBilingual(rawName, locale);
  const desc = parseBilingual(rawDesc, locale);
  const image = offer.image_url || offer.image || "";
  const link  = `/products?offer_id=${offer.id}`;
  const end_date = offer.end_date || offer.endDate || null;
  let discountEn = "", discountAr = "";
  if (offer.discount_value) {
    if (offer.discount_type === "PERCENTAGE") {
      discountEn = `${offer.discount_value}% OFF`;
      discountAr = `خصم ${offer.discount_value}%`;
    } else {
      discountEn = `${offer.discount_value} EGP OFF`;
      discountAr = `خصم ${offer.discount_value} ج.م`;
    }
  }
  return { name, desc, image, link, discountEn, discountAr, end_date };
};

/* ── Countdown Timer Component ───────────────────────────── */
const CountdownTimer = ({ endDateStr, isRTL, groupIndex = 0 }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // If no endDateStr from API, create a fake one: 48 hours for the first group, 24 for the second
    let fallbackHours = 48;
    if (groupIndex === 1) fallbackHours = 24;
    if (groupIndex > 1) fallbackHours = 12;

    const targetDate = endDateStr ? new Date(endDateStr) : new Date(Date.now() + fallbackHours * 60 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          total: difference
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDateStr, groupIndex]);

  if (!timeLeft) return null;

  // Less than 2 hours (2 * 60 * 60 * 1000)
  const isUrgent = timeLeft.total > 0 && timeLeft.total <= 2 * 60 * 60 * 1000;
  
  const color = isUrgent ? "#EF4444" : "#F97316"; // Red or Orange
  const bg = isUrgent ? "rgba(239, 68, 68, 0.15)" : "rgba(249, 115, 22, 0.15)";

  const formatNumber = (num) => num.toString().padStart(2, '0');

  const TimeBox = ({ value, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: bg, padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 14px)', borderRadius: '12px', minWidth: 'clamp(45px, 10vw, 60px)', border: `1px solid ${color}40` }}>
      <span style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: '900', color: color, lineHeight: '1' }}>{formatNumber(value)}</span>
      <span style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', fontWeight: 'bold', color: color, marginTop: '6px' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 1vw, 8px)', marginBottom: '32px', flexWrap: 'wrap' }}>
      {timeLeft.days > 0 && (
        <>
          <TimeBox value={timeLeft.days} label={isRTL ? "يوم" : "DAYS"} />
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: color, margin: '0 4px', paddingBottom: '16px' }}>:</span>
        </>
      )}
      <TimeBox value={timeLeft.hours} label={isRTL ? "ساعة" : "HRS"} />
      <span style={{ fontSize: '20px', fontWeight: 'bold', color: color, margin: '0 4px', paddingBottom: '16px' }}>:</span>
      <TimeBox value={timeLeft.minutes} label={isRTL ? "دقيقة" : "MIN"} />
      <span style={{ fontSize: '20px', fontWeight: 'bold', color: color, margin: '0 4px', paddingBottom: '16px' }}>:</span>
      <TimeBox value={timeLeft.seconds} label={isRTL ? "ثانية" : "SEC"} />
    </div>
  );
};

/* ── Unique placeholders for each SLOT in each GROUP ─────── */
const GROUPS = [
  {
    big: {
      badge: { ar: "عرض الأسبوع", en: "Offer of the Week" },
      title: { ar: "خصم 20% على المانجو الموسمية الطازجة", en: "20% Off Fresh Seasonal Mango" },
      desc:  { ar: "لفترة محدودة - حتى نفاذ الكمية", en: "For a limited time - while supplies last" },
    }
  },
  {
    big: {
      badge: { ar: "عروض حصرية", en: "EXCLUSIVE OFFERS" },
      title: { ar: "محاصيل طازجة مباشرة من المزارعين", en: "Farm-Fresh Crops Directly to You" },
      desc:  { ar: "اكتشف أجود المحاصيل الموسمية بأسعار تنافسية.", en: "Discover premium seasonal crops at competitive prices." },
    }
  },
  {
    big: {
      badge: { ar: "أسعار الجملة", en: "WHOLESALE PRICES" },
      title: { ar: "بذور وحبوب زراعية فاخرة", en: "Premium Seeds & Agricultural Grains" },
      desc:  { ar: "أجود أنواع البذور والحبوب للمزارعين وتجار الجملة.", en: "Finest seeds and grains for farmers and wholesalers." },
    }
  },
];

/* ── "Coming Soon" placeholder when no offer ── */
const ComingSoon = ({ isRTL }) => {
  return isRTL 
    ? { title: "عروض جديدة قريباً", sub: "نعمل على تجهيز عروض مميزة لك، ترقبنا!" }
    : { title: "New Offers Coming Soon", sub: "We are preparing special deals just for you, stay tuned!" };
};

/* ── Shimmer skeleton ────────────────────────────────────── */
const Skeleton = ({ height = 340 }) => (
  <div
    style={{
      width: "100%",
      height, borderRadius: "2rem",
      background: "linear-gradient(90deg,#e8e8e8 25%,#f5f5f5 50%,#e8e8e8 75%)",
      backgroundSize: "200% 100%",
      animation: "skeletonShimmer 1.6s infinite linear",
    }}
  />
);

/* ══ NEW SINGLE WIDE BANNER ═════════════════════════════ */
function WideBanner({ offer, isRTL, ph, groupIndex }) {
  const cs = !offer ? ComingSoon({ isRTL }) : null;

  const badgeText = offer
    ? (isRTL ? (offer.discountAr || ph.badge.ar) : (offer.discountEn || ph.badge.en))
    : (isRTL ? ph.badge.ar : ph.badge.en);

  const titleText = offer ? offer.name : (cs ? cs.title : (isRTL ? ph.title.ar : ph.title.en));
  const descText = offer?.desc ? offer.desc : (cs ? cs.sub : (isRTL ? ph.desc.ar : ph.desc.en));

  return (
    <div
      className="promo-card relative w-full rounded-[24px] overflow-hidden flex items-center"
      style={{
        background: "#326e36", // Solid base green color
        minHeight: "360px",
        boxShadow: "0 12px 32px rgba(46,125,50,0.15)",
      }}
    >
      {/* Abstract Background Shapes (Leaves & Blobs) */}
      <div style={{ position: "absolute", top: -60, right: isRTL ? "10%" : "auto", left: isRTL ? "auto" : "10%", width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", bottom: -100, right: isRTL ? "35%" : "auto", left: isRTL ? "auto" : "35%", width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none", zIndex: 1 }} />
      
      <svg width="120" height="120" viewBox="0 0 24 24" style={{ position: "absolute", top: "15%", right: isRTL ? "25%" : "auto", left: isRTL ? "auto" : "25%", opacity: 0.05, fill: "#fff", zIndex: 1, pointerEvents: "none", transform: isRTL ? "rotate(-15deg)" : "rotate(15deg)" }}>
        <path d="M17.6,3.4C13,2.5,8,4.5,5.2,8.6C2.3,12.6,2.6,18,6.2,21.6c0.4,0.4,1,0.4,1.4,0c0.4-0.4,0.4-1,0-1.4 c-2.8-2.8-3-7.2-0.6-10.4c2.2-3.2,6.2-4.8,10-4c3.8,0.8,6.6,3.6,7.4,7.4c0.8,3.8-0.8,7.8-4,10c-3.2,2.4-7.6,2.2-10.4-0.6 c-0.4-0.4-1-0.4-1.4,0c-0.4,0.4-0.4,1,0,1.4C12.2,27.6,17.6,27.3,21.6,24.4C25.6,21.5,27.6,16.5,26.7,11.9 C25.5,6.2,22.3,4.3,17.6,3.4z"/>
      </svg>

      {/* Image Panel Absolute on one side for seamless integration */}
      <div 
         className="promo-image-wrapper"
         style={{
           position: "absolute",
           top: 0,
           bottom: 0,
           [isRTL ? "left" : "right"]: 0,
           width: "60%",
           zIndex: 0,
         }}
      >
        {offer?.image && (
          <>
            <img
              src={offer.image}
              alt={titleText}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {/* Blending Overlay - smooth transition from green to image */}
            <div 
              style={{ 
                position: "absolute", 
                inset: 0, 
                background: isRTL 
                  ? "linear-gradient(to left, #326e36 0%, rgba(50,110,54,0.7) 40%, transparent 100%)" 
                  : "linear-gradient(to right, #326e36 0%, rgba(50,110,54,0.7) 40%, transparent 100%)"
              }} 
            />
          </>
        )}
      </div>

      {/* Mobile-only solid gradient overlay for text readability */}
      <div className="absolute inset-0 block sm:hidden" style={{ background: "linear-gradient(to right, rgba(50,110,54,0.95) 0%, rgba(50,110,54,0.85) 100%)", zIndex: 1 }} />

      {/* Text Content */}
      <div
        className="relative z-10 w-full sm:w-2/3 lg:w-[55%]"
        style={{ 
          textAlign: isRTL ? "right" : "left",
          paddingTop: "clamp(32px, 6vw, 64px)",
          paddingBottom: "clamp(32px, 6vw, 64px)",
          paddingInlineStart: "clamp(32px, 6vw, 80px)",
          paddingInlineEnd: "clamp(24px, 4vw, 40px)",
        }}
      >
        {/* Badge */}
        <span style={{
          display: "inline-block",
          background: "#F59E0B", 
          color: "#fff",
          fontSize: "clamp(12px, 1.2vw, 14px)", 
          fontWeight: 800,
          padding: "8px 24px", 
          borderRadius: "50px", 
          marginBottom: "20px",
          width: "fit-content",
          boxShadow: "0 4px 12px rgba(245,158,11,0.3)"
        }}>
          {badgeText}
        </span>

        {/* Title */}
        <h3 style={{ 
          fontSize: "clamp(26px, 3.5vw, 42px)", 
          fontWeight: 900, 
          color: "#fff", 
          lineHeight: 1.3, 
          marginBottom: "16px",
          maxWidth: "90%"
        }}>
          {titleText}
        </h3>

        {/* Subtitle / Desc */}
        <p style={{ 
          fontSize: "clamp(15px, 1.6vw, 18px)", 
          color: "rgba(255,255,255,0.85)", 
          marginBottom: "24px", 
          lineHeight: 1.7, 
          fontWeight: 500,
          maxWidth: "85%"
        }}>
          {descText}
        </p>

        {/* Countdown Timer */}
        <CountdownTimer endDateStr={offer?.end_date} isRTL={isRTL} groupIndex={groupIndex} />

        {/* Button */}
        <Link
          to={offer ? offer.link : "/products"}
          className="promo-btn-orange"
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "#F97316", // Bright Orange
            color: "#fff", 
            fontWeight: 800, 
            fontSize: "clamp(14px, 1.5vw, 16px)", 
            padding: "14px 32px", 
            borderRadius: "50px", 
            textDecoration: "none", 
            width: "fit-content", 
            boxShadow: "0 8px 20px rgba(249,115,22,0.3)" 
          }}
        >
          {isRTL ? "تسوق الآن" : "Shop Now"}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isRTL ? "none" : "scaleX(-1)", marginTop: "2px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
   offer       — a single dynamic offer from the API
   groupIndex  — which placeholder set  (0, 1, 2)
 ══════════════════════════════════════════════════════════ */
export default function PromoBannersSection({ offer, groupIndex = 0 }) {
  const { direction, locale } = useLanguage();
  const isRTL = direction === "rtl";
  const { loading } = useDashboardData();

  if (!offer) return null;

  /* Bind offer data */
  const o = resolveOffer(offer, locale);

  /* Placeholder set for this group */
  const ph = GROUPS[groupIndex % GROUPS.length];

  return (
    <section className="flex justify-center w-full" style={{ padding: "32px 16px", background: "#f8faf8" }}>
      <style>{`
        @keyframes skeletonShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .promo-card { transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease; }
        .promo-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(46,125,50,0.2) !important; }
        .promo-btn-orange { transition: all 0.25s ease; }
        .promo-btn-orange:hover { background-color: #ea580c !important; transform: scale(1.04); }
      `}</style>

      <div
        className="w-full max-w-[1320px]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {loading ? (
          <Skeleton height={340} />
        ) : (
          <WideBanner offer={o} isRTL={isRTL} ph={ph.big} groupIndex={groupIndex} />
        )}
      </div>
    </section>
  );
}
