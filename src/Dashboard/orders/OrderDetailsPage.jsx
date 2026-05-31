import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { ordersService } from "../../service/api";
import { getImageUrl } from "../../utils/imageUrl";
import { 
  ArrowLeft, 
  ArrowRight,
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  CreditCard,
  User,
  MapPin,
  Package,
  Printer,
  Calendar,
  DollarSign,
  Loader2,
  ShoppingCart
} from "lucide-react";
import toast from "react-hot-toast";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { locale, direction } = useLanguage();
  const { user } = useAuth();
  const isRTL = direction === "rtl";
  
  const role = user?.role?.toUpperCase() || "";
  const isFarmer = role === "FARMER";
  const isTrader = role === "TRADER";
  const isAdmin = role === "ADMIN";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await ordersService.getById(id);
      if (res.success) {
        setOrder(res.data);
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحميل تفاصيل الطلب" : "Failed to load order details");
      navigate("/dashboard/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await ordersService.updateStatus(id, newStatus);
      if (res.success) {
        toast.success(locale === "ar" ? "تم تحديث الحالة بنجاح" : "Status updated successfully");
        setOrder({ ...order, status: newStatus });
      }
    } catch (err) {
      toast.error(locale === "ar" ? "فشل تحديث الحالة" : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
      PENDING_PAYMENT: { 
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
      PREPARING: { 
        labelAr: "قيد التجهيز", 
        labelEn: "Preparing", 
        color: "#3B82F6", 
        bg: "#DBEAFE",
        class: "info",
        icon: Package 
      },
      SHIPPED: { 
        labelAr: "تم الشحن", 
        labelEn: "Shipped", 
        color: "#3B82F6", 
        bg: "#DBEAFE",
        class: "info",
        icon: Truck 
      },
      DELIVERED: { 
        labelAr: "تم التوصيل", 
        labelEn: "Delivered", 
        color: "#10B981", 
        bg: "#D1FADF",
        class: "success",
        icon: CheckCircle2 
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

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "60vh", gap: 16 }}>
        <Loader2 className="animate-spin" size={48} color="#2E7D32" />
        <p style={{ color: "#94A3B8", fontWeight: 600 }}>{locale === "ar" ? "جاري تحميل التفاصيل..." : "Loading details..."}</p>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="dashboard-animate-in" style={{ paddingBottom: 60 }}>
      <style>{`
        @media print {
          .no-print, 
          .dashboard-sidebar, 
          .dashboard-header, 
          .dashboard-btn, 
          button {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .dashboard-content {
             padding: 0 !important;
             margin: 0 !important;
          }
          .invoice-container {
            display: block !important;
            width: 100% !important;
            padding: 40px !important;
          }
          .dashboard-animate-in {
            animation: none !important;
          }
        }
        .invoice-container {
          display: none;
        }
      `}</style>

      {/* Header (No Print) */}
      <div className="no-print" style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate("/dashboard/orders")} className="dashboard-btn dashboard-btn--outline" style={{ padding: "8px 12px", borderRadius: 10 }}>
          <BackIcon size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a" }}>
              {locale === "ar" ? `طلب #${order.id.substring(0, 8).toUpperCase()}` : `Order #${order.id.substring(0, 8).toUpperCase()}`}
            </h1>
            {order.items?.length > 1 && (
              <span style={{ background: "#2E7D32", color: "#fff", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 800 }}>
                {order.items.length} {locale === "ar" ? "منتجات" : "Items"}
              </span>
            )}
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 6, 
              padding: "4px 12px", 
              borderRadius: 20, 
              fontSize: 12, 
              fontWeight: 700,
              background: statusInfo.bg,
              color: statusInfo.color
            }}>
              <StatusIcon size={14} />
              {locale === "ar" ? statusInfo.labelAr : statusInfo.labelEn}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar size={14} />
            {new Date(order.created_at).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
        <button className="dashboard-btn dashboard-btn--outline" onClick={() => window.print()} style={{ gap: 8 }}>
          <Printer size={18} />
          {locale === "ar" ? "طباعة الفاتورة" : "Print Invoice"}
        </button>
      </div>

      {/* Dashboard View (No Print) */}
      <div className="no-print" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
        {/* Left: Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Order Items */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, borderBottom: "1px solid #F1F5F9", paddingBottom: 16 }}>
               {locale === "ar" ? "محتويات الطلب" : "Order Items"}
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {(order.items && order.items.length > 0 ? order.items : [order]).map((item, index) => {
                const listing = item.listing || order.listing;
                if (!listing) return null;
                
                return (
                  <div key={item.id || index} style={{ display: "flex", alignItems: "center", gap: 20, paddingBottom: index < (order.items?.length - 1) ? 20 : 0, borderBottom: index < (order.items?.length - 1) ? "1px solid #F8FAFC" : "none" }}>
                    <div style={{ width: 80, height: 80, borderRadius: 12, background: "#F1F5F9", overflow: "hidden", border: "1px solid #E2E8F0", flexShrink: 0 }}>
                        <img src={getImageUrl(listing.image || listing.images?.[0]?.image_path)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{getTitle(listing.title)}</h4>
                        <p style={{ fontSize: 13, color: "#64748B", marginBottom: 6 }}>
                          {locale === "ar" ? listing.crop?.name_ar : listing.crop?.name_en}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 12, background: "#F8FAFC", padding: "2px 8px", borderRadius: 6, fontWeight: 600, color: "#475569" }}>
                            {locale === "ar" ? `الكمية: ${item.quantity || 1}` : `Qty: ${item.quantity || 1}`}
                          </span>
                          <span style={{ fontSize: 12, background: "#F0FDF4", padding: "2px 8px", borderRadius: 6, fontWeight: 700, color: "#166534", display: "flex", alignItems: "center", gap: 4 }}>
                            {parseFloat(item.unit_price || listing.price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                            {item.negotiation && (
                              <span style={{ fontSize: 10, background: "#FEF3C7", color: "#B45309", padding: "0px 4px", borderRadius: 4, fontWeight: 800 }}>
                                {locale === "ar" ? "سعر متفاوض" : "Negotiated"}
                              </span>
                            )}
                          </span>
                        </div>
                    </div>
                    <div style={{ textAlign: isRTL ? "left" : "right" }}>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 2 }}>{locale === "ar" ? "الإجمالي" : "Total"}</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: "#2E7D32" }}>
                          {parseFloat(item.total_price || order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                        </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="dashboard-panel" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>{locale === "ar" ? "ملخص الدفع" : "Payment Summary"}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
               <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                  <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{parseFloat(order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                  <span>{locale === "ar" ? "العمولة" : "Commission"}</span>
                  <span style={{ fontWeight: 600, color: "#EF4444" }}>- {parseFloat(order.commission_amount || 0).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                  <span>{locale === "ar" ? "رسوم الخدمة" : "Service Fee"}</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>0.00 {locale === "ar" ? "ج.م" : "EGP"}</span>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "2px dashed #F1F5F9" }}>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>{locale === "ar" ? "المبلغ الصافي" : "Net Amount"}</span>
                  <div style={{ textAlign: isRTL ? "left" : "right" }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: "#2E7D32" }}>{parseFloat(order.net_amount).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
                    <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{locale === "ar" ? `عبر ${order.payment_method}` : `via ${order.payment_method}`}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Customer & Shipping */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Status Control */}
          {(isFarmer || isAdmin) && order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
            <div className="dashboard-panel" style={{ padding: 20, background: "#F0FDF4", border: "1px solid #DCFCE7" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#166534", marginBottom: 16 }}>{locale === "ar" ? "تحديث حالة الطلب" : "Update Status"}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {order.status === "PENDING_PAYMENT" && (
                  <button disabled={updating} onClick={() => updateOrderStatus("PAID")} className="dashboard-btn dashboard-btn--primary" style={{ width: "100%", gap: 8 }}>
                    {updating ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                    {locale === "ar" ? "تأكيد استلام الدفع" : "Confirm Payment"}
                  </button>
                )}
                {order.status === "PAID" && (
                  <button disabled={updating} onClick={() => updateOrderStatus("SHIPPED")} className="dashboard-btn dashboard-btn--primary" style={{ width: "100%", gap: 8 }}>
                    {updating ? <Loader2 size={18} className="animate-spin" /> : <Truck size={18} />}
                    {locale === "ar" ? "تم الشحن" : "Mark as Shipped"}
                  </button>
                )}
                {order.status === "SHIPPED" && (
                  <button disabled={updating} onClick={() => updateOrderStatus("DELIVERED")} className="dashboard-btn dashboard-btn--primary" style={{ width: "100%", gap: 8 }}>
                    {updating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                    {locale === "ar" ? "تم التوصيل" : "Mark as Delivered"}
                  </button>
                )}
                <button disabled={updating} onClick={() => updateOrderStatus("CANCELLED")} className="dashboard-btn dashboard-btn--outline" style={{ width: "100%", color: "#EF4444", borderColor: "#FEE2E2" }}>
                  {locale === "ar" ? "إلغاء الطلب" : "Cancel Order"}
                </button>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="dashboard-panel" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
               <User size={16} />
               {locale === "ar" ? (isFarmer || isAdmin ? "بيانات المشتري" : "بيانات البائع") : (isFarmer || isAdmin ? "Buyer Details" : "Seller Details")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{isFarmer || isAdmin ? order.buyer_tenant?.name : order.listing?.tenant?.name}</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>{locale === "ar" ? (isFarmer || isAdmin ? "اسم المؤسسة" : "المزرعة") : (isFarmer || isAdmin ? "Tenant Name" : "Farm Name")}</p>
               </div>
               <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{isFarmer || isAdmin ? order.buyer_tenant?.users?.[0]?.name : order.listing?.tenant?.users?.[0]?.name}</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>{locale === "ar" ? "اسم المسؤول" : "Contact Name"}</p>
               </div>
               <div>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{isFarmer || isAdmin ? (order.buyer_tenant?.users?.[0]?.phone || order.contact_phone) : order.listing?.tenant?.users?.[0]?.phone}</p>
                  <p style={{ fontSize: 13, color: "#64748B" }}>{locale === "ar" ? "رقم التواصل" : "Phone"}</p>
               </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="dashboard-panel" style={{ padding: 20 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
               <MapPin size={16} />
               {locale === "ar" ? "عنوان الشحن" : "Shipping Address"}
            </h4>
            <div style={{ background: "#F8FAFC", padding: 16, borderRadius: 12, border: "1px solid #F1F5F9" }}>
               <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.6, fontWeight: 500 }}>
                  {order.shipping_address || (locale === "ar" ? "لم يتم تحديد عنوان" : "No address specified")}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Invoice Section (Print Only) */}
      <div className="invoice-container" style={{ color: "#1a1a1a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 60, borderBottom: "4px solid #2E7D32", paddingBottom: 30 }}>
           <div>
              <div style={{ width: 60, height: 60, borderRadius: 15, background: "#2E7D32", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 15 }}>
                 <ShoppingCart size={32} color="#fff" />
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "#2E7D32", margin: 0 }}>WASH ALAFAS</h1>
              <p style={{ fontSize: 14, color: "#64748B", marginTop: 5 }}>{locale === "ar" ? "منصة التجارة الزراعية الذكية" : "Smart Agri-Trade Platform"}</p>
           </div>
           <div style={{ textAlign: isRTL ? "left" : "right" }}>
              <h2 style={{ fontSize: 40, fontWeight: 900, color: "#E2E8F0", margin: 0, textTransform: "uppercase" }}>{locale === "ar" ? "فاتورة" : "INVOICE"}</h2>
              <p style={{ fontSize: 16, fontWeight: 700, margin: "10px 0 5px" }}>#{order.id.toUpperCase()}</p>
              <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>{new Date(order.created_at).toLocaleDateString(locale === "ar" ? 'ar-EG' : 'en-US', { dateStyle: 'long' })}</p>
           </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 60 }}>
           <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 15, letterSpacing: 1 }}>{locale === "ar" ? "فاتورة من:" : "BILL FROM:"}</h4>
              <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 5px" }}>{order.listing?.tenant?.name || (order.items?.[0]?.listing?.tenant?.name)}</p>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 5px" }}>{order.listing?.tenant?.users?.[0]?.name || (order.items?.[0]?.listing?.tenant?.users?.[0]?.name)}</p>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 5px" }}>{order.listing?.tenant?.users?.[0]?.phone || (order.items?.[0]?.listing?.tenant?.users?.[0]?.phone)}</p>
              <p style={{ fontSize: 14, color: "#475569", margin: "0" }}>{order.listing?.tenant?.users?.[0]?.email || (order.items?.[0]?.listing?.tenant?.users?.[0]?.email)}</p>
           </div>
           <div>
              <h4 style={{ fontSize: 12, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 15, letterSpacing: 1 }}>{locale === "ar" ? "فاتورة إلى:" : "BILL TO:"}</h4>
              <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 5px" }}>{order.buyer_tenant?.name}</p>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 5px" }}>{order.buyer_tenant?.users?.[0]?.name || order.contact_phone}</p>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 15px", fontWeight: 600 }}>{order.shipping_address}</p>
              <p style={{ fontSize: 14, color: "#475569", margin: "0" }}>{order.buyer_tenant?.users?.[0]?.email}</p>
           </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 60 }}>
           <thead>
              <tr style={{ background: "#F8FAFC" }}>
                 <th style={{ textAlign: isRTL ? "right" : "left", padding: "15px 20px", borderBottom: "2px solid #E2E8F0", fontSize: 12, fontWeight: 800, color: "#64748B" }}>{locale === "ar" ? "الوصف" : "DESCRIPTION"}</th>
                 <th style={{ textAlign: "center", padding: "15px 20px", borderBottom: "2px solid #E2E8F0", fontSize: 12, fontWeight: 800, color: "#64748B" }}>{locale === "ar" ? "الكمية" : "QTY"}</th>
                 <th style={{ textAlign: "center", padding: "15px 20px", borderBottom: "2px solid #E2E8F0", fontSize: 12, fontWeight: 800, color: "#64748B" }}>{locale === "ar" ? "السعر" : "PRICE"}</th>
                 <th style={{ textAlign: isRTL ? "left" : "right", padding: "15px 20px", borderBottom: "2px solid #E2E8F0", fontSize: 12, fontWeight: 800, color: "#64748B" }}>{locale === "ar" ? "الإجمالي" : "TOTAL"}</th>
              </tr>
           </thead>
           <tbody>
              {(order.items && order.items.length > 0 ? order.items : [order]).map((item, index) => {
                const listing = item.listing || order.listing;
                if (!listing) return null;

                return (
                  <tr key={item.id || index}>
                    <td style={{ padding: "20px", borderBottom: "1px solid #F1F5F9" }}>
                        <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 5px" }}>{getTitle(listing.title)}</p>
                        <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>{locale === "ar" ? listing.crop?.name_ar : listing.crop?.name_en}</p>
                    </td>
                    <td style={{ textAlign: "center", padding: "20px", borderBottom: "1px solid #F1F5F9", fontWeight: 600 }}>{item.quantity || 1}</td>
                    <td style={{ textAlign: "center", padding: "20px", borderBottom: "1px solid #F1F5F9", fontWeight: 600 }}>{parseFloat(item.unit_price || listing.price).toLocaleString()}</td>
                    <td style={{ textAlign: isRTL ? "left" : "right", padding: "20px", borderBottom: "1px solid #F1F5F9", fontWeight: 800 }}>{parseFloat(item.total_price || order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</td>
                  </tr>
                );
              })}
           </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
           <div style={{ width: 300 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
                 <span style={{ color: "#64748B", fontWeight: 600 }}>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                 <span style={{ fontWeight: 700 }}>{parseFloat(order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #E2E8F0" }}>
                 <span style={{ color: "#64748B", fontWeight: 600 }}>{locale === "ar" ? "الخصم / الرسوم" : "Discount / Fee"}</span>
                 <span style={{ fontWeight: 700 }}>0.00 {locale === "ar" ? "ج.م" : "EGP"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0", background: "#F8FAFC", marginTop: 10 }}>
                 <span style={{ fontSize: 20, fontWeight: 900, padding: "0 10px" }}>{locale === "ar" ? "الإجمالي النهائي" : "GRAND TOTAL"}</span>
                 <span style={{ fontSize: 20, fontWeight: 900, color: "#2E7D32", padding: "0 10px" }}>{parseFloat(order.total_price).toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}</span>
              </div>
           </div>
        </div>

        <div style={{ marginTop: 100, paddingTop: 40, borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
           <p style={{ fontSize: 16, fontWeight: 700, color: "#2E7D32", marginBottom: 10 }}>{locale === "ar" ? "شكراً لتعاملكم معنا!" : "Thank you for your business!"}</p>
           <p style={{ fontSize: 12, color: "#94A3B8" }}>{locale === "ar" ? "هذه الفاتورة تم إنشاؤها إلكترونياً ولا تحتاج لختم." : "This is an electronically generated invoice and does not require a stamp."}</p>
        </div>
      </div>
    </div>
  );
}
