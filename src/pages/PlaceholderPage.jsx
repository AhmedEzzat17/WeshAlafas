import { useLanguage } from "../context/LanguageContext";

/**
 * Generic placeholder page component.
 * Used for Products, Categories, About, Contact, Cart, Wishlist, Account pages.
 */
export default function PlaceholderPage({ titleEn, titleAr, icon }) {
  const { locale } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 mb-6">
          <span className="text-4xl">{icon}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
          {locale === "ar" ? titleAr : titleEn}
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          {locale === "ar"
            ? "هذه الصفحة قيد التطوير. ترقبوا المزيد من المحتوى قريباً!"
            : "This page is under development. Stay tuned for more content!"}
        </p>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
