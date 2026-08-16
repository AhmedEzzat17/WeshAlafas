import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../utils/translations";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function Hero() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const location = useLocation();

  const handleHowItWorks = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const element = document.getElementById("faq");
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    } else {
      navigate("/#faq");
    }
  };

  const slides = [
    {
      id: 1,
      badgeAr: "أعلى جودة",
      badgeEn: "Premium Quality",
      title1: locale === "ar" ? "خضروات وفواكه طازجة" : "Fresh Vegetables",
      title2: locale === "ar" ? "من المزرعة لباب بيتك" : "& Fruits Delivered",
      subtitle:
        locale === "ar"
          ? "تسوق أفضل الخضروات والفواكه الطازجة والعضوية المقطوفة بعناية. نضمن لك أعلى جودة لحياة صحية وعناية متكاملة لأسرتك."
          : "Shop the best fresh, organic, and hand-picked vegetables and fruits. We guarantee premium quality for a healthy life for you and your family.",
      bgImg: "/images/hero-bg.jpg",
      mainImg: "/images/hero-img-1.jpg",
      subImg: "/images/hero-img-2.jpg",
      badgeIcon: "🥬",
      rotateMain: "rotate-3 hover:rotate-0",
      rotateSub: "-rotate-6 hover:rotate-3",
    },
    {
      id: 2,
      badgeAr: "مقطوفة يومياً",
      badgeEn: "Picked Daily",
      title1: locale === "ar" ? "محاصيل زراعية عضوية" : "Organic Farms",
      title2: locale === "ar" ? "غنية بالفيتامينات" : "100% Natural",
      subtitle:
        locale === "ar"
          ? "اكتشف تشكيلتنا الواسعة من المنتجات الموسمية المزروعة في بيئة نظيفة خالية من المواد الكيميائية. طعم الطبيعة الأصلي في كل وجبة."
          : "Discover our wide variety of seasonal products grown in a clean, chemical-free environment. The authentic taste of nature in every meal.",
      bgImg: "/images/about-bg.jpg",
      mainImg: "/images/about-img-1.jpg",
      subImg: "/images/product-strawberry-1.jpg",
      badgeIcon: "🍓",
      rotateMain: "-rotate-2 hover:rotate-1",
      rotateSub: "rotate-3 hover:-rotate-1",
    },
    {
      id: 3,
      badgeAr: "أسعار تنافسية",
      badgeEn: "Best Prices",
      title1: locale === "ar" ? "قيمة ممتازة" : "Unbeatable Quality",
      title2: locale === "ar" ? "بأفضل الأسعار" : "& Amazing Prices",
      subtitle:
        locale === "ar"
          ? "نحرص دائماً على اختيار وتوفير أرقى أنواع الفاكهة والخضار لتوفيرها لك بأرخص الأسعار مع عروض وخصومات حصرية يومياً."
          : "We always strive to select and provide the finest types of fruits and vegetables at the lowest prices with exclusive daily offers.",
      bgImg: "/images/product-apple-1.jpg",
      mainImg: "/images/product-orange-main.jpg",
      subImg: "/images/product-avocado-1.jpg",
      badgeIcon: "🌾",
      rotateMain: "rotate-1 hover:-rotate-2",
      rotateSub: "-rotate-3 hover:rotate-2",
    },
  ];

  return (
    <section
      className="bg-bg flex justify-center w-full"
      style={{ padding: "24px 16px 48px" }}
    >
      <style>{`
        .hero-swiper-container .swiper-pagination-bullet {
          background-color: #ffffff;
          opacity: 0.5;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .hero-swiper-container .swiper-pagination-bullet-active {
          background-color: #FFDA76;
          opacity: 1;
          width: 24px;
          border-radius: 5px;
        }
        .hero-swiper-container {
          overflow: hidden;
          border-radius: 2rem;
        }
        @media (min-width: 1024px) {
          .hero-swiper-container {
            border-radius: 2.5rem;
          }
        }
      `}</style>

      <div
        className="relative w-full max-w-[1320px] shadow-2xl bg-primary hero-swiper-container"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Decorative Background Colors - Fixed behind Swiper */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-dark opacity-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-10" />

        <Swiper
          key={direction}
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full relative z-20"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              {/* Background Image with low opacity */}
              <div
                className="absolute inset-0 z-0 opacity-[0.12] bg-cover bg-center mix-blend-overlay"
                style={{
                  backgroundImage: `url('${slide.bgImg}')`,
                }}
              />

              {/* Main Content */}
              <div
                className="relative z-10 flex flex-col lg:flex-row items-center"
                style={{ padding: "48px 32px 56px", gap: 48 }}
              >
                {/* ===== Text Side ===== */}
                <div
                  className={`flex-1 ${isRTL ? "text-right" : "text-left"} w-full pb-8 lg:pb-0`}
                >
                  {/* Offer Badge / Small text */}
                  {/* <span
                    className="inline-block bg-surface/10 text-accent border border-accent/30 rounded-full px-5 py-2 font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm shadow-sm"
                    style={{ fontSize: 13, padding: "10px 20px" , color:"#F9A825" }}
                  >
                    {t(locale, "heroBadge")}
                  </span> */}

                  {/* Heading */}
                  <h1
                    className="text-surface font-extrabold leading-tight tracking-tight mb-4 transition-all"
                    style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
                  >
                    {slide.title1}
                    <br />
                    <span className="text-cta">{slide.title2}</span>
                  </h1>

                  {/* Subtitle */}
                  <p
                    className="text-bg/90"
                    style={{
                      fontSize: "clamp(15px, 2vw, 18px)",
                      lineHeight: 1.8,
                      maxWidth: 540,
                      marginBottom: 36,
                    }}
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div
                    className="flex flex-col sm:flex-row items-stretch sm:items-center"
                    style={{ gap: 16 }}
                  >
                    <Link
                      to="/products"
                      className="bg-flash text-surface font-semibold shadow-lg shadow-flash/30 hover:shadow-flash/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
                      style={{
                        padding: "14px 36px",
                        borderRadius: 14,
                        fontSize: 16,
                        border: "none",
                        textDecoration: "none",
                      }}
                    >
                      {t(locale, "heroCta1")}
                    </Link>
                    <button
                      onClick={handleHowItWorks}
                      className="bg-transparent text-surface font-semibold border-2 border-surface/30 hover:bg-surface hover:text-primary transition-all duration-300 cursor-pointer"
                      style={{
                        padding: "14px 36px",
                        borderRadius: 14,
                        fontSize: 16,
                      }}
                    >
                      {t(locale, "heroCta2")}
                    </button>
                  </div>
                </div>

                {/* ===== Image Side (Creative Layout) ===== */}
                <div
                  className="flex-1 w-full relative"
                  style={{ maxWidth: 560, marginTop: "20px" }}
                >
                  <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                    {/* Main Image */}
                    <div
                      className={`absolute z-10 w-[75%] h-[90%] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[4px] border-surface/20 transform transition-transform duration-500 ${slide.rotateMain}`}
                      style={{
                        ...(isRTL ? { left: "2%" } : { right: "2%" }),
                        top: "0%",
                      }}
                    >
                      <img
                        src={slide.mainImg}
                        alt="Hero Image"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>

                    {/* Overlapping Secondary Image */}
                    <div
                      className={`absolute z-20 w-[50%] h-[60%] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-[6px] border-surface transform transition-transform duration-500 ${slide.rotateSub}`}
                      style={{
                        ...(isRTL ? { right: "5%" } : { left: "5%" }),
                        bottom: "0%",
                      }}
                    >
                      <img
                        src={slide.subImg}
                        alt="Hero Secondary Image"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Floating Decorative Badge */}
                    <div
                      className="absolute z-30 bg-surface text-primary-dark font-bold px-4 py-2 lg:px-5 lg:py-3 rounded-2xl shadow-xl border border-surface animate-bounce"
                      style={{
                        top: "10%",
                        ...(isRTL ? { right: "12%" } : { left: "12%" }),
                        animationDuration: "3s",
                      }}
                    >
                      <div className="flex items-center">
                        <span
                          className="text-xl lg:text-2xl rounded-lg"
                          style={{ display: "inline-flex" }}
                        >
                          {slide.badgeIcon}
                        </span>
                        <span className="text-xs lg:text-sm whitespace-wrap" style={{ padding: "10px" }}>
                          {locale === "ar" ? slide.badgeAr : slide.badgeEn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
