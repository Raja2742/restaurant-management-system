
import { useState } from "react";

import {
  LayoutDashboard,
  Armchair,
  Tags,
  UtensilsCrossed,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  X,
} from "lucide-react";

import "./AdminSidebar.css";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tables", label: "Tables Management", icon: Armchair },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "menu-items", label: "Menu Management", icon: UtensilsCrossed },
  { id: "staff", label: "Staff Management", icon: Users },
];

function AdminSidebar({
  activeSection = "dashboard",
  onNavigate = () => {},
  onLogout = () => {},
  isOpen = true,
  onClose = () => {},
}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigation = (section) => {
    onNavigate(section);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={[
          "admin-sidebar",
          collapsed ? "admin-sidebar-collapsed" : "",
          isOpen ? "admin-sidebar-open" : "admin-sidebar-closed",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">
            <Store size={24} />
          </div>

          {!collapsed && (
            <div className="admin-brand-text">
              <h2>Restaurant</h2>
              <span>Management</span>
            </div>
          )}

          <button
            type="button"
            className="admin-mobile-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-sidebar-label">
          {!collapsed && "WORKSPACE"}
        </div>

        <nav className="admin-sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={[
                  "admin-nav-item",
                  active ? "admin-nav-item-active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleNavigation(item.id)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={1.9} />

                {!collapsed && <span>{item.label}</span>}

                {active && (
                  <span className="admin-nav-active-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-divider" />

          <button
            type="button"
            className="admin-nav-item admin-logout-button"
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>

          <button
            type="button"
            className="admin-collapse-button"
            onClick={() => setCollapsed((previous) => !previous)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;

