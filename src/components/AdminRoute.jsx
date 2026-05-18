import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  // If there's no user, redirect to homepage
  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user.role?.toUpperCase() || "";
  const hasAccess = ["ADMIN", "FARMER", "TRADER", "COMPANY"].includes(role) || 
                   ["admin@admin.com", "admin@gmail.com", "admin@1admin.com"].includes(user.email);

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  // Allow access to nested dashboard routes
  return <Outlet />;
}
