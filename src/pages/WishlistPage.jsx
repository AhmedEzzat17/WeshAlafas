import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const { locale, direction } = useLanguage();
  const { wishlistItems } = useCart();
  const isRTL = direction === "rtl";

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"} style={{ background: "#f8faf8", paddingBottom: 64 }}>
      {/* Header Area */}
      <div className="bg-white border-b border-[#eee]">
        {/* <div className="max-w-[1600px] mx-auto" style={{ padding: "28px 24px 24px" }}>
          <div className="flex items-center" style={{ gap: 10, marginBottom: 6 }}>
            <svg width="36" height="36" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <h1 className="font-extrabold text-gray-800" style={{ fontSize: "clamp(22px, 5vw, 30px)" }}>
              {locale === "ar" ? "المفضلة" : "Wishlist"}
            </h1>
          </div>
          <p className="text-gray-500 font-medium mt-1">
            {locale === "ar"
              ? `لديك ${wishlistItems.length} منتجات مفضلة`
              : `You have saved ${wishlistItems.length} items`}
          </p>
        </div> */}
      </div>

      <div className="max-w-[1600px] mx-auto" style={{ padding: "20px 16px" }}>
        {wishlistItems.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center bg-white"
            style={{
              padding: "clamp(60px, 12vw, 100px) 20px",
              textAlign: "center",
              borderRadius: 24,
              border: "1px dashed #e2e8f0",
              boxShadow: "0 10px 40px rgba(0,0,0,0.03)"
            }}
          >
            <div 
              className="flex items-center justify-center bg-red-50 mb-6"
              style={{ width: "clamp(90px, 15vw, 130px)", height: "clamp(90px, 15vw, 130px)", borderRadius: "50%" }}
            >
              <svg width="45%" height="45%" fill="none" stroke="#ef4444" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h2
              className="font-bold text-gray-800"
              style={{ fontSize: "clamp(20px, 3.5vw, 26px)", marginBottom: 12 }}
            >
              {locale === "ar" ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
            </h2>
            <p
              className="text-gray-500 font-medium"
              style={{ fontSize: "clamp(14px, 2.5vw, 16px)", marginBottom: 32, maxWidth: 320 }}
            >
              {locale === "ar"
                ? "أضف بعض المنتجات التي تعجبك إلى المفضلة للرجوع إليها لاحقاً!"
                : "Add some products you love to your wishlist to refer to them later!"}
            </p>
            <Link
              to="/"
              className="bg-primary hover:bg-primary-dark text-white font-bold transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95"
              style={{
                padding: "14px 36px",
                borderRadius: 14,
                fontSize: "clamp(15px, 2.5vw, 17px)",
                gap: 10,
                boxShadow: "0 8px 20px rgba(46,125,50,0.25)",
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </Link>
          </div>
        ) : (
          <div 
            className="grid"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(160px, 40vw, 240px), 1fr))", gap: "clamp(12px, 3vw, 24px)" }}
          >
            {wishlistItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
