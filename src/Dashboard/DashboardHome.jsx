import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useDashboardData } from "./shared/DashboardDataContext";
import {
  Package,
  ShoppingBag,
  Users,
  Layers,
  TrendingUp,
  TrendingDown,
  Globe,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* Custom Tooltip */
function CustomTooltip({ active, payload, locale }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "12px 16px",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          border: "1px solid #E2E8F0",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
          {payload[0].payload.name}
        </p>
        <p style={{ fontSize: 14, color: "#2E7D32", fontWeight: 600 }}>
          {payload[0].value.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
        </p>
      </div>
    );
  }
  return null;
}

export default function DashboardHome() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { products, categories, users, cropsLoading } = useDashboardData();

  const [showWebsiteModal, setShowWebsiteModal] = useState(false);

  /* ---- Derive real stats from data ---- */
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalUsers = users.length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const inStockProducts = products.filter((p) => p.status === "active").length;
  const outOfStockProducts = products.filter((p) => p.status === "out_of_stock").length;

  const stats = [
    {
      labelEn: "Total Products",
      labelAr: "إجمالي المنتجات",
      value: totalProducts.toString(),
      changeEn: `${inStockProducts} in stock`,
      changeAr: `${inStockProducts} متاح`,
      trend: inStockProducts >= outOfStockProducts ? "up" : "down",
      icon: Package,
      variant: "revenue",
    },
    {
      labelEn: "Total Value",
      labelAr: "إجمالي القيمة",
      value: `${totalRevenue.toLocaleString()} ${locale === "ar" ? "ج.م" : "EGP"}`,
      changeEn: `From ${totalProducts} products`,
      changeAr: `من ${totalProducts} منتج`,
      trend: "up",
      icon: ShoppingBag,
      variant: "orders",
    },
    {
      labelEn: "Categories",
      labelAr: "الأصناف",
      value: totalCategories.toString(),
      changeEn: totalCategories > 0 ? `${categories.filter(c => c.status === "active").length} active` : "No categories yet",
      changeAr: totalCategories > 0 ? `${categories.filter(c => c.status === "active").length} نشط` : "لا توجد أصناف",
      trend: totalCategories > 0 ? "up" : "down",
      icon: Layers,
      variant: "customers",
    },
    {
      labelEn: "Users",
      labelAr: "المستخدمين",
      value: totalUsers.toString(),
      changeEn: totalUsers > 0 ? `${users.filter(u => u.status === "active").length} active` : "No users yet",
      changeAr: totalUsers > 0 ? `${users.filter(u => u.status === "active").length} نشط` : "لا يوجد مستخدمين",
      trend: totalUsers > 0 ? "up" : "down",
      icon: Users,
      variant: "pending",
    },
  ];

  /* ---- Chart data from real products (top 8 by price) ---- */
  const chartData = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 8)
    .map((p) => ({
      name: locale === "ar" ? (p.nameAr || p.nameEn) : (p.nameEn || p.nameAr),
      price: p.price,
      stock: p.stock,
    }));

  /* ---- Top products (by stock) ---- */
  const topProducts = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5);

  return (
    <div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes modalFade { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: 4,
            }}
          >
            {locale === "ar" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar"
              ? "مرحباً بعودتك! إليك البيانات الحقيقية."
              : "Welcome back! Here's your real data."}
          </p>
        </div>

        {/* Go to Website Button */}
        <button 
          onClick={() => setShowWebsiteModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 12,
            background: "#fff",
            border: "1px solid #E2E8F0",
            color: "#475569",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = "#2E7D32"; e.currentTarget.style.color = "#2E7D32"; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}
        >
          <Globe size={18} />
          {locale === "ar" ? "الذهاب للموقع" : "Go to Website"}
        </button>
      </div>



      {/* Loading State */}
      {cropsLoading && (
        <div style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#2E7D32", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#94A3B8", fontSize: 14 }}>{locale === "ar" ? "جاري تحميل البيانات..." : "Loading data..."}</p>
        </div>
      )}

      {!cropsLoading && (
        <>
          {/* Stat Cards */}
          <div
            className="dashboard-stat-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 20,
              marginBottom: 28,
            }}
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`dashboard-stat-card dashboard-stat-card--${stat.variant} dashboard-animate-in`}
                >
                  <div
                    className={`dashboard-stat-icon dashboard-stat-icon--${stat.variant}`}
                  >
                    <Icon size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#94A3B8",
                        fontWeight: 500,
                        marginBottom: 6,
                      }}
                    >
                      {locale === "ar" ? stat.labelAr : stat.labelEn}
                    </p>
                    <p
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: "#1a1a1a",
                        lineHeight: 1.1,
                        marginBottom: 8,
                      }}
                    >
                      {stat.value}
                    </p>
                    <div
                      className={`dashboard-trend dashboard-trend--${stat.trend}`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      <span style={{ fontSize: 12 }}>
                        {locale === "ar" ? stat.changeAr : stat.changeEn}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div
            className="dashboard-charts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: 20,
              marginBottom: 28,
            }}
          >
            {/* Products Price Chart */}
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <h3 className="dashboard-panel-title">
                    {locale === "ar"
                      ? "أسعار المنتجات"
                      : "Product Prices"}
                  </h3>
                  <p className="dashboard-panel-subtitle">
                    {locale === "ar"
                      ? `أعلى ${chartData.length} منتجات سعراً`
                      : `Top ${chartData.length} products by price`}
                  </p>
                </div>
              </div>
              <div className="dashboard-panel-body" style={{ height: 320 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#2E7D32" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#F1F5F9"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#94A3B8" }}
                        dy={10}
                        interval={0}
                        angle={isRTL ? 0 : -20}
                        textAnchor="end"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#94A3B8" }}
                        orientation={isRTL ? "right" : "left"}
                        dx={isRTL ? 10 : -10}
                      />
                      <Tooltip content={<CustomTooltip locale={locale} />} />
                      <Bar
                        dataKey="price"
                        fill="url(#barGradient)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94A3B8", fontSize: 14 }}>
                    {locale === "ar" ? "لا توجد بيانات لعرضها" : "No data to display"}
                  </div>
                )}
              </div>
            </div>

            {/* Top Products by Stock */}
            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <h3 className="dashboard-panel-title">
                    {locale === "ar" ? "أعلى المنتجات مخزوناً" : "Top Products by Stock"}
                  </h3>
                  <p className="dashboard-panel-subtitle">
                    {locale === "ar"
                      ? "المنتجات الأكثر وفرة في المخزون"
                      : "Products with highest stock levels"}
                  </p>
                </div>
              </div>
              <div style={{ padding: "8px 16px" }}>
                {topProducts.length > 0 ? (
                  topProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "14px 8px",
                        borderBottom:
                          idx < topProducts.length - 1
                            ? "1px solid #F8FAFC"
                            : "none",
                        transition: "background 0.2s ease",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div className={`dashboard-rank-badge dashboard-rank-badge--${idx + 1}`}>
                        #{idx + 1}
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden", flexShrink: 0 }}>
                        {product.image && typeof product.image === "string" && product.image.startsWith("http")
                          ? <img src={product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (product.image || "📦")
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {locale === "ar" ? (product.nameAr || product.nameEn) : (product.nameEn || product.nameAr)}
                        </p>
                        <p style={{ fontSize: 12, color: "#94A3B8" }}>
                          {locale === "ar" ? (product.categoryAr || product.categoryEn) : (product.categoryEn || product.categoryAr)}
                        </p>
                      </div>
                      <div style={{ textAlign: isRTL ? "left" : "right" }}>
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            marginBottom: 2,
                          }}
                        >
                          {product.price.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                        </p>
                        <p style={{ fontSize: 12, color: product.stock > 50 ? "#2E7D32" : product.stock > 0 ? "#F9A825" : "#DC2626" }}>
                          {locale === "ar" ? `المخزون: ${product.stock}` : `Stock: ${product.stock}`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                    {locale === "ar" ? "لا توجد منتجات" : "No products yet"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Overview Table */}
          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h3 className="dashboard-panel-title">
                  {locale === "ar" ? "نظرة عامة على المنتجات" : "Products Overview"}
                </h3>
                <p className="dashboard-panel-subtitle">
                  {locale === "ar"
                    ? `جميع المنتجات (${products.length})`
                    : `All products (${products.length})`}
                </p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              {products.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{locale === "ar" ? "المنتج" : "Product"}</th>
                      <th>{locale === "ar" ? "السعر" : "Price"}</th>
                      <th>{locale === "ar" ? "المخزون" : "Stock"}</th>
                      <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 8).map((product, idx) => (
                      <tr key={product.id}>
                        <td style={{ fontWeight: 600, color: "#94A3B8" }}>{idx + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden", flexShrink: 0 }}>
                              {product.image && typeof product.image === "string" && product.image.startsWith("http")
                                ? <img src={product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : (product.image || "📦")
                              }
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: 14 }}>
                                {locale === "ar" ? (product.nameAr || product.nameEn) : (product.nameEn || product.nameAr)}
                              </p>
                              <p style={{ fontSize: 12, color: "#94A3B8" }}>
                                {locale === "ar" ? (product.categoryAr || product.categoryEn) : (product.categoryEn || product.categoryAr)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {product.price.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                        </td>
                        <td>
                          <span style={{ color: product.stock > 50 ? "#2E7D32" : product.stock > 0 ? "#F9A825" : "#DC2626", fontWeight: 600 }}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`dashboard-badge dashboard-badge--${product.status === "active" ? "success" : "danger"}`}
                          >
                            {product.status === "active"
                              ? (locale === "ar" ? "متاح" : "In Stock")
                              : (locale === "ar" ? "نفذ" : "Out of Stock")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                  <Package size={36} color="#CBD5E1" style={{ marginBottom: 12 }} />
                  <p>{locale === "ar" ? "لا توجد منتجات بعد" : "No products yet"}</p>
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    {locale === "ar" ? "أضف منتجات من صفحة المنتجات" : "Add products from the Products page"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* Confirmation Modal */}
      {showWebsiteModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", padding: 24 }}>
          <div style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: 20, 
            padding: "32px 24px", 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", 
            width: "100%", 
            maxWidth: 400, 
            border: "1px solid #E2E8F0", 
            textAlign: "center",
            animation: "modalFade 0.2s ease-out",
            direction: isRTL ? "rtl" : "ltr",
            fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif"
          }}>
            <div style={{ width: 64, height: 64, backgroundColor: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, color: "#2E7D32", margin: "0 auto" }}>
              <Globe size={32} />
            </div>
            <h3 style={{ fontSize: 22, color: "#1f2937", fontWeight: 800, margin: "0 0 12px" }}>
              {locale === "ar" ? "الذهاب إلى الموقع" : "Go to Website"}
            </h3>
            <p style={{ color: "#64748b", fontSize: 15, margin: "0 0 28px", lineHeight: 1.6 }}>
              {locale === "ar" ? "هل أنت متأكد من الذهاب إلى الموقع الرئيسي؟" : "Are you sure you want to go to the main website?"}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => setShowWebsiteModal(false)} 
                style={{ flex: 1, padding: "12px", borderRadius: 12, color: "#374151", fontWeight: 700, backgroundColor: "#F3F4F6", border: "none", cursor: "pointer" }}
              >
                {locale === "ar" ? "تراجع" : "Cancel"}
              </button>
              <button 
                onClick={() => navigate("/")} 
                style={{ flex: 1, padding: "12px", borderRadius: 12, color: "#ffffff", fontWeight: 700, backgroundColor: "#2E7D32", border: "none", cursor: "pointer" }}
              >
                {locale === "ar" ? "نعم، متأكد" : "Yes, I'm sure"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
