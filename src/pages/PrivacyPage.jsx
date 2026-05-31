import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPage() {
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
          {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>

        <div style={{ lineHeight: 1.9, color: "#4B5563" }}>
          {locale === "ar" ? (
            <>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>
                نحن في "وش الأفص" نولي أهمية كبرى لخصوصيتك ونلتزم بحماية بياناتك الشخصية.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>1. جمع البيانات</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل، وإجراء الطلبات، أو التواصل مع الدعم الفني. يشمل ذلك اسمك، بريدك الإلكتروني، رقم هاتفك، وعنوان التوصيل.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>2. استخدام المعلومات</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                تُستخدم معلوماتك لمعالجة طلباتك وتوصيلها، تحسين تجربتك على المنصة، وإرسال العروض الترويجية في حال موافقتك. لا نقوم ببيع أو تأجير بياناتك لأطراف ثالثة.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>3. أمن البيانات</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                نتخذ إجراءات تقنية وتنظيمية صارمة لحماية بياناتك من الوصول غير المصرح به، التعديل، أو الإفشاء. يتم تشفير بيانات الدفع وفقاً لأعلى معايير الأمان.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>4. حقوق المستخدم</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                لديك الحق في الوصول إلى بياناتك الشخصية، تعديلها، أو طلب حذفها في أي وقت من خلال إعدادات حسابك أو بالتواصل معنا.
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>
                At "WashAlafas", we highly value your privacy and are committed to protecting your personal data.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>1. Data Collection</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                We collect information you provide directly to us when you register, place orders, or contact support. This includes your name, email, phone number, and delivery address.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>2. Use of Information</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                Your information is used to process and deliver your orders, enhance your experience on our platform, and send promotional offers if you opt-in. We do not sell or rent your data to third parties.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>3. Data Security</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                We take strict technical and organizational measures to protect your data from unauthorized access, alteration, or disclosure. Payment data is encrypted according to the highest security standards.
              </p>

              <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1f2937", marginTop: 32, marginBottom: 16 }}>4. User Rights</h2>
              <p style={{ fontSize: 15, marginBottom: 16 }}>
                You have the right to access, modify, or request deletion of your personal data at any time through your account settings or by contacting us.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
