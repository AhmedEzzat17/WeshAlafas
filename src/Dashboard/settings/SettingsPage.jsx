import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import {
  Save,
  Store,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Truck,
  Check,
} from "lucide-react";

const settingsSections = [
  { id: "general", iconComp: Store, labelEn: "General", labelAr: "عام" },
  { id: "appearance", iconComp: Palette, labelEn: "Appearance", labelAr: "المظهر" },
  { id: "notifications", iconComp: Bell, labelEn: "Notifications", labelAr: "الإشعارات" },
  { id: "security", iconComp: Shield, labelEn: "Security", labelAr: "الأمان" },
  { id: "shipping", iconComp: Truck, labelEn: "Shipping", labelAr: "الشحن" },
  { id: "payment", iconComp: CreditCard, labelEn: "Payment", labelAr: "الدفع" },
];

export default function SettingsPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeSection, setActiveSection] = useState("general");
  const [saved, setSaved] = useState(false);

  // General settings state
  const [storeName, setStoreName] = useState("Wash Alafas");
  const [storeEmail, setStoreEmail] = useState("admin@washalafas.com");
  const [storePhone, setStorePhone] = useState("+20 123 456 7890");
  const [storeAddress, setStoreAddress] = useState(
    locale === "ar" ? "123 شارع المزارع، القاهرة" : "123 Farm Street, Cairo"
  );
  const [currency, setCurrency] = useState("EGP");

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [stockAlerts, setStockAlerts] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      style={{
        width: 48,
        height: 26,
        borderRadius: 13,
        background: checked
          ? "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)"
          : "#E2E8F0",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          [checked ? (isRTL ? "left" : "right") : (isRTL ? "right" : "left")]: 3,
          transition: "all 0.2s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">
                  {locale === "ar" ? "اسم المتجر" : "Store Name"}
                </label>
                <input
                  className="dashboard-input"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
              <div>
                <label className="dashboard-label">
                  {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  className="dashboard-input"
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">
                  {locale === "ar" ? "رقم الهاتف" : "Phone"}
                </label>
                <input
                  className="dashboard-input"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                />
              </div>
              <div>
                <label className="dashboard-label">
                  {locale === "ar" ? "العملة" : "Currency"}
                </label>
                <select
                  className="dashboard-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="EGP">{locale === "ar" ? "جنيه مصري (EGP)" : "Egyptian Pound (EGP)"}</option>
                  <option value="USD">{locale === "ar" ? "دولار أمريكي (USD)" : "US Dollar (USD)"}</option>
                  <option value="SAR">{locale === "ar" ? "ريال سعودي (SAR)" : "Saudi Riyal (SAR)"}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="dashboard-label">
                {locale === "ar" ? "العنوان" : "Address"}
              </label>
              <textarea
                className="dashboard-textarea"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case "appearance":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
                {locale === "ar" ? "ألوان العلامة التجارية" : "Brand Colors"}
              </h4>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: locale === "ar" ? "اللون الأساسي" : "Primary", color: "#2E7D32" },
                  { label: locale === "ar" ? "اللون الثانوي" : "Secondary", color: "#14532D" },
                  { label: locale === "ar" ? "لون التمييز" : "Accent", color: "#81C784" },
                  { label: locale === "ar" ? "لون الخلفية" : "Background", color: "#F7F7F7" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      background: "#F8FAFC",
                      borderRadius: 12,
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: item.color,
                        border: "2px solid #fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      }}
                    />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>{item.color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>
                {locale === "ar" ? "الخط" : "Font"}
              </h4>
              <div
                style={{
                  padding: "16px 20px",
                  background: "#F8FAFC",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                }}
              >
                <p style={{ fontSize: 14, color: "#334155" }}>
                  {locale === "ar" ? "Cairo / Inter" : "Inter / Cairo"}
                </p>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>
                  {locale === "ar"
                    ? "الخطوط المستخدمة في واجهة المتجر"
                    : "Fonts used in the store interface"}
                </p>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              {
                checked: emailNotifications,
                onChange: () => setEmailNotifications((p) => !p),
                labelEn: "Email Notifications",
                labelAr: "إشعارات البريد الإلكتروني",
                descEn: "Receive email notifications for important events",
                descAr: "استلم إشعارات بالبريد الإلكتروني للأحداث المهمة",
              },
              {
                checked: orderNotifications,
                onChange: () => setOrderNotifications((p) => !p),
                labelEn: "Order Notifications",
                labelAr: "إشعارات الطلبات",
                descEn: "Get notified when new orders are placed",
                descAr: "احصل على إشعار عند وجود طلبات جديدة",
              },
              {
                checked: marketingEmails,
                onChange: () => setMarketingEmails((p) => !p),
                labelEn: "Marketing Emails",
                labelAr: "رسائل التسويق",
                descEn: "Receive promotional and marketing emails",
                descAr: "استلم رسائل ترويجية وتسويقية",
              },
              {
                checked: stockAlerts,
                onChange: () => setStockAlerts((p) => !p),
                labelEn: "Stock Alerts",
                labelAr: "تنبيهات المخزون",
                descEn: "Get notified when stock is running low",
                descAr: "احصل على تنبيه عند انخفاض المخزون",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 0",
                  borderBottom: idx < 3 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    {locale === "ar" ? item.labelAr : item.labelEn}
                  </p>
                  <p style={{ fontSize: 13, color: "#94A3B8" }}>
                    {locale === "ar" ? item.descAr : item.descEn}
                  </p>
                </div>
                <Toggle checked={item.checked} onChange={item.onChange} />
              </div>
            ))}
          </div>
        );

      case "security":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label className="dashboard-label">
                {locale === "ar" ? "كلمة المرور الحالية" : "Current Password"}
              </label>
              <input className="dashboard-input" type="password" placeholder="••••••••" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">
                  {locale === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                </label>
                <input className="dashboard-input" type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="dashboard-label">
                  {locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                </label>
                <input className="dashboard-input" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div
              style={{
                padding: 20,
                background: "rgba(46,125,50,0.04)",
                borderRadius: 12,
                border: "1px solid rgba(46,125,50,0.1)",
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#2E7D32",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Shield size={16} />
                {locale === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication"}
              </h4>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>
                {locale === "ar"
                  ? "أضف طبقة حماية إضافية لحسابك باستخدام المصادقة الثنائية"
                  : "Add an extra layer of security to your account with 2FA"}
              </p>
              <button className="dashboard-btn dashboard-btn--outline" style={{ fontSize: 13 }}>
                {locale === "ar" ? "تفعيل" : "Enable"}
              </button>
            </div>
          </div>
        );

      case "shipping":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                nameEn: "Standard Delivery",
                nameAr: "التوصيل العادي",
                descEn: "2-5 business days",
                descAr: "2-5 أيام عمل",
                price: "30 EGP",
              },
              {
                nameEn: "Express Delivery",
                nameAr: "التوصيل السريع",
                descEn: "Same day or next day",
                descAr: "نفس اليوم أو اليوم التالي",
                price: "60 EGP",
              },
              {
                nameEn: "Free Shipping",
                nameAr: "شحن مجاني",
                descEn: "Orders above 500 EGP",
                descAr: "للطلبات أكثر من 500 ج.م",
                price: locale === "ar" ? "مجاني" : "Free",
              },
            ].map((method, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 20,
                  background: "#F8FAFC",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(46,125,50,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#2E7D32",
                    }}
                  >
                    <Truck size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>
                      {locale === "ar" ? method.nameAr : method.nameEn}
                    </p>
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                      {locale === "ar" ? method.descAr : method.descEn}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#2E7D32",
                  }}
                >
                  {method.price}
                </span>
              </div>
            ))}
          </div>
        );

      case "payment":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {[
              {
                nameEn: "Credit/Debit Cards",
                nameAr: "بطاقات الائتمان/الخصم",
                descEn: "Visa, Mastercard, AmEx",
                descAr: "فيزا، ماستركارد، أمريكان إكسبريس",
                enabled: true,
              },
              {
                nameEn: "Cash on Delivery",
                nameAr: "الدفع عند الاستلام",
                descEn: "Pay when you receive your order",
                descAr: "ادفع عند استلام الطلب",
                enabled: true,
              },
              {
                nameEn: "Digital Wallets",
                nameAr: "المحافظ الرقمية",
                descEn: "Vodafone Cash, Fawry, InstaPay",
                descAr: "فودافون كاش، فوري، إنستاباي",
                enabled: false,
              },
            ].map((method, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 20,
                  background: "#F8FAFC",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: method.enabled
                        ? "rgba(46,125,50,0.08)"
                        : "rgba(148,163,184,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: method.enabled ? "#2E7D32" : "#94A3B8",
                    }}
                  >
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#334155" }}>
                      {locale === "ar" ? method.nameAr : method.nameEn}
                    </p>
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                      {locale === "ar" ? method.descAr : method.descEn}
                    </p>
                  </div>
                </div>
                <span
                  className={`dashboard-badge dashboard-badge--${method.enabled ? "success" : "warning"}`}
                >
                  {method.enabled
                    ? locale === "ar"
                      ? "مفعّل"
                      : "Enabled"
                    : locale === "ar"
                    ? "معطّل"
                    : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "الإعدادات" : "Settings"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar"
              ? "إدارة إعدادات المتجر والحساب"
              : "Manage store and account settings"}
          </p>
        </div>
        <button
          className="dashboard-btn dashboard-btn--primary"
          onClick={handleSave}
          style={{ gap: 8 }}
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saved
            ? locale === "ar"
              ? "تم الحفظ!"
              : "Saved!"
            : locale === "ar"
            ? "حفظ التغييرات"
            : "Save Changes"}
        </button>
      </div>

      {/* Settings Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 24,
        }}
        className="dashboard-charts-grid"
      >
        {/* Settings Sidebar */}
        <div className="dashboard-panel" style={{ height: "fit-content" }}>
          <div style={{ padding: "12px" }}>
            {settingsSections.map((section) => {
              const Icon = section.iconComp;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: "none",
                    background: isActive ? "rgba(46,125,50,0.08)" : "transparent",
                    color: isActive ? "#2E7D32" : "#64748B",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: isRTL ? "right" : "left",
                  }}
                >
                  <Icon size={18} />
                  {locale === "ar" ? section.labelAr : section.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="dashboard-panel-title">
              {locale === "ar"
                ? settingsSections.find((s) => s.id === activeSection)?.labelAr
                : settingsSections.find((s) => s.id === activeSection)?.labelEn}
            </h3>
          </div>
          <div className="dashboard-panel-body">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
