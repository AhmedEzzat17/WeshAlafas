import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import {
  Save,
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Truck,
  Check,
  Loader2
} from "lucide-react";
import { authService } from "../../service/api";
import toast from "react-hot-toast";

const settingsSections = [
  { id: "profile", iconComp: User, labelEn: "Profile", labelAr: "الملف الشخصي" },
  { id: "appearance", iconComp: Palette, labelEn: "Appearance", labelAr: "المظهر" },
  { id: "notifications", iconComp: Bell, labelEn: "Notifications", labelAr: "الإشعارات" },
  { id: "security", iconComp: Shield, labelEn: "Security", labelAr: "الأمان" },
];

export default function SettingsPage() {
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const isRTL = direction === "rtl";
  const [activeSection, setActiveSection] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile settings state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      let res;
      if (activeSection === "profile") {
        res = await authService.updateProfile({ name, phone, address });
      } else if (activeSection === "security") {
        if (newPassword !== confirmPassword) {
          toast.error(locale === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
          setSaving(false);
          return;
        }
        res = await authService.updatePassword({ 
          current_password: currentPassword, 
          password: newPassword, 
          password_confirmation: confirmPassword 
        });
      } else {
        // For appearance/notifications, we just mock for now
        await new Promise(r => setTimeout(r, 800));
        res = { success: true };
      }

      if (res?.success) {
        toast.success(locale === "ar" ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully");
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Clear security fields if updated
        if (activeSection === "security") {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      }
    } catch (err) {
      toast.error(err.message || (locale === "ar" ? "فشل حفظ التغييرات" : "Failed to save changes"));
    } finally {
      setSaving(false);
    }
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
      case "profile":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 10 }}>
               <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#2E7D32', border: '3px solid #2E7D32' }}>
                  {name?.charAt(0).toUpperCase()}
               </div>
               <div>
                  <h4 style={{ fontSize: 18, fontWeight: 800 }}>{name}</h4>
                  <p style={{ color: '#94A3B8', fontSize: 14 }}>{user?.role}</p>
               </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم الكامل" : "Full Name"}</label>
                <input className="dashboard-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "البريد الإلكتروني" : "Email"}</label>
                <input className="dashboard-input" value={email} disabled style={{ background: '#f8fafc', cursor: 'not-allowed' }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "رقم الهاتف" : "Phone"}</label>
                <input className="dashboard-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "العنوان" : "Address"}</label>
                <input className="dashboard-input" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <label className="dashboard-label">{locale === "ar" ? "كلمة المرور الحالية" : "Current Password"}</label>
              <input className="dashboard-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "كلمة المرور الجديدة" : "New Password"}</label>
                <input className="dashboard-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}</label>
                <input className="dashboard-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
          </div>
        );

      default:
        return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>{locale === "ar" ? "قيد التطوير..." : "Coming Soon..."}</div>;
    }
  };

  return (
    <div className="dashboard-animate-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{locale === "ar" ? "الإعدادات" : "Settings"}</h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>{locale === "ar" ? "إدارة إعدادات المتجر والحساب" : "Manage store and account settings"}</p>
        </div>
        <button className="dashboard-btn dashboard-btn--primary" onClick={handleSave} disabled={saving} style={{ gap: 8, minWidth: 140 }}>
          {saving ? <Loader2 className="animate-spin" size={18} /> : (saved ? <Check size={18} /> : <Save size={18} />)}
          {saving ? (locale === "ar" ? "جاري الحفظ..." : "Saving...") : (saved ? (locale === "ar" ? "تم الحفظ!" : "Saved!") : (locale === "ar" ? "حفظ التغييرات" : "Save Changes"))}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }} className="dashboard-charts-grid">
        <div className="dashboard-panel" style={{ height: "fit-content" }}>
          <div style={{ padding: "12px" }}>
            {settingsSections.map((section) => {
              const Icon = section.iconComp;
              const isActive = activeSection === section.id;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: isActive ? "rgba(46,125,50,0.08)" : "transparent", color: isActive ? "#2E7D32" : "#64748B", fontSize: 14, fontWeight: isActive ? 600 : 500, cursor: "pointer", transition: "all 0.2s ease", textAlign: isRTL ? "right" : "left" }}>
                  <Icon size={18} />
                  {locale === "ar" ? section.labelAr : section.labelEn}
                </button>
              );
            })}
          </div>
        </div>
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="dashboard-panel-title">{locale === "ar" ? settingsSections.find((s) => s.id === activeSection)?.labelAr : settingsSections.find((s) => s.id === activeSection)?.labelEn}</h3>
          </div>
          <div className="dashboard-panel-body">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
