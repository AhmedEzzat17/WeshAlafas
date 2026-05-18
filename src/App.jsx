import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AccountTypePage from "./pages/AccountTypePage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";
import CategoriesPage from "./pages/CategoriesPage";
import FilterPage from "./pages/FilterPage";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";


/* Features (Listings) */
import ListingsPage from "./features/listings/ListingsPage";
import ListingDetailsPage from "./features/listings/ListingDetailsPage";
import MyListingsPage from "./features/listings/MyListingsPage";



/* Dashboard */
import Dashboard from "./Dashboard/Dashboard";
import DashboardHome from "./Dashboard/DashboardHome";
import CategoryForm from "./Dashboard/categories/CategoryForm";
import DashboardProducts from "./Dashboard/products";
import ProductForm from "./Dashboard/products/ProductForm";
import UserForm from "./Dashboard/users/UserForm";
import DashboardSettings from "./Dashboard/settings";
import DashboardCrops from "./Dashboard/crops/CropsPage";
import DashboardOrders from "./Dashboard/orders/OrdersPage";
import OrderDetailsPage from "./Dashboard/orders/OrderDetailsPage";
import DashboardNegotiations from "./Dashboard/negotiations/NegotiationsPage";
import DashboardUsers from "./Dashboard/users/UsersPage";
import DashboardOffers from "./Dashboard/offers/OffersPage";
import OfferForm from "./Dashboard/offers/OfferForm";
import DashboardMyListings from "./Dashboard/listings/MyListingsPage";
import DashboardCategories from "./Dashboard/categories/CategoriesPage";
import DashboardReports from "./Dashboard/reports/ReportsPage";
import DashboardListingForm from "./Dashboard/listings/ListingForm";
import DashboardCropForm from "./Dashboard/crops/CropForm";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CropsProvider>
          <ListingsProvider>
            <CartProvider>
              <DashboardDataProvider>
                <BrowserRouter>
                  <Toaster position="top-center" reverseOrder={false} />
                  <ScrollToTop />
                  <Routes>
                    {/* ===== Dashboard Routes (own layout, no Navbar/Footer) ===== */}
                    <Route path="/dashboard" element={<AdminRoute />}>
                      <Route element={<Dashboard />}>
                        <Route index element={<DashboardHome />} />
                        <Route
                          path="categories"
                          element={<DashboardCategories />}
                        />
                        <Route
                          path="categories/add"
                          element={<CategoryForm />}
                        />
                        <Route
                          path="categories/edit/:id"
                          element={<CategoryForm />}
                        />
                        <Route
                          path="products"
                          element={<DashboardProducts />}
                        />
                        <Route path="products/add" element={<ProductForm />} />
                        <Route
                          path="products/edit/:id"
                          element={<ProductForm />}
                        />
                        <Route path="users" element={<DashboardUsers />} />
                        <Route path="users/add" element={<UserForm />} />
                        <Route path="users/edit/:id" element={<UserForm />} />
                        
                        <Route path="settings" element={<DashboardSettings />} />
                        
                        <Route path="crops" element={<DashboardCrops />} />
                        <Route path="crops/add" element={<DashboardCropForm />} />
                        <Route path="crops/edit/:id" element={<DashboardCropForm />} />
                        
                        <Route path="my-listings" element={<DashboardMyListings />} />
                        <Route path="my-listings/add" element={<DashboardListingForm />} />
                        <Route path="my-listings/edit/:id" element={<DashboardListingForm />} />

                        <Route path="orders" element={<DashboardOrders />} />
                        <Route path="orders/:id" element={<OrderDetailsPage />} />
                        <Route path="negotiations" element={<DashboardNegotiations />} />
                        <Route path="offers" element={<DashboardOffers />} />
                        <Route path="offers/add" element={<OfferForm />} />
                        <Route path="offers/edit/:id" element={<OfferForm />} />
                        <Route path="reports" element={<DashboardReports />} />
                      </Route>
                    </Route>

                    {/* ===== Main Site Routes ===== */}
                    <Route element={<Layout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/product/:id" element={<ProductDetailsPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      
                      {/* Protected Site Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/checkout" element={<CheckoutPage />} />
                      </Route>
                      
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/account-type" element={<AccountTypePage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/products" element={<FilterPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/account" element={<ProfilePage />} />
                      
                      {/* Marketplace for Listings */}
                      {/* <Route path="/listings" element={<ListingsPage />} /> */}
                      <Route path="/listings/:id" element={<ListingDetailsPage />} />
                      
                      <Route path="/privacy" element={<PlaceholderPage titleEn="Privacy Policy" titleAr="سياسة الخصوصية" icon="🔒" />} />
                      <Route path="/terms" element={<PlaceholderPage titleEn="Terms & Conditions" titleAr="الشروط والأحكام" icon="📄" />} />
                      <Route path="*" element={<NotFoundPage />} />
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
