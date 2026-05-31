import { useLanguage } from "../context/LanguageContext";

export default function TermsPage() {
  const { locale, direction } = useLanguage();

  return (
    <div
      dir={direction}
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "48px 16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "40px 32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 800,
            color: "#2E7D32",
            marginBottom: 32,
          }}
        >
          {locale === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}
        </h1>

        <div style={{ lineHeight: 1.9, color: "#4B5563" }}>
          {locale === "ar" ? (
            <>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>
                مرحباً بك في "وش الأفص". باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>1. القبول بالشروط</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                بمجرد وصولك واستخدامك لمنصة "وش الأفص"، فإنك توافق على أن تكون ملزماً بهذه الشروط والأحكام وكافة القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، فلا يحق لك استخدام هذه المنصة.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>2. المنتجات والتسعير</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                نبذل قصارى جهدنا لضمان دقة معلومات المنتجات والأسعار. ومع ذلك، نحتفظ بالحق في تعديل الأسعار، الكميات المتاحة، أو إلغاء الطلبات في حالة وجود أخطاء أو تغييرات في السوق دون إشعار مسبق.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>3. الطلبات والتوصيل</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                تعتمد أوقات التوصيل على الموقع الجغرافي وتوافر المنتجات. نحن غير مسؤولين عن أي تأخير خارج عن إرادتنا. يجب فحص المنتجات عند الاستلام للتأكد من جودتها ومطابقتها للطلب.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>4. سياسة الإرجاع والاسترداد</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                نظراً لطبيعة المنتجات (فواكه وخضروات طازجة)، نرجو فحص المنتجات وقت الاستلام. لن يتم قبول طلبات الإرجاع بعد مرور وقت يعرض المنتجات للتلف.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>5. التزامات الموردين (B2B)</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                يلتزم الموردون بتقديم منتجات مطابقة لمعايير الجودة المتفق عليها. المنصة تعمل كوسيط، ولا نتحمل المسؤولية المباشرة عن جودة المحاصيل الموردة من طرف ثالث، رغم حرصنا الشديد على مراقبة الجودة.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>
                Welcome to "WashAlafas". By using our website, you agree to be bound by the following terms and conditions.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>1. Acceptance of Terms</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                By accessing and using the "WashAlafas" platform, you agree to be bound by these terms and conditions and all applicable laws and regulations. If you disagree with any part of these terms, you may not use our service.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>2. Products and Pricing</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                We strive to ensure the accuracy of product information and prices. However, we reserve the right to modify prices, available quantities, or cancel orders in case of errors or market changes without prior notice.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>3. Orders and Delivery</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                Delivery times depend on location and product availability. We are not liable for delays beyond our control. Products must be inspected upon delivery to ensure quality and order accuracy.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>4. Return and Refund Policy</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                Due to the nature of our products (fresh fruits and vegetables), please inspect items upon delivery. Return requests will not be accepted after a period that exposes the products to spoilage.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>5. Supplier Obligations (B2B)</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                Suppliers must provide products that meet the agreed quality standards. The platform acts as an intermediary, and we do not bear direct responsibility for the quality of crops supplied by a third party, despite our strict quality control.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
