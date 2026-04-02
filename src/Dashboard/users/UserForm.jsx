import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { ArrowRight, ArrowLeft, Save, Users } from "lucide-react";

export default function UserForm() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { getUserById, addUser, updateUser } = useDashboardData();

  const existing = isEditing ? getUserById(id) : null;

  const [form, setForm] = useState(() => {
    if (existing) {
      return {
        nameAr: existing.nameAr || existing.name || "", 
        nameEn: existing.nameEn || existing.name || "",
        email: existing.email || "", phone: existing.phone || "",
        roleEn: existing.roleEn || existing.role || "Customer", 
        roleAr: existing.roleAr || existing.role || "عميل",
      };
    }
    return { nameAr: "", nameEn: "", email: "", phone: "", roleEn: "Customer", roleAr: "عميل" };
  });

  if (isEditing && !existing) {
    navigate("/dashboard/users");
    return null;
  }

  const rolesMap = { Admin: "مدير", Moderator: "مشرف", Customer: "عميل" };

  const handleRoleChange = (e) => {
    const roleEn = e.target.value;
    setForm((p) => ({ ...p, roleEn, roleAr: rolesMap[roleEn] || roleEn }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(form.nameEn || "").trim() && !(form.nameAr || "").trim()) return;
    if (isEditing) {
      updateUser(Number(id), form);
    } else {
      addUser(form);
    }
    navigate("/dashboard/users");
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate("/dashboard/users")} className="dashboard-btn dashboard-btn--outline" style={{ padding: "8px 12px", borderRadius: 10 }}>
          <BackIcon size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {isEditing ? (locale === "ar" ? "تعديل المستخدم" : "Edit User") : (locale === "ar" ? "إضافة مستخدم جديد" : "Add New User")}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {isEditing ? (locale === "ar" ? "قم بتعديل بيانات المستخدم" : "Update user details") : (locale === "ar" ? "أدخل بيانات المستخدم الجديد" : "Enter new user details")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Users size={20} color="#2E7D32" />
              <h3 className="dashboard-panel-title">{locale === "ar" ? "بيانات المستخدم" : "User Details"}</h3>
            </div>
          </div>
          <div className="dashboard-panel-body" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالعربية" : "Arabic Name"} *</label>
                <input className="dashboard-input" value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} placeholder={locale === "ar" ? "مثال: أحمد محمد" : "e.g. أحمد محمد"} required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم بالإنجليزية" : "English Name"} *</label>
                <input className="dashboard-input" value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} placeholder={locale === "ar" ? "مثال: Ahmed Mohamed" : "e.g. Ahmed Mohamed"} required />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "البريد الإلكتروني" : "Email"} *</label>
                <input className="dashboard-input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="user@example.com" required />
              </div>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "رقم الهاتف" : "Phone"}</label>
                <input className="dashboard-input" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+201234567890" dir="ltr" />
              </div>
            </div>
            <div style={{ maxWidth: 300 }}>
              <label className="dashboard-label">{locale === "ar" ? "الدور" : "Role"}</label>
              <select className="dashboard-select" value={form.roleEn} onChange={handleRoleChange}>
                <option value="Admin">{locale === "ar" ? "مدير" : "Admin"}</option>
                <option value="Moderator">{locale === "ar" ? "مشرف" : "Moderator"}</option>
                <option value="Customer">{locale === "ar" ? "عميل" : "Customer"}</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
          <button type="button" className="dashboard-btn dashboard-btn--outline" onClick={() => navigate("/dashboard/users")}>
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button type="submit" className="dashboard-btn dashboard-btn--primary">
            <Save size={18} />
            {isEditing ? (locale === "ar" ? "حفظ التعديلات" : "Save Changes") : (locale === "ar" ? "إضافة المستخدم" : "Add User")}
          </button>
        </div>
      </form>
    </div>
  );
}
