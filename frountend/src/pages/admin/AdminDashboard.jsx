
import { useEffect, useState } from "react";

import AdminStats from "../../components/admin/AdminStats";
import AdminQuickActions from "../../components/admin/AdminQuickActions";

import { getTables, getCategories, getMenuItems, getStaff } from "../../services/adminService";

import { useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

function AdminDashboard({
  onAddTable = () => {},
  onAddCategory = () => {},
  onAddMenuItem = () => {},
  onAddStaff = () => {},
}) {

  const [stats, setStats] = useState({
  totalTables: 0,
  totalCategories: 0,
  totalMenuItems: 0,
  totalStaff: 0,
});

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const getArray = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
};

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await Promise.allSettled([
          getTables(),
          getCategories(),
          getMenuItems(),
          getStaff(),
        ]);

        if (!isMounted) return;

        const [tables, categories, menuItems, staff] = results;

        setStats({
          totalTables:
            tables.status === "fulfilled"
              ? getArray(tables.value).length
              : 0,

          totalCategories:
            categories.status === "fulfilled"
              ? getArray(categories.value).length
              : 0,

          totalMenuItems:
            menuItems.status === "fulfilled"
              ? getArray(menuItems.value).length
              : 0,

          totalStaff:
            staff.status === "fulfilled"
              ? getArray(staff.value).length
              : 0,
        });

        const requestNames = [
          "Tables",
          "Categories",
          "Menu items",
          "Staff",
        ];

        const failedRequests = results
          .map((result, index) => ({
            result,
            name: requestNames[index],
          }))
          .filter(({ result }) => result.status === "rejected");

        if (failedRequests.length > 0) {
          console.error(
            "Dashboard API failures:",
            failedRequests.map(({ name, result }) => ({
              name,
              error: result.reason,
            }))
          );

          setError(
            `Unable to load: ${failedRequests
              .map(({ name }) => name)
              .join(", ")}. Check the console for details.`
          );
        }
              } catch (err) {
                if (!isMounted) return;

                console.error("Dashboard loading error:", err);
                setError("Unable to load dashboard data.");
              } finally {
                if (isMounted) {
                  setLoading(false);
                }
              }
            };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const managementItems = [
    {
      id: "tables",
      title: "Table Management",
      description: "Create, update, and manage restaurant tables.",
      icon: "🪑",
      count: stats.totalTables,
      action: "Manage Tables",
    },
    {
      id: "categories",
      title: "Category Management",
      description: "Organize menu items into categories.",
      icon: "📂",
      count: stats.totalCategories,
      action: "Manage Categories",
    },
    {
      id: "menu-items",
      title: "Menu Management",
      description: "Add dishes, update prices, and manage availability.",
      icon: "🍽️",
      count: stats.totalMenuItems,
      action: "Manage Menu",
    },
    {
      id: "staff",
      title: "Staff Management",
      description: "Manage restaurant employees and their information.",
      icon: "👥",
      count: stats.totalStaff,
      action: "Manage Staff",
    },
  ];

  return (
    <div className="admin-dashboard">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">ADMINISTRATION</span>

          <h1>Dashboard Overview</h1>

          <p>
            Monitor your restaurant and manage its operations from one place.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="dashboard-status-dot" />
          Admin Dashboard
        </div>
      </section>

      {error && (
        <div className="dashboard-error" role="alert">
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Restaurant Overview</h2>
            <p>Your current restaurant statistics</p>
          </div>

          {loading && (
            <span className="dashboard-loading-label">
              Loading statistics...
            </span>
          )}
        </div>

        <AdminStats
          totalTables={stats.totalTables}
          totalCategories={stats.totalCategories}
          totalMenuItems={stats.totalMenuItems}
          totalStaff={stats.totalStaff}
        />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Perform common administrative tasks</p>
          </div>
        </div>

        <AdminQuickActions
          onAddTable={onAddTable}
          onAddCategory={onAddCategory}
          onAddMenuItem={onAddMenuItem}
          onAddStaff={onAddStaff}
        />
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Management Center</h2>
            <p>Choose a section to manage your restaurant</p>
          </div>
        </div>

        <div className="dashboard-management-grid">
          {managementItems.map((item) => (
            <article className="dashboard-management-card" key={item.id}>
              <div className="dashboard-card-top">
                <div className="dashboard-card-icon">{item.icon}</div>

                <span className="dashboard-card-count">
                  {loading ? "..." : item.count}
                </span>
              </div>

              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <button
                className="dashboard-manage-button"
                onClick={() => navigate(`/admin/${item.id}`)}
              >
                {item.action}
                <span aria-hidden="true"> →</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-footer-card">
        <div className="dashboard-footer-icon">💡</div>

        <div>
          <h3>Keep your restaurant updated</h3>
          <p>
            Keep table information, menu categories, dishes, and staff records
            accurate to make restaurant operations smoother.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;

