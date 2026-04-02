import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar, DashboardHeader } from "./shared";
import "./dashboard.css";

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
      <div className="dashboard-layout">
        {isMobileMenuOpen && (
          <div className="dashboard-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <div className={`dashboard-sidebar-wrapper ${isMobileMenuOpen ? "dashboard-sidebar-wrapper--open" : ""}`}>
          <DashboardSidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((p) => !p)}
          />
        </div>

        <div className="dashboard-main">
          <DashboardHeader
            onMobileMenuToggle={() => setIsMobileMenuOpen((p) => !p)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <div className="dashboard-content">
            <Outlet />
          </div>
        </div>
      </div>
  );
}
