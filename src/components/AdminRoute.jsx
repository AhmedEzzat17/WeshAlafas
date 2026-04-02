import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  // If there's no user or the user is not an admin, redirect to homepage
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If user is admin, allow access to nested dashboard routes
  return <Outlet />;
}
