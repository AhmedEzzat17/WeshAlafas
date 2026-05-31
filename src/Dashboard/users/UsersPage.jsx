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

      {/* Data Table View */}
      {loading ? (
        <div style={{ padding: 80, textAlign: "center" }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#2E7D32", borderRadius: "50%", margin: "0 auto 16px" }} />
          <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل المستخدمين..." : "Loading users..."}</p>
        </div>
      ) : (
        <div className="dashboard-panel" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: isRTL ? "right" : "left" }}>
              <thead style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <tr>
                  <th style={{ padding: "16px 20px", color: "#64748B", fontSize: 13, fontWeight: 700 }}>
                    {locale === "ar" ? "المستخدم" : "User"}
                  </th>
                  <th style={{ padding: "16px 20px", color: "#64748B", fontSize: 13, fontWeight: 700 }}>
                    {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                  </th>
                  <th style={{ padding: "16px 20px", color: "#64748B", fontSize: 13, fontWeight: 700 }}>
                    {locale === "ar" ? "الدور" : "Role"}
                  </th>
                  <th style={{ padding: "16px 20px", color: "#64748B", fontSize: 13, fontWeight: 700 }}>
                    {locale === "ar" ? "الحالة" : "Status"}
                  </th>
                  <th style={{ padding: "16px 20px", color: "#64748B", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
                    {locale === "ar" ? "إجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                      {locale === "ar" ? "لا يوجد مستخدمين" : "No users found"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      style={{ 
                        borderBottom: index !== filteredUsers.length - 1 ? "1px solid #F1F5F9" : "none",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* User Info */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ 
                            width: 40, height: 40, borderRadius: 10, 
                            background: "linear-gradient(135deg, rgba(46,125,50,0.1), rgba(46,125,50,0.05))",
                            color: "#2E7D32", display: "flex", alignItems: "center", justifyContent: "center", 
                            fontSize: 15, fontWeight: 700 
                          }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      
                      {/* Email */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 13 }}>
                          <Mail size={14} />
                          {user.email}
                        </div>
                      </td>

                      {/* Role */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ 
                          padding: "4px 10px", 
                          borderRadius: 8, 
                          fontSize: 11, 
                          fontWeight: 700, 
                          background: getRoleBadge(user.role).bg, 
                          color: getRoleBadge(user.role).color,
                          display: "inline-block"
                        }}>
                          {locale === "ar" ? getRoleBadge(user.role).labelAr : getRoleBadge(user.role).labelEn}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{ 
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 12, fontWeight: 600,
                          color: user.status === "active" ? "#15803D" : "#B91C1C" 
                        }}>
                          <span style={{ 
                            width: 6, height: 6, borderRadius: "50%", 
                            background: user.status === "active" ? "#22C55E" : "#EF4444" 
                          }} />
                          {user.status === "active" ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Disabled")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.status === "active" ? (locale === "ar" ? "تعطيل" : "Disable") : (locale === "ar" ? "تفعيل" : "Enable")}
                            style={{ 
                              width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: user.status === "active" ? "#FEF2F2" : "#F0FDF4", 
                              color: user.status === "active" ? "#EF4444" : "#2E7D32", 
                              transition: "all 0.2s"
                            }}
                          >
                            {user.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          
                          <button 
                            onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}
                            title={locale === "ar" ? "تعديل" : "Edit"}
                            style={{ 
                              width: 32, height: 32, borderRadius: 8, border: "1px solid #E2E8F0", cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: "#fff", color: "#64748B", transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#2E7D32"; e.currentTarget.style.borderColor = "#2E7D32"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                          >
                            <Shield size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
