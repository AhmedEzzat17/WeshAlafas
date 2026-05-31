import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer/Footer";
import FloatingCart from "../FloatingCart";

/**
 * Layout Component
 * ================
 * Main layout wrapper that includes the Navbar and renders child routes.
 * Used as the parent route element in React Router.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
}
