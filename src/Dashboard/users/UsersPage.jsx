import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { Plus, Search, Edit3, Trash2, Users as UsersIcon, Shield, UserCheck, UserX } from "lucide-react";

export default function UsersPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { users, deleteUser, updateUser } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const roles = [
    { en: "all", ar: "الكل" },
    { en: "Admin", ar: "مدير" },
    { en: "Moderator", ar: "مشرف" },
    { en: "Customer", ar: "عميل" },
  ];

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const nameEnMatch = (u.nameEn || u.name || "").toLowerCase().includes(q);
    const nameArMatch = (u.nameAr || u.name || "").toLowerCase().includes(q);
    const emailMatch = (u.email || "").toLowerCase().includes(q);
    
    const matchesSearch = nameEnMatch || nameArMatch || emailMatch;
    const matchesRole = filterRole === "all" || u.roleEn === filterRole || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  const handleToggleStatus = (u) => {
    updateUser(u.id, { status: u.status === "active" ? "banned" : "active" });
  };

  const getRoleBadgeType = (roleEn) => {
    switch (roleEn) {
      case "Admin": return "success";
      case "Moderator": return "info";
      default: return "warning";
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "المستخدمين" : "Users"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? `إجمالي المستخدمين: ${users.length}` : `Total users: ${users.length}`}
          </p>
        </div>
        <button className="dashboard-btn dashboard-btn--primary" onClick={() => navigate("/dashboard/users/add")}>
          <Plus size={18} />
          {locale === "ar" ? "إضافة مستخدم" : "Add User"}
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", maxWidth: 400 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14, pointerEvents: "none" }} />
          <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={locale === "ar" ? "بحث عن مستخدم..." : "Search users..."} className="dashboard-input" style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {roles.map((role) => (
            <button key={role.en} onClick={() => setFilterRole(role.en)} style={{ padding: "8px 16px", borderRadius: 10, border: filterRole === role.en ? "1px solid #2E7D32" : "1px solid #E2E8F0", background: filterRole === role.en ? "rgba(46,125,50,0.08)" : "transparent", color: filterRole === role.en ? "#2E7D32" : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
              {locale === "ar" ? role.ar : role.en}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-panel" style={{ overflowX: "auto" }}>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>{locale === "ar" ? "المستخدم" : "User"}</th>
              <th>{locale === "ar" ? "البريد الإلكتروني" : "Email"}</th>
              <th>{locale === "ar" ? "الهاتف" : "Phone"}</th>
              <th>{locale === "ar" ? "الدور" : "Role"}</th>
              <th>{locale === "ar" ? "الطلبات" : "Orders"}</th>
              <th>{locale === "ar" ? "الحالة" : "Status"}</th>
              <th>{locale === "ar" ? "الإجراءات" : "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: u.status === "active" ? "linear-gradient(135deg, #2E7D32 0%, #14532D 100%)" : "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                      {(u.nameEn || u.nameAr || u.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 1 }}>{locale === "ar" ? (u.nameAr || u.name) : (u.nameEn || u.name)}</p>
                      <p style={{ fontSize: 12, color: "#94A3B8" }}>{locale === "ar" ? u.joinedAr : u.joinedEn}</p>
                    </div>
                  </div>
                </td>
                <td style={{ color: "#64748B" }}>{u.email}</td>
                <td style={{ color: "#64748B", direction: "ltr" }}>{u.phone || "-"}</td>
                <td>
                  <span className={`dashboard-badge dashboard-badge--${getRoleBadgeType(u.roleEn || u.role)}`}>
                    <Shield size={12} style={{ marginRight: isRTL ? 0 : 4, marginLeft: isRTL ? 4 : 0 }} />
                    {locale === "ar" ? (u.roleAr || u.role) : (u.roleEn || u.role)}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{u.ordersCount}</td>
                <td>
                  <span className={`dashboard-badge dashboard-badge--${u.status === "active" ? "success" : "danger"}`} style={{ cursor: "pointer" }} onClick={() => handleToggleStatus(u)}>
                    {u.status === "active" ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "محظور" : "Banned")}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="dashboard-btn dashboard-btn--outline" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => handleToggleStatus(u)} title={u.status === "active" ? (locale === "ar" ? "حظر" : "Ban") : (locale === "ar" ? "تفعيل" : "Activate")}>
                      {u.status === "active" ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button className="dashboard-btn dashboard-btn--outline" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => navigate(`/dashboard/users/edit/${u.id}`)} title={locale === "ar" ? "تعديل" : "Edit"}>
                      <Edit3 size={14} />
                    </button>
                    <button className="dashboard-btn dashboard-btn--danger" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => handleDelete(u.id)} title={locale === "ar" ? "حذف" : "Delete"}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon"><UsersIcon size={36} /></div>
            <h3 className="dashboard-empty-title">{locale === "ar" ? "لا يوجد مستخدمين" : "No users found"}</h3>
            <p className="dashboard-empty-desc">{locale === "ar" ? "لم يتم العثور على مستخدمين مطابقين." : "No users match your search criteria."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
