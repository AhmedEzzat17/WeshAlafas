import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useDashboardData } from "../shared/DashboardDataContext";
import { Plus, Search, Edit3, Trash2, Package, Star, RefreshCw } from "lucide-react";

export default function ProductsPage() {
  const { locale, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const navigate = useNavigate();
  const { products, deleteProduct, loading, fetchListings, categories: apiCategories } = useDashboardData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const allCategories = useMemo(() => {
    const core = [{ en: "all", ar: "الكل" }];
    const fromApi = apiCategories.map(cat => ({
      en: cat.nameEn,
      ar: cat.nameAr,
      slug: cat.slug,
      id: cat.id
    }));
    return [...core, ...fromApi];
  }, [apiCategories]);

  const filteredProducts = products.filter((prod) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = prod.nameEn.toLowerCase().includes(q) || prod.nameAr.includes(searchQuery);
    const matchesCategory = filterCategory === "all" || prod.category === filterCategory || prod.categorySlug === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا المنتج؟" : "Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <style>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>
            {locale === "ar" ? "المنتجات" : "Products"}
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8" }}>
            {locale === "ar" ? `إجمالي المنتجات: ${products.length}` : `Total products: ${products.length}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="dashboard-btn dashboard-btn--outline" onClick={() => fetchListings()} title={locale === "ar" ? "تحديث" : "Refresh"} style={{ padding: "8px 12px", borderRadius: 10 }}>
            <RefreshCw size={18} className={loading ? "spin-icon" : ""} />
          </button>
          <button className="dashboard-btn dashboard-btn--primary" onClick={() => navigate("/dashboard/products/add")}>
            <Plus size={18} />
            {locale === "ar" ? "إضافة منتج" : "Add Product"}
          </button>
        </div>
      </div>



      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1", maxWidth: 400 }}>
          <Search size={18} color="#94A3B8" style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [isRTL ? "right" : "left"]: 14, pointerEvents: "none" }} />
          <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={locale === "ar" ? "بحث عن منتج..." : "Search products..."} className="dashboard-input" style={{ paddingLeft: isRTL ? 16 : 44, paddingRight: isRTL ? 44 : 16 }} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {allCategories.map((cat) => (
            <button key={cat.en} onClick={() => setFilterCategory(cat.en)} style={{ padding: "8px 16px", borderRadius: 10, border: filterCategory === cat.en ? "1px solid #2E7D32" : "1px solid #E2E8F0", background: filterCategory === cat.en ? "rgba(46,125,50,0.08)" : "transparent", color: filterCategory === cat.en ? "#2E7D32" : "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
              {locale === "ar" ? cat.ar : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && products.length === 0 && (
        <div className="dashboard-panel" style={{ padding: "60px 20px", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #E2E8F0", borderTopColor: "#2E7D32", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#94A3B8", fontSize: 14 }}>{locale === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</p>
        </div>
      )}

      {/* Table */}
      {(!loading || products.length > 0) && (
        <div className="dashboard-panel" style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>{locale === "ar" ? "المنتج" : "Product"}</th>
                <th>{locale === "ar" ? "الصنف" : "Category"}</th>
                <th>{locale === "ar" ? "السعر" : "Price"}</th>
                <th>{locale === "ar" ? "المخزون" : "Stock"}</th>
                <th>{locale === "ar" ? "التقييم" : "Rating"}</th>
                <th>{locale === "ar" ? "الحالة" : "Status"}</th>
                <th>{locale === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, overflow: "hidden" }}>
                        {product.image && typeof product.image === "string" && product.image.startsWith("http")
                          ? <img src={product.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (product.image || "📦")
                        }
                      </div>
                      <span style={{ fontWeight: 600 }}>{locale === "ar" ? product.nameAr : product.nameEn}</span>
                    </div>
                  </td>
                  <td>
                    <span className="dashboard-badge dashboard-badge--info">{locale === "ar" ? product.categoryAr : product.categoryEn}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{product.price.toFixed(2)} {locale === "ar" ? "ج.م" : "EGP"}</td>
                  <td>
                    <span style={{ color: product.stock > 50 ? "#2E7D32" : product.stock > 0 ? "#F9A825" : "#DC2626", fontWeight: 600 }}>{product.stock}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star size={14} color="#F9A825" fill="#F9A825" />
                      <span style={{ fontWeight: 600 }}>{product.rating}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`dashboard-badge dashboard-badge--${product.status === "active" ? "success" : "danger"}`}>
                      {product.status === "active" ? (locale === "ar" ? "متاح" : "In Stock") : (locale === "ar" ? "نفذ" : "Out of Stock")}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="dashboard-btn dashboard-btn--outline" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => navigate(`/dashboard/products/edit/${product.id}`)} title={locale === "ar" ? "تعديل" : "Edit"}>
                        <Edit3 size={14} />
                      </button>
                      <button className="dashboard-btn dashboard-btn--danger" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => handleDelete(product.id)} title={locale === "ar" ? "حذف" : "Delete"}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && !loading && (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon"><Package size={36} /></div>
              <h3 className="dashboard-empty-title">{locale === "ar" ? "لا توجد منتجات" : "No products found"}</h3>
              <p className="dashboard-empty-desc">{locale === "ar" ? "لم يتم العثور على منتجات مطابقة." : "No products match your search criteria."}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
