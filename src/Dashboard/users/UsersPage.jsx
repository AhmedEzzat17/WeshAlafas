import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { usersService } from "../../service/api";
import { 
  Users, 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  UserCheck, 
  UserX, 
  Mail,
  Phone,
  Calendar,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

export default function UsersPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await usersService.getAll();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل المستخدمين" : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await usersService.toggleStatus(id);
      if (res.success) {
        toast.success(locale === "ar" ? "تم تحديث الحالة بنجاح" : "Status updated successfully");
        fetchUsers();
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحديث الحالة" : "Failed to update status");
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      ADMIN: { labelAr: "مدير", labelEn: "Admin", color: "#EF4444", bg: "#FEE2E2" },
      FARMER: { labelAr: "مزارع", labelEn: "Farmer", color: "#2E7D32", bg: "#E8F5E9" },
      TRADER: { labelAr: "تاجر", labelEn: "Trader", color: "#3B82F6", bg: "#DBEAFE" },
      COMPANY: { labelAr: "شركة / منشأة", labelEn: "Company", color: "#8B5CF6", bg: "#EDE9FE" },
    };
    return roles[role] || { labelAr: role, labelEn: role, color: "#64748B", bg: "#F1F5F9" };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "إدارة المستخدمين" : "User Management"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? "إدارة الصلاحيات والمستخدمين المسجلين في المنصة." : "Manage permissions and users registered on the platform."}
          </p>
        </div>
        <button 
          onClick={() => navigate("/dashboard/users/add")}
          className="dashboard-btn dashboard-btn--primary"
        >
          <UserPlus size={18} style={{ marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }} />
          {locale === "ar" ? "إضافة مستخدم" : "Add User"}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
          <input 
            type="text" 
            placeholder={locale === "ar" ? "بحث بالاسم أو البريد..." : "Search by name or email..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-input"
            style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
          />
        </div>
        
        <div style={{ display: "flex", gap: 8 }}>
          {["ALL", "ADMIN", "FARMER", "TRADER"].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                border: roleFilter === role ? "1.5px solid #2E7D32" : "1.5px solid #E2E8F0",
                background: roleFilter === role ? "rgba(46,125,50,0.05)" : "#fff",
                color: roleFilter === role ? "#2E7D32" : "#64748B",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {role === "ALL" ? (locale === "ar" ? "الكل" : "All") : (locale === "ar" ? getRoleBadge(role).labelAr : getRoleBadge(role).labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div style={{ padding: 80, textAlign: "center" }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#2E7D32", borderRadius: "50%", margin: "0 auto 16px" }} />
          <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل المستخدمين..." : "Loading users..."}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {filteredUsers.map(user => (
            <div key={user.id} className="dashboard-panel" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#2E7D32" }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: 8, 
                    fontSize: 11, 
                    fontWeight: 700, 
                    background: getRoleBadge(user.role).bg, 
                    color: getRoleBadge(user.role).color 
                  }}>
                    {locale === "ar" ? getRoleBadge(user.role).labelAr : getRoleBadge(user.role).labelEn}
                  </span>
                  <button style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{user.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 13, marginBottom: 12 }}>
                <Mail size={14} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
              </div>

              <div style={{ display: "flex", gap: 12, borderTop: "1px solid #F1F5F9", paddingTop: 16, marginTop: 12 }}>
                <button 
                  onClick={() => handleToggleStatus(user.id)}
                  style={{ 
                    flex: 1, 
                    padding: "8px", 
                    borderRadius: 8, 
                    border: "none", 
                    background: user.status === "active" ? "#FEF2F2" : "#F0FDF4", 
                    color: user.status === "active" ? "#EF4444" : "#2E7D32", 
                    fontSize: 12, 
                    fontWeight: 700, 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  {user.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                  {user.status === "active" ? (locale === "ar" ? "تعطيل" : "Disable") : (locale === "ar" ? "تفعيل" : "Enable")}
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}
                  className="dashboard-btn dashboard-btn--outline"
                  style={{ flex: 1, padding: "8px", fontSize: 12 }}
                >
                  <Shield size={14} style={{ marginRight: isRTL ? 0 : 6, marginLeft: isRTL ? 6 : 0 }} />
                  {locale === "ar" ? "تعديل البيانات" : "Edit User"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
