
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeSection =
    location.pathname.split("/")[2] || "dashboard";

  const handleNavigate = (section) => {
    if (section === "dashboard") {
      navigate("/admin");
    } else {
      navigate(`/admin/${section}`);
    }

    setSidebarOpen(false);
  };

  const handleLogout = () => {
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

      <AdminSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-layout-main">

        <AdminNavbar
          activeSection={activeSection}
          onMenuClick={toggleSidebar}
        />

        <main className="admin-layout-content">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;

