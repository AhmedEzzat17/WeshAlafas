import { useLanguage } from "../../context/LanguageContext";

export default function About() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const features = [
    {
      iconSrc: "/icons/etwtznjn.json", // leaf / organic
      en: "100% Organic",
      ar: "منتجات عضوية 100%",
    },
    {
      iconSrc: "/icons/surcxhka.json", // delivery truck
      en: "Fast Delivery",
      ar: "توصيل سريع",
    },
    {
      iconSrc: "/icons/qhviklyi.json", // coins / pricing
      en: "Best Prices",
      ar: "أفضل الأسعار",
    },
    {
      iconSrc: "/icons/surjmvno.json", // star / quality
      en: "Top Quality",
      ar: "جودة مضمونة",
    },
  ];

  return (
    <section className="bg-surface" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className="max-w-[1320px] mx-auto flex flex-col lg:flex-row items-center"
        style={{ padding: "60px 32px", gap: 48 }}
      >
        {/* ===== Text ===== */}
        <div
          className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
          style={{ paddingTop: 16 }}
        >
          <span
            className="text-primary font-bold uppercase"
            style={{
              fontSize: 13,
              letterSpacing: 1.5,
              marginBottom: 12,
              display: "block",
            }}
          >
            {locale === "ar" ? "من نحن" : "About Us"}
          </span>
          <h2
            className="font-extrabold text-text-main"
            style={{
              fontSize: "clamp(26px, 4.5vw, 40px)",
              lineHeight: 1.3,
              marginBottom: 20,
            }}
          >
            {locale === "ar"
              ? "نقدم الأفضل والطازج يومياً لك"
              : "We Provide The Best & Freshest Daily"}
          </h2>
          <p
            className="text-text-muted font-medium"
            style={{
              fontSize: "clamp(15px, 2.2vw, 17px)",
              lineHeight: 1.8,
              marginBottom: 32,
              maxWidth: 540,
            }}
          >
            {locale === "ar"
              ? "خبرتنا تمتد لسنوات في قطاع المنتجات الزراعية الطازجة. نحرص على اختيار أفضل المحاصيل مباشرة من المزارع لضمان أعلى درجات الجودة وبأفضل الأسعار التنافسية لنمنحك تجربة تسّوق لا تُنسى."
              : "Our expertise spans years in the fresh agricultural sector. We always select the best crops directly from the farms to guarantee the highest quality and the best competitive prices to give you an unforgettable shopping experience."}
          </p>

          {/* Feature Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2"
            style={{ gap: 20, marginBottom: 36 }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center group"
                style={{ gap: 14 }}
              >
                <div
                  className="bg-primary/10 flex items-center justify-center rounded-xl shrink-0 group-hover:bg-primary/20 transition-colors duration-300"
                  style={{ width: 52, height: 52 }}
                >
                  <lord-icon
                    src={f.iconSrc}
                    trigger="loop"
                    delay="2000"
                    colors="primary:#2E7D32,secondary:#81C784"
                    style={{ width: "32px", height: "32px" }}
                  />
                </div>
                <span
                  className="text-text-main font-bold"
                  style={{ fontSize: 15 }}
                >
                  {locale === "ar" ? f.ar : f.en}
                </span>
              </div>
            ))}
          </div>

          {/* <button
            className="bg-primary text-surface shadow-lg shadow-primary/30 font-bold hover:bg-primary-dark transition-all duration-300 cursor-pointer active:scale-95"
            style={{
              padding: "16px 32px",
              borderRadius: 14,
              fontSize: 16,
              border: "none",
            }}
          >
            {locale === "ar" ? "اقرأ المزيد عنا" : "Read More About Us"}
          </button> */}
        </div>

        {/* ===== Images ===== */}
        <div className="flex-1 relative w-full" style={{ minHeight: 380 }}>
          <img
            src="/images/about-bg.jpg"
            alt={locale === "ar" ? "المتجر" : "Grocery Store"}
            className="rounded-2xl shadow-xl object-cover border-4 border-white"
            style={{
              width: "82%",
              height: 350,
              marginLeft: isRTL ? 0 : "auto",
              marginRight: isRTL ? "auto" : 0,
              display: "block",
            }}
            loading="lazy"
          />
          <img
            src="/images/about-img-1.jpg"
            alt={locale === "ar" ? "سلة طازجة" : "Fresh basket"}
            className="absolute rounded-2xl border-[6px] border-surface shadow-2xl object-cover hover:scale-105 transition-transform duration-500"
            style={{
              bottom: -20,
              left: isRTL ? "auto" : -20,
              right: isRTL ? -20 : "auto",
              width: "62%",
              height: 220,
            }}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
