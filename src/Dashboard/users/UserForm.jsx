import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { usersService } from "../../service/api";
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Loader2,
  Lock,
  UserPlus
} from "lucide-react";
import toast from "react-hot-toast";

export default function UserForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "FARMER",
    status: "active",
    password: ""
  });

  useEffect(() => {
    if (isEditing) {
      const loadUser = async () => {
        try {
          const res = await usersService.getById(id);
          if (res.success) {
            const d = res.data;
            setFormData({
              name: d.name || "",
              email: d.email || "",
              phone: d.phone || "",
              role: d.role || "FARMER",
              status: d.status || "active",
              password: "" // Keep empty for security
            });
          }
        } catch (err) {
          toast.error(locale === "ar" ? "فشل تحميل بيانات المستخدم" : "Failed to load user data");
          navigate("/dashboard/users");
        } finally {
          setFetching(false);
        }
      };
      loadUser();
    }
  }, [id, isEditing, locale, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = isEditing 
        ? await usersService.update(id, formData)
        : await usersService.create(formData);

      if (res.success) {
        toast.success(locale === "ar" ? "تم حفظ بيانات المستخدم بنجاح!" : "User data saved successfully!");
        navigate("/dashboard/users");
      }
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
        toast.error(locale === "ar" ? "يرجى تصحيح الأخطاء" : "Please correct the errors");
      } else {
        toast.error(err.message || (locale === "ar" ? "حدث خطأ ما" : "An error occurred"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
        <Loader2 className="animate-spin" size={40} color="#2E7D32" />
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
        <button 
          onClick={() => navigate("/dashboard/users")}
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 12, 
            border: "1px solid #E2E8F0", 
            backgroundColor: "#fff", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            cursor: "pointer",
            color: "#64748B"
          }}
        >
          {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a" }}>
            {isEditing ? (locale === "ar" ? "تعديل المستخدم" : "Edit User") : (locale === "ar" ? "إضافة مستخدم جديد" : "Add New User")}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94A3B8", fontSize: 14 }}>
            <span>{locale === "ar" ? "لوحة التحكم" : "Dashboard"}</span>
            <ChevronRight size={14} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            <span>{locale === "ar" ? "المستخدمين" : "Users"}</span>
            <ChevronRight size={14} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
            <span style={{ color: "#2E7D32", fontWeight: 600 }}>{isEditing ? (locale === "ar" ? "تعديل" : "Edit") : (locale === "ar" ? "إضافة" : "Add")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
        
        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* General Info Panel */}
          <div className="dashboard-panel" style={{ padding: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ padding: 10, borderRadius: 12, backgroundColor: "#E8F5E9", color: "#2E7D32" }}>
                <User size={20} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{locale === "ar" ? "المعلومات الشخصية" : "Personal Information"}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="dashboard-label">{locale === "ar" ? "الاسم الكامل *" : "Full Name *"}</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dashboard-input"
                  placeholder={locale === "ar" ? "مثلاً: أحمد محمد" : "e.g. John Doe"}
                  required
                />
                {errors.name && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.name[0]}</p>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "البريد الإلكتروني *" : "Email Address *"}</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="dashboard-input"
                      style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
                      required
                    />
                  </div>
                  {errors.email && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.email[0]}</p>}
                </div>
                <div>
                  <label className="dashboard-label">{locale === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="dashboard-input"
                      style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="dashboard-label">
                  {isEditing ? (locale === "ar" ? "تغيير كلمة المرور (اختياري)" : "Change Password (Optional)") : (locale === "ar" ? "كلمة المرور *" : "Password *")}
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="dashboard-input"
                    style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
                    required={!isEditing}
                  />
                </div>
                {errors.password && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{errors.password[0]}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* Role & Status Panel */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{locale === "ar" ? "الصلاحيات والحالة" : "Role & Status"}</h3>
            
            <div style={{ marginBottom: 20 }}>
               <label className="dashboard-label">{locale === "ar" ? "دور المستخدم" : "User Role"}</label>
               <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                className="dashboard-input"
               >
                 <option value="ADMIN">{locale === "ar" ? "مدير نظام" : "Admin"}</option>
                 <option value="FARMER">{locale === "ar" ? "مزارع" : "Farmer"}</option>
                 <option value="TRADER">{locale === "ar" ? "تاجر" : "Trader"}</option>
                 <option value="COMPANY">{locale === "ar" ? "منشأة / شركة" : "Company"}</option>
               </select>
            </div>

            <div style={{ marginBottom: 24 }}>
               <label className="dashboard-label">{locale === "ar" ? "حالة الحساب" : "Account Status"}</label>
               <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="dashboard-input"
               >
                 <option value="active">{locale === "ar" ? "نشط" : "Active"}</option>
                 <option value="inactive">{locale === "ar" ? "غير نشط" : "Inactive"}</option>
                 <option value="suspended">{locale === "ar" ? "محظور" : "Suspended"}</option>
               </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="dashboard-btn dashboard-btn--primary"
              style={{ width: "100%", height: 48, gap: 10 }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> {locale === "ar" ? "حفظ البيانات" : "Save Details"}</>}
            </button>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard/users")}
              className="dashboard-btn dashboard-btn--outline"
              style={{ width: "100%", height: 48, marginTop: 12 }}
            >
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
