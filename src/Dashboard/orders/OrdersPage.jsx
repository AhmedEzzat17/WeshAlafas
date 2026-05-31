import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { ordersService } from "../../service/api";
import { getImageUrl } from "../../utils/imageUrl";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Eye,
  Package
} from "lucide-react";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const isRTL = direction === "rtl";
  
  const role = user?.role?.toUpperCase() || "";
  const isFarmer = role === "FARMER";
  const isTrader = role === "TRADER";
  const isAdmin = role === "ADMIN";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersService.getAll();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل الطلبات" : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = (order) => {
    navigate(`/dashboard/orders/${order.id}`);
  };

  const getStatusInfo = (status) => {
    const statuses = {
      PENDING: { 
        labelAr: "في انتظار الدفع", 
        labelEn: "Pending Payment", 
        color: "#F59E0B", 
        bg: "#FEF3C7",
        class: "warning",
        icon: Clock 
      },
      PAID: { 
        labelAr: "تم الدفع", 
        labelEn: "Paid", 
        color: "#10B981", 
        bg: "#D1FADF",
        class: "success",
        icon: CheckCircle2 
      },
      SHIPPED: { 
        labelAr: "تم الشحن", 
        labelEn: "Shipped", 
        color: "#3B82F6", 
        bg: "#DBEAFE",
        class: "info",
        icon: Truck 
      },
      COMPLETED: { 
        labelAr: "مكتمل", 
        labelEn: "Completed", 
        color: "#10B981", 
        bg: "#D1FADF",
        class: "success",
        icon: CheckCircle2 
      },
      CANCELLED: { 
        labelAr: "ملغي", 
        labelEn: "Cancelled", 
        color: "#EF4444", 
        bg: "#FEE2E2",
        class: "danger",
        icon: XCircle 
      },
    };
    return statuses[status] || { labelAr: status, labelEn: status, color: "#6B7280", bg: "#F3F4F6", class: "info", icon: Package };
  };

  const getTitle = (title) => {
    if (!title) return "";
    const arMatch = title.match(/\[ar:(.*?)\]/);
    const enMatch = title.match(/\[en:(.*?)\]/);
    if (arMatch || enMatch) {
      return locale === "ar" ? (arMatch ? arMatch[1] : "") : (enMatch ? enMatch[1] : "");
    }
    return title;
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const orderTitle = getTitle(order.listing?.title).toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) || 
      orderTitle.includes(searchLower) ||
      order.buyer_tenant?.name?.toLowerCase().includes(searchLower) ||
      order.items?.some(item => getTitle(item.listing?.title).toLowerCase().includes(searchLower));
      
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const res = await ordersService.updateStatus(id, newStatus);
      if (res.success) {
        toast.success(locale === "ar" ? "تم تحديث الحالة بنجاح" : "Status updated successfully");
        fetchOrders();
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحديث الحالة" : "Failed to update status");
    }
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
          {isFarmer ? (locale === "ar" ? "إدارة مبيعاتي" : "Sales Management") : 
           isTrader ? (locale === "ar" ? "طلبات الشراء" : "Purchase Orders") :
           (locale === "ar" ? "إدارة الطلبات" : "Orders Management")}
        </h1>
        <p style={{ fontSize: 14, color: "#94A3B8" }}>
          {isFarmer ? (locale === "ar" ? "تابع المبيعات والطلبات الواردة من التجار." : "Track sales and incoming orders from traders.") : 
           isTrader ? (locale === "ar" ? "تابع حالات طلباتك ومشترياتك هنا." : "Track your purchases and order status here.") :
           (locale === "ar" ? "إدارة كافة العمليات التجارية على المنصة." : "Manage all commercial operations on the platform.")}
        </p>
      </div>

      {/* Filters & Search */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 280 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14 }} />
          <input 
            type="text" 
            placeholder={locale === "ar" ? "بحث برقم الطلب أو المنتج..." : "Search by order ID or product..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-input"
            style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["ALL", "PENDING_PAYMENT", "PAID", "SHIPPED"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                border: statusFilter === status ? "1.5px solid #2E7D32" : "1.5px solid #E2E8F0",
                background: statusFilter === status ? "rgba(46,125,50,0.05)" : "#fff",
                color: statusFilter === status ? "#2E7D32" : "#64748B",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {status === "ALL" ? (locale === "ar" ? "الكل" : "All") : (locale === "ar" ? getStatusInfo(status).labelAr : getStatusInfo(status).labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="dashboard-panel" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 80, textAlign: "center" }}>
            <div className="animate-spin" style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#2E7D32", borderRadius: "50%", margin: "0 auto 16px" }} />
            <p style={{ color: "#94A3B8" }}>{locale === "ar" ? "جاري تحميل الطلبات..." : "Loading orders..."}</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>{locale === "ar" ? "رقم الطلب" : "Order ID"}</th>
                  <th>{locale === "ar" ? "المنتج" : "Product"}</th>
                  <th>{locale === "ar" ? "التاريخ" : "Date"}</th>
                  <th>{locale === "ar" ? "الإجمالي" : "Total"}</th>
                  <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th>{locale === "ar" ? "الإجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const status = getStatusInfo(order.status);
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, color: "#1a1a1a", fontSize: 13 }}>
                        #{order.id.split('-')[0].toUpperCase()}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img 
                            src={getImageUrl(order.listing?.image || order.listing?.images?.[0]?.image_path)} 
                            alt="" 
                            style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                          />
                          <div>
                            <p style={{ fontWeight: 600, fontSize: 14 }}>
                              {order.items && order.items.length > 0 
                                ? getTitle(order.items[0].listing?.title) 
                                : getTitle(order.listing?.title)}
                              {order.items?.length > 1 && (
                                <span style={{ marginLeft: 8, background: "#F1F5F9", padding: "2px 6px", borderRadius: 6, fontSize: 10, color: "#475569" }}>
                                  +{order.items.length - 1}
                                </span>
                              )}
                            </p>
                            <p style={{ fontSize: 12, color: "#94A3B8" }}>
                              {order.items && order.items.length > 0 
                                ? (locale === "ar" ? order.items[0].listing?.crop?.name_ar : order.items[0].listing?.crop?.name_en)
                                : (locale === "ar" ? order.listing?.crop?.name_ar : order.listing?.crop?.name_en)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "#64748B", fontSize: 13 }}>
                        {new Date(order.created_at).toLocaleDateString(locale === "ar" ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ fontWeight: 800, color: "#2E7D32" }}>
                        {parseFloat(order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                      </td>
                      <td>
                        <span style={{ 
                          display: "inline-flex", 
                          alignItems: "center", 
                          gap: 6, 
                          padding: "6px 12px", 
                          borderRadius: 20, 
                          fontSize: 12, 
                          fontWeight: 700,
                          background: status.bg,
                          color: status.color
                        }}>
                          <StatusIcon size={14} />
                          {locale === "ar" ? status.labelAr : status.labelEn}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="dashboard-action-btn" 
                          title={locale === "ar" ? "تفاصيل" : "Details"}
                          onClick={() => handleOpenDetails(order)}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, background: "#F8FAFC", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#CBD5E1" }}>
              <ShoppingBag size={32} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
              {locale === "ar" ? "لا توجد طلبات" : "No orders found"}
            </h3>
            <p style={{ color: "#64748b", maxWidth: 320, margin: "0 auto 24px", fontSize: 14 }}>
              {locale === "ar" ? "لم تقم بإجراء أي عمليات شراء بعد. ابدأ بالتسوق الآن!" : "You haven't made any purchases yet. Start shopping now!"}
            </p>
            <button 
              onClick={() => window.location.href = "/products"}
              className="dashboard-btn dashboard-btn--primary"
              style={{ margin: "0 auto" }}
            >
              {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
