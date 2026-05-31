import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../../Dashboard/shared/DashboardDataContext";
import offerVeg from "../../assets/offer-vegetables.png";
import offerFruit from "../../assets/offer-fruits.png";
import offerBundle from "../../assets/offer-bundle.png";

/* ====== Offer Data (Removed fake data) ====== */

/* ====== Arrow SVG ====== */
const ArrowSvg = ({ direction }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
    style={{ transform: direction === "left" ? "scaleX(-1)" : "none" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

/* ====== Check SVG ====== */
const CheckSvg = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    stroke="#2E7D32"
    strokeWidth={3}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);
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

export default function OffersSlider() {
  const { direction, locale } = useLanguage();
  const { offers: apiOffers } = useDashboardData();
  const isRTL = direction === "rtl";
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const getSliderOffers = () => {
    if (!apiOffers || apiOffers.length === 0) return [];
    
    const wide = apiOffers.filter(o => (o.description || "").includes("#wide"));
    const slider = apiOffers.filter(o => !(o.description || "").includes("#wide"));

    // If there are more than 2 wide offers, push the rest to the slider
    if (wide.length > 2) {
      slider.push(...wide.slice(2));
    }
    
    return slider;
  };

  const displayOffers = getSliderOffers().map(o => {
    let cleanDesc = o.description || "";
    if (cleanDesc.includes("#wide")) {
      cleanDesc = cleanDesc.replace("#wide", "").trim();
    }
    const parsedNameAr = parseBilingual(o.name || "", "ar") || "عرض خاص";
    const parsedNameEn = parseBilingual(o.name || "", "en") || "Special Offer";
    const parsedDescAr = parseBilingual(cleanDesc, "ar");
    const parsedDescEn = parseBilingual(cleanDesc, "en");

    return {
      id: o.id,
      image: o.image_url || o.image || offerBundle,
      titleEn: parsedNameEn,
      titleAr: parsedNameAr,
      priceEn: o.discount_value ? (o.discount_type === "PERCENTAGE" ? `${o.discount_value}% OFF` : `${o.discount_value} EGP OFF`) : "",
      priceAr: o.discount_value ? (o.discount_type === "PERCENTAGE" ? `خصم ${o.discount_value}%` : `خصم ${o.discount_value} ج.م`) : "",
      featuresEn: parsedDescEn ? [parsedDescEn] : [],
      featuresAr: parsedDescAr ? [parsedDescAr] : [],
      originalOffer: o
    };
  });

  /* Calculate how many cards visible */
  const calcVisible = useCallback(() => {
    if (typeof window === "undefined") return 2;
    const w = window.innerWidth;
    if (w < 768) return 1;
    return 2;
  }, []);

  useEffect(() => {
    const onResize = () => setVisibleCount(calcVisible());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [calcVisible]);

  const maxIndex = Math.max(0, displayOffers.length - visibleCount);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  /* Auto-play: slides every 4 seconds */
  useEffect(() => {
    if (isDragging) return;
    autoPlayRef.current = setInterval(() => {
      goNext();
    }, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, [isDragging, currentIndex, goNext]);

  /* Drag Handlers */
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    setCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = currentX - startX;
    if (Math.abs(diff) > 20) {
      if (isRTL) {
        if (diff > 0)
          goNext(); // dragged right
        else goPrev(); // dragged left
      } else {
        if (diff < 0)
          goNext(); // dragged left
        else goPrev(); // dragged right
      }
    }
    setCurrentX(0);
    setStartX(0);
  };

  /* Translate amount - calculate % per card including gap compensation */
  const gapPx = 30;
  const getTranslateValue = () => {
    if (!sliderRef.current) return 0;
    const containerWidth = sliderRef.current.parentElement?.clientWidth || 0;
    if (containerWidth === 0) return 0;
    const cardWidth =
      (containerWidth - gapPx * (visibleCount - 1)) / visibleCount;
    const shiftPx = currentIndex * (cardWidth + gapPx);
    return shiftPx;
  };

  /* Force re-render for getTranslateValue on resize */
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const onResize = () => forceUpdate((n) => n + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background:
          "linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #388E3C 100%)",
        padding: "clamp(60px, 8vw, 90px) 30px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative background shapes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -40,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.02)",
          }}
        />
      </div>

      <style>{`
        .offer-card-img {
          transition: transform 0.5s ease;
        }
        .offer-price-card:hover .offer-card-img {
          transform: scale(1.08);
        }
        .offer-price-card {
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .offer-price-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.18) !important;
        }
        .offer-cta-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .offer-cta-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        .offer-cta-btn:hover::before { left: 100%; }
        .offer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(46,125,50,0.5);
        }
        .offer-nav-arrow {
          transition: all 0.25s ease;
        }
        .offer-nav-arrow:hover {
          transform: translateY(-50%) scale(1.12) !important;
          box-shadow: 0 6px 22px rgba(0,0,0,0.2) !important;
        }
        @media (max-width: 1023px) {
          .offers-grid { flex-direction: column !important; }
          .offers-text-col { max-width: 100% !important; padding-bottom: 28px !important; }
          .offers-slider-col { width: 100% !important; }
        }
      `}</style>
      <div
        className="max-w-[1920px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="offers-grid"
          style={{
            display: "flex",
            gap: "clamp(24px, 4vw, 50px)",
            alignItems: "center",
          }}
        >
          {/* ===== Left Column: Text ===== */}
          <div
            className="offers-text-col"
            style={{
              flex: "0 0 auto",
              maxWidth: 480,
            }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  fontWeight: 800,
                  color: "#A5D6A7",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {isRTL ? "خطة الأسعار" : "Pricing Plan"}
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontSize: "clamp(24px, 3.5vw, 38px)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.3,
                marginBottom: 24,
              }}
            >
              {isRTL
                ? "نقدم أسعاراً عادلة للمنتجات الطازجة"
                : "We Offer Fair Prices for Fresh Products"}
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: "clamp(13px, 1.4vw, 16px)",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.9,
                marginBottom: 40,
              }}
            >
              {isRTL
                ? "احصل على أفضل المنتجات الطازجة مباشرة من المزارعين بأسعار تنافسية. نضمن لك الجودة والطزاجة في كل طلب مع خدمة توصيل سريعة وموثوقة."
                : "Get the best fresh products directly from farmers at competitive prices. We guarantee quality and freshness in every order with fast and reliable delivery service."}
            </p>

            {/* Call to action label */}
            <h5
              style={{
                fontSize: "clamp(11px, 1.2vw, 14px)",
                fontWeight: 800,
                color: "#A5D6A7",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 8,
              }}
            >
              {isRTL ? "اطلب الآن" : "Order Now"}
            </h5>
            <Link
              to="/products?category=all"
              style={{
                fontSize: "clamp(22px, 3vw, 34px)",
                fontWeight: 900,
                color: "#fff",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.3s ease",
                borderBottom: "3px solid #A5D6A7",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              {isRTL ? "تسوق الآن ←" : "Shop Now →"}
            </Link>
          </div>

          {/* ===== Right Column: Cards Carousel ===== */}
          <div
            className="offers-slider-col"
            style={{
              flex: 1,
              position: "relative",
              minWidth: 0,
            }}
          >
            {displayOffers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.1)", borderRadius: 16 }}>
                <h3 style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
                  {isRTL ? "ترقبوا عروضنا قريباً!" : "Stay tuned for our upcoming offers!"}
                </h3>
              </div>
            ) : (
              <>
                {/* Navigation Arrows */}
                <button
                  className="offer-nav-arrow"
                  onClick={() => {
                    goPrev();
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    [isRTL ? "right" : "left"]: -25,
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.5)",
                    background: "rgba(255, 255, 255, 1)",
                    color: "#2E7D32",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                  }}
                >
                  <ArrowSvg direction="left" />
                </button>

                <button
                  className="offer-nav-arrow"
                  onClick={() => {
                    goNext();
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    [isRTL ? "left" : "right"]: -25,
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "none",
                    background: "#fff",
                    color: "#2E7D32",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <ArrowSvg direction="right" />
                </button>

                {/* Slider viewport */}
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: 16,
                    padding: "6px 2px",
                    userSelect: "none",
                    touchAction: "pan-y",
                  }}
                  onMouseDown={handleDragStart}
                  onMouseMove={handleDragMove}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={handleDragStart}
                  onTouchMove={handleDragMove}
                  onTouchEnd={handleDragEnd}
                >
                  <div
                    ref={sliderRef}
                    style={{
                      display: "flex",
                      gap: gapPx,
                      alignItems: "stretch",
                      transition: isDragging
                        ? "none"
                        : "transform 0.8s ease-in-out",
                      transform: `translateX(${isRTL
                          ? getTranslateValue() +
                          (isDragging ? currentX - startX : 0)
                          : -getTranslateValue() +
                          (isDragging ? currentX - startX : 0)
                        }px)`,
                    }}
                  >
                    {displayOffers.map((offer) => (
                      <div
                        key={offer.id}
                        style={{
                          flex: `0 0 calc((100% - ${gapPx * (visibleCount - 1)}px) / ${visibleCount})`,
                          display: "flex",
                        }}
                      >
                        {/* === Card === */}
                        <div
                          className="offer-price-card"
                          style={{
                            borderRadius: 16,
                            overflow: "hidden",
                            background: "#fff",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          {/* Image */}
                          <div
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              height: "clamp(160px, 18vw, 220px)",
                              background: "#ffffffff",
                            }}
                          >
                            <img
                              src={offer.image}
                              alt={isRTL ? offer.titleAr : offer.titleEn}
                              className="offer-card-img"
                              draggable="false"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                pointerEvents: "none",
                              }}
                            />
                            {/* Price Badge */}
                            <div
                              style={{
                                position: "absolute",
                                top: "80%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 2,
                                background: "#fff",
                                borderRadius: 12,
                                padding: "6px 24px",
                                boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "clamp(18px, 2vw, 24px)",
                                  fontWeight: 900,
                                  color: "#2E7D32",
                                }}
                              >
                                {isRTL ? offer.priceAr : offer.priceEn}
                              </span>
                            </div>
                          </div>

                          {/* Body */}
                          <div
                            style={{
                              position: "relative",
                              textAlign: "center",
                              background: "#FAFFFE",
                              borderBottom: "4px solid #2E7D32",
                              padding:
                                "clamp(32px, 3.5vw, 40px) clamp(20px, 2.5vw, 32px) clamp(50px, 6vw, 64px)",
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <h4
                              style={{
                                fontSize: "clamp(16px, 1.8vw, 21px)",
                                fontWeight: 800,
                                color: "#1a1a1a",
                                marginBottom: 16,
                              }}
                            >
                              {isRTL ? offer.titleAr : offer.titleEn}
                            </h4>

                            {/* Divider */}
                            <div
                              style={{
                                width: 55,
                                height: 3,
                                background:
                                  "linear-gradient(90deg, #2E7D32, #66BB6A)",
                                borderRadius: 3,
                                margin: "0 auto 20px",
                              }}
                            />

                            {/* Features */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                              }}
                            >
                              {(isRTL ? offer.featuresAr : offer.featuresEn).map(
                                (f, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      fontSize: "clamp(12px, 1.3vw, 15px)",
                                      color: "#4B5563",
                                      fontWeight: 600,
                                    }}
                                  >
                                    <span>{f}</span>
                                    <CheckSvg />
                                  </div>
                                ),
                              )}
                            </div>

                            {/* CTA Button */}
                            <Link
                              to={`/products?offer_id=${offer.id}`}
                              className="offer-cta-btn"
                              draggable="false"
                              style={{
                                position: "absolute",
                                bottom: -25,
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                background:
                                  "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                                color: "#fff",
                                fontSize: "clamp(13px, 1.3vw, 15px)",
                                fontWeight: 700,
                                padding: "14px 40px",
                                borderRadius: 12,
                                textDecoration: "none",
                                whiteSpace: "nowrap",
                                boxShadow: "0 6px 20px rgba(46,125,50,0.35)",
                              }}
                            >
                              {isRTL ? "اطلب الآن" : "Order Now"}
                            </Link>
                          </div>

                          {/* Spacer for button overlap */}
                          <div style={{ height: 28, background: "#fff" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots indicator */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 20,
                  }}
                >
                  {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentIndex(i);
                      }}
                      style={{
                        width: currentIndex === i ? 28 : 10,
                        height: 10,
                        borderRadius: 5,
                        border: "none",
                        background:
                          currentIndex === i ? "#fff" : "rgba(255,255,255,0.35)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
