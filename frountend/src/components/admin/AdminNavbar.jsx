
import {
  Bell,
  ChevronRight,
  Search,
  Settings,
  UserRound,
  LogOut,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

const PAGE_DETAILS = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of your restaurant operations",
  },
  tables: {
    title: "Tables Management",
    description: "Manage restaurant tables and seating",
  },
  categories: {
    title: "Menu Categories",
    description: "Organize your restaurant menu",
  },
  "menu-items": {
    title: "Menu Management",
    description: "Manage dishes, prices, and availability",
  },
  staff: {
    title: "Staff Management",
    description: "Manage your restaurant team",
  },
};

function AdminNavbar({
  activeSection = "dashboard",
  adminName,
  adminEmail,
  onSearch = () => {},
  onNotifications = () => {},
  onProfile = () => {},
  onSettings = () => {},
  onLogout,
  onMenuClick,
}) {
  const navigate = useNavigate();

  const currentPage =
    PAGE_DETAILS[activeSection] || PAGE_DETAILS.dashboard;

  const getStoredUser = () => {
    try {
      const rawUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user");

      return rawUser ? JSON.parse(rawUser) : {};
    } catch {
      return {};
    }
  };

  const storedUser = getStoredUser();

  const displayName =
    adminName ||
    storedUser.name ||
    storedUser.fullName ||
    storedUser.username ||
    "Administrator";

  const displayEmail =
    adminEmail ||
    storedUser.email ||
    "";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <header className="admin-navbar">

      {/* Hamburger Menu */}
      <button
        type="button"
        className="admin-menu-toggle"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <Menu size={22} />
      </button>

      <div className="admin-navbar-heading">
        <div className="admin-navbar-breadcrumb">
          <span>Restaurant</span>
          <ChevronRight size={14} />
          <span className="admin-breadcrumb-current">
            {currentPage.title}
          </span>
        </div>

        <div className="admin-navbar-title-row">
          <div>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.description}</p>
          </div>
        </div>
      </div>

      <div className="admin-navbar-actions">
        <button
          type="button"
          className="admin-navbar-icon-button"
          onClick={onSearch}
          aria-label="Search"
          title="Search"
        >
          <Search size={19} />
        </button>

        <button
          type="button"
          className="admin-navbar-icon-button admin-notification-button"
          onClick={onNotifications}
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="admin-navbar-divider" />

        <button
          type="button"
          className="admin-navbar-profile"
          onClick={onProfile}
          aria-label="Open admin profile"
          title={displayEmail || displayName}
        >
          <div className="admin-profile-avatar">
            <UserRound size={21} />
          </div>

          <div className="admin-profile-details">
            <strong>{displayName}</strong>
            <span>{displayEmail || "Administrator"}</span>
          </div>
        </button>

        <button
          type="button"
          className="admin-navbar-icon-button admin-settings-button"
          onClick={onSettings}
          aria-label="Settings"
          title="Settings"
        >
          <Settings size={19} />
        </button>

        <button
          type="button"
          className="admin-navbar-icon-button"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;

