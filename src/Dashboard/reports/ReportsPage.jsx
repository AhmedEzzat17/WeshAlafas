import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter,
  PieChart as PieIcon,
  BarChart3,
  Activity
} from "lucide-react";

const COLORS = ["#2E7D32", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function ReportsPage() {
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const { products, loading: dataLoading, stats } = useDashboardData();
  const isRTL = direction === "rtl";
  
  const isAdmin = user?.role === "ADMIN";
  const isFarmer = user?.role === "FARMER";

  // Real stats from context, fallback to 0 or mock if needed for visual
  const summaryStats = [
    { label: locale === "ar" ? "إجمالي المبيعات" : "Total Sales", value: `${parseFloat(stats?.total_sales || 0).toLocaleString()} ج.م`, trend: "+12%", icon: DollarSign, color: "#2E7D32" },
    { label: locale === "ar" ? "الطلبات" : "Orders", value: stats?.total_orders || 0, trend: "+5%", icon: ShoppingBag, color: "#3B82F6" },
    { label: locale === "ar" ? "المزارعين" : "Farmers", value: stats?.active_farmers || 0, trend: "+18%", icon: Users, color: "#F59E0B" },
    { label: locale === "ar" ? "المحاصيل" : "Crops", value: stats?.total_crops || 0, trend: "+2%", icon: Sprout, color: "#EF4444" },
  ];

  const salesData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
  ];

  const categoryData = [
    { name: "Vegetables", value: 400 },
    { name: "Fruits", value: 300 },
    { name: "Grains", value: 300 },
    { name: "Legumes", value: 200 },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "التقارير والتحليلات" : "Reports & Analytics"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? "تحليل أداء أعمالك ونمو المنصة." : "Analyze your business performance and platform growth."}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="dashboard-btn dashboard-btn--outline" style={{ gap: 8 }}>
            <Calendar size={18} />
            {locale === "ar" ? "آخر 30 يوم" : "Last 30 Days"}
          </button>
          <button className="dashboard-btn dashboard-btn--primary" style={{ gap: 8 }}>
            <Download size={18} />
            {locale === "ar" ? "تصدير PDF" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 28 }}>
        {summaryStats.map((stat, i) => (
          <div key={i} className="dashboard-panel" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: stat.trend.startsWith("+") ? "#2E7D32" : "#EF4444", background: stat.trend.startsWith("+") ? "#E8F5E9" : "#FEF2F2", padding: "4px 8px", borderRadius: 6 }}>
                {stat.trend}
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>{stat.label}</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a" }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Sales Trend */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
             <h3 className="dashboard-panel-title">{locale === "ar" ? "اتجاه المبيعات" : "Sales Trend"}</h3>
          </div>
          <div className="dashboard-panel-body" style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
             <h3 className="dashboard-panel-title">{locale === "ar" ? "توزيع الفئات" : "Category Breakdown"}</h3>
          </div>
          <div className="dashboard-panel-body" style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, padding: "0 20px" }}>
               {categoryData.map((cat, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748B" }}>
                   <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                   <span>{cat.name}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
         <div className="dashboard-panel">
            <div className="dashboard-panel-header">
               <h3 className="dashboard-panel-title">{locale === "ar" ? "أفضل المنتجات" : "Top Products"}</h3>
            </div>
            <div className="dashboard-panel-body">
               {[1,2,3].map(i => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#F8FAFC" }} />
                    <div style={{ flex: 1 }}>
                       <p style={{ fontSize: 14, fontWeight: 600 }}>Product Name {i}</p>
                       <p style={{ fontSize: 12, color: "#94A3B8" }}>124 sales</p>
                    </div>
                    <span style={{ fontWeight: 700, color: "#2E7D32" }}>12,400 EGP</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="dashboard-panel">
            <div className="dashboard-panel-header">
               <h3 className="dashboard-panel-title">{locale === "ar" ? "آخر النشاطات" : "Recent Activities"}</h3>
            </div>
            <div className="dashboard-panel-body">
               {[1,2,3].map(i => (
                 <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E7D32", marginTop: 6 }} />
                    <div>
                       <p style={{ fontSize: 13, color: "#1a1a1a" }}>New order placed for <b>Potatoes</b></p>
                       <p style={{ fontSize: 11, color: "#94A3B8" }}>2 hours ago</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
