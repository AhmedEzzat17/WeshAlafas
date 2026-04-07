import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  // If there's no user, redirect to homepage
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.role?.toUpperCase() || "";
  const isAdmin = role === "ADMIN" || role === "COMPANY" || user.email === "admin@admin.com" || user.email === "admin@gmail.com";
  const isFarmer = role === "FARMER";

  if (!isAdmin && !isFarmer) {
    return <Navigate to="/" replace />;
  }

  // Allow access to nested dashboard routes
  return <Outlet />;
}
