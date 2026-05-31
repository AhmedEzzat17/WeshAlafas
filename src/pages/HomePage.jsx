import { useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import FAQ from "../components/FAQ/FAQ";
import OffersSlider from "../components/OffersSlider/OffersSlider";
import CategoriesSection from "../components/CategoriesSection/CategoriesSection";
import ProductSliderSection from "../components/ProductSliderSection/ProductSliderSection";
import PromoBannersSection from "../components/PromoBannersSection/PromoBannersSection";
import { useDashboardData } from "../Dashboard/shared/DashboardDataContext";
import { ProductSkeleton, HeroSkeleton, SectionTitleSkeleton, AboutSkeleton } from "../components/Skeleton";

/* ── collect products that belong to an offer's listings ── */
function getOfferProducts(offer, allProducts) {
  if (!offer || !offer.listings || offer.listings.length === 0) return [];
  const ids = offer.listings.map(l => String(l.id || l));
  return allProducts.filter(p => ids.includes(String(p.id)));
}

const ProjectIdeaSection = () => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <section style={{
      padding: "60px 20px",
      background: "#F1F8E9",
      marginTop: "40px",
      marginBottom: "40px",
      borderRadius: "24px",
      margin: "40px 16px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center",
        gap: "40px",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: "1 1 500px", textAlign: isRTL ? "right" : "left" }}>
          <span style={{
            display: "inline-block",
            fontSize: "13px",
            fontWeight: "800",
            color: "#2E7D32",
            letterSpacing: "1px",
            marginBottom: "12px",
            textTransform: "uppercase"
          }}>
            {isRTL ? "قطاع الأعمال والشركات" : "B2B & Corporate"}
          </span>
          <h2 style={{
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: "900",
            color: "#1B5E20",
            marginBottom: "20px",
            lineHeight: 1.3
          }}>
            {isRTL ? "شريكك الموثوق لتوريد المحاصيل الطازجة" : "Your Trusted Fresh Produce Partner"}
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.5vw, 17px)",
            color: "#4B5563", 
            lineHeight: "1.8",
            marginBottom: "16px"
          }}>
            {isRTL 
              ? "نحن نضع بين يديك منظومة متكاملة لخدمة قطاع الأعمال (B2B)، حيث نعمل كجسر مباشر يربط بين المزارع المنتجة وبين التجار والفنادق والمنشآت التجارية."
              : "We provide an integrated B2B ecosystem, acting as a direct bridge connecting producing farms with hotels, restaurants, cafes, and commercial establishments."}
          </p>
          <p style={{
            fontSize: "clamp(15px, 1.5vw, 17px)",
            color: "#4B5563",
            lineHeight: "1.8",
            marginBottom: "24px"
          }}>
            {isRTL
              ? "من خلال القضاء على سلسلة الوسطاء المعقدة، نضمن لك استمرارية التوريد بالكميات المطلوبة، مع تقديم أسعار جملة حقيقية تساهم في زيادة أرباح منشأتك."
              : "By eliminating complex middlemen chains, we guarantee continuous supply in required volumes, offering real wholesale prices that boost your profitability."}
          </p>
          <ul style={{
            listStyleType: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px"
          }}>
            {[
              isRTL ? "عقود توريد مرنة ومستمرة" : "Flexible & Continuous Contracts",
              isRTL ? "أسعار جملة تنافسية" : "Competitive Wholesale Prices",
              isRTL ? "فرز وتعبئة بمعايير فندقية" : "Premium Sorting & Packaging",
              isRTL ? "تلبية سريعة للكميات الكبيرة" : "Fast Fulfillment for Bulk Orders"
            ].map((item, index) => (
              <li key={index} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "15px",
                fontWeight: "700",
                color: "#2E7D32"
              }}>
                <span style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#2E7D32",
                  color: "#fff",
                  fontSize: "14px"
                }}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: "1 1 400px", display: "flex", justifyContent: "center" }}>
          <div style={{
            width: "100%",
            maxWidth: "450px",
            aspectRatio: "1",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #1B5E20, #388E3C)",
            boxShadow: "0 20px 40px rgba(46,125,50,0.25)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
            textAlign: "center",
            color: "white"
          }}>
            <svg style={{ width: "90px", height: "90px", marginBottom: "24px", opacity: 0.9 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 style={{ fontSize: "24px", fontWeight: "900", margin: 0, lineHeight: 1.4 }}>
              {isRTL ? "من المزرعة إلى منشأتك مباشرة" : "Directly From Farm to Your Establishment"}
            </h3>
            <p style={{ marginTop: "12px", fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>
              {isRTL ? "بدون وسطاء، جودة أعلى وتوفير أكثر" : "No middlemen, higher quality, more savings"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <section style={{ padding: "20px 10px", background: "#f8faf8" }}>
      <div style={{
        maxWidth: "1320px",
        margin: "0 auto",
        background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
        borderRadius: "24px",
        padding: "clamp(20px, 6vw, 80px) 20px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(27,94,32,0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Abstract Background Shapes */}
        <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{
            color: "#ffffff",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: "900",
            marginBottom: "20px",
            lineHeight: 1.3
          }}>
            {isRTL ? "ابدأ الآن مع وش الأفص" : "Start Now with Wesh Alafas"}
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "clamp(16px, 1.8vw, 18px)",
            marginBottom: "40px",
            lineHeight: 1.7,
            fontWeight: 500
          }}>
            {isRTL 
              ? "اكتشف أفضل المحاصيل الزراعية الطازجة، واحصل على عروض حصرية تلبي احتياجاتك بأسعار لا تقبل المنافسة." 
              : "Discover the best fresh agricultural crops, and get exclusive offers tailored to your needs at unbeatable prices."}
          </p>
          
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <Link to="/products" className="cta-btn-primary" style={{
              background: "#F97316",
              color: "#ffffff",
              padding: "16px 40px",
              borderRadius: "50px",
              fontWeight: "800",
              fontSize: "16px",
              textDecoration: "none",
              boxShadow: "0 8px 20px rgba(249,115,22,0.3)",
              transition: "transform 0.3s ease, background 0.3s ease",
              display: "inline-flex",
              alignItems: "center"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#ea580c'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#F97316'; }}
            >
              {isRTL ? "تصفح المنتجات" : "Browse Products"}
            </Link>
            <Link to="/contact" className="cta-btn-secondary" style={{
              background: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              padding: "16px 40px",
              borderRadius: "50px",
              fontWeight: "800",
              fontSize: "16px",
              textDecoration: "none",
              border: "2px solid rgba(255,255,255,0.2)",
              transition: "transform 0.3s ease, background 0.3s ease",
              backdropFilter: "blur(10px)",
              display: "inline-flex",
              alignItems: "center"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              {isRTL ? "تواصل معنا" : "Contact Us"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function HomePage() {
  const { direction } = useLanguage();
  const { products, offers: rawOffers, loading } = useDashboardData();
  const isRTL = direction === "rtl";
  const location = useLocation();

  /* scroll to hash section */
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.substring(1);
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }, 100);
    }
  }, [location]);



  /* Filter out wide offers (those with #wide tag) */
  const wideOffers = useMemo(() => {
    return rawOffers?.filter(o => (o.description || "").includes("#wide")) || [];
  }, [rawOffers]);

  /* collect real products for each banner group using wideOffers */
  const groupProducts = useMemo(() => {
    // 0: first wide banner, 1: second wide banner, 2: normal slider fallback
    return [0, 1].map(idx => {
      const offer = wideOffers[idx];
      if (!offer) return [];
      const collected = new Map();
      getOfferProducts(offer, products).forEach(p => {
        if (!collected.has(p.id)) collected.set(p.id, p);
      });
      return [...collected.values()].slice(0, 7);
    });
  }, [wideOffers, products]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="home-page overflow-hidden">
      {loading ? (
        <div style={{ background: "#f8faf8", paddingBottom: "64px" }}>
          {/* Hero Skeleton */}
          <HeroSkeleton />
          
          {/* About Skeleton */}
          <div style={{ background: "#fff" }}>
            <AboutSkeleton />
          </div>

          <div style={{ marginTop: "40px" }}>
            <SectionTitleSkeleton />
            <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "64px" }}>
            <SectionTitleSkeleton />
            <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ═══════ Hero Section ═══════ */}
          <Hero />

          {/* ═══════ About ═══════ */}
          <div id="about"><About /></div>

          {/* ═══════ Categories ═══════ */}
          <div id="categories"><CategoriesSection /></div>

          {/* ═══════ Offers Slider (Green Banner with 2 cards) ═══════ */}
          <OffersSlider />

          {/* ══════════════════════════════════════════════════════
              GROUP 1: Cards + PromoBanners (Offer 3)
          ══════════════════════════════════════════════════════ */}
          <ProductSliderSection
            titleAr="منتجات عروضنا المميزة"
            titleEn="Special Offer Products"
            sliderId="offer-group-1-slider"
            isOffer={true}
            products={
              groupProducts[0].length > 0
                ? groupProducts[0]
                : products.slice(0, 7)
            }
          />

          {wideOffers?.[0] && (
            <PromoBannersSection offer={wideOffers[0]} groupIndex={0} />
          )}

          {/* ══════════════════════════════════════════════════════
              GROUP 2: Cards + PromoBanners (Offer 4)
          ══════════════════════════════════════════════════════ */}
          <ProductSliderSection
            titleAr="عروض توفير إضافية"
            titleEn="Additional Savings"
            sliderId="offer-group-2-slider"
            isOffer={true}
            products={
              groupProducts[1].length > 0
                ? groupProducts[1]
                : (products.length > 7 ? products.slice(7, 14) : products.slice(0, 7))
            }
          />

          {wideOffers?.[1] && (
            <PromoBannersSection offer={wideOffers[1]} groupIndex={1} />
          )}

          {/* ══════════════════════════════════════════════════════
              GROUP 3: Cards Only (Offer 0)
          ══════════════════════════════════════════════════════ */}
          <ProductSliderSection
            titleAr="وصل حديثاً"
            titleEn="New Arrivals"
            sliderId="offer-group-3-slider"
            isOffer={true}
            products={
              products.length > 14
                ? products.slice(14, 21)
                : (products.length > 7 ? products.slice(3, 10) : products.slice(0, 7))
            }
          />

          {/* ═══════ Project Idea Section ═══════ */}
          <ProjectIdeaSection />

          {/* ═══════ FAQ ═══════ */}
          <div id="faq"><FAQ /></div>

          {/* ═══════ CTA Section ═══════ */}
          <CTASection />
        </>
      )}
    </div>
  );
}
