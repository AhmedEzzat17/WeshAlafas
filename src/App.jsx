import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CropsProvider } from "./context/CropsContext";
import { ListingsProvider } from "./context/ListingsContext";
import { DashboardDataProvider } from "./Dashboard/shared/DashboardDataContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ScrollToTop from "./components/ScrollToTop";
import CategoriesPage from "./pages/CategoriesPage";
import FilterPage from "./pages/FilterPage";
import AdminRoute from "./components/AdminRoute";

/* Dashboard */
import Dashboard from "./Dashboard/Dashboard";
import DashboardHome from "./Dashboard/DashboardHome";
import DashboardCategories from "./Dashboard/categories";
import CategoryForm from "./Dashboard/categories/CategoryForm";
import DashboardProducts from "./Dashboard/products";
import ProductForm from "./Dashboard/products/ProductForm";
import DashboardUsers from "./Dashboard/users";
import UserForm from "./Dashboard/users/UserForm";
import DashboardSettings from "./Dashboard/settings";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <CropsProvider>
      <ListingsProvider>
      <CartProvider>
      <DashboardDataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* ===== Dashboard Routes (own layout, no Navbar/Footer) ===== */}
            <Route path="/dashboard" element={<AdminRoute />}>
              <Route element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="categories" element={<DashboardCategories />} />
                <Route path="categories/add" element={<CategoryForm />} />
                <Route path="categories/edit/:id" element={<CategoryForm />} />
                <Route path="products" element={<DashboardProducts />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="users" element={<DashboardUsers />} />
                <Route path="users/add" element={<UserForm />} />
                <Route path="users/edit/:id" element={<UserForm />} />
                <Route path="settings" element={<DashboardSettings />} />
              </Route>
            </Route>

            {/* ===== Main Site Routes ===== */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<FilterPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route
                path="/about"
                element={
                  <PlaceholderPage
                    titleEn="About Us"
                    titleAr="من نحن"
                    icon="ℹ️"
                  />
                }
              />
              <Route
                path="/contact"
                element={
                  <PlaceholderPage
                    titleEn="Contact Us"
                    titleAr="تواصل معنا"
                    icon="✉️"
                  />
                }
              />
              <Route
                path="/account"
                element={
                  <PlaceholderPage
                    titleEn="My Account"
                    titleAr="حسابي"
                    icon="👤"
                  />
                }
              />
              <Route
                path="/privacy"
                element={
                  <PlaceholderPage
                    titleEn="Privacy Policy"
                    titleAr="سياسة الخصوصية"
                    icon="🔒"
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <PlaceholderPage
                    titleEn="Terms & Conditions"
                    titleAr="الشروط والأحكام"
                    icon="📄"
                  />
                }
              />
              <Route
                path="*"
                element={
                  <PlaceholderPage
                    titleEn="Page Not Found"
                    titleAr="الصفحة غير موجودة"
                    icon="🔍"
                  />
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </DashboardDataProvider>
      </CartProvider>
      </ListingsProvider>
      </CropsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
