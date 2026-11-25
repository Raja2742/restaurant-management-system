import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  ChefHat,
  UserRound,
  Wallet,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";

import AdminStats from "../../../components/admin/AdminStats";
import AdminSearchFilter from "../../../components/admin/AdminSearchFilter";
import AdminDataTable from "../../../components/admin/AdminDataTable";
import AdminModal from "../../../components/admin/AdminModal";
import AdminConfirmationModal from "../../../components/admin/AdminConfirmationModal";
import AdminToast from "../../../components/admin/AdminToast";

import {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../../services/adminService";

import "./StaffManagement.css";

const ROLES = ["ADMIN", "KITCHEN", "WAITER", "CASHIER"];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "WAITER",
};

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const [toast, setToast] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setToast({
      isOpen: true,
      type,
      message,
    });
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaff();
      setStaff(data);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      showToast("error", "Unable to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        member.name?.toLowerCase().includes(search) ||
        member.email?.toLowerCase().includes(search) ||
        member.phone?.includes(search);

      const matchesRole =
        !roleFilter || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [staff, searchTerm, roleFilter]);

  const roleCounts = useMemo(() => {
    return {
      ADMIN: staff.filter((s) => s.role === "ADMIN").length,
      KITCHEN: staff.filter((s) => s.role === "KITCHEN").length,
      WAITER: staff.filter((s) => s.role === "WAITER").length,
      CASHIER: staff.filter((s) => s.role === "CASHIER").length,
    };
  }, [staff]);

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData(emptyForm);
    setShowPassword(false);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaff(member);

    setFormData({
      name: member.name || "",
      email: member.email || "",
      password: "",
      phone: member.phone || "",
      role: member.role || "WAITER",
    });

    setShowPassword(false);
    setModalOpen(true);
  };

  const openViewModal = (member) => {
    setSelectedStaff(member);
    setViewOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.name.trim().length < 2) {
      showToast("error", "Name must contain at least 2 characters");
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      showToast("error", "Enter a valid email address");
      return false;
    }

    if (!editingStaff && formData.password.length < 6) {
      showToast("error", "Password must contain at least 6 characters");
      return false;
    }

    if (
      editingStaff &&
      formData.password &&
      formData.password.length < 6
    ) {
      showToast("error", "Password must contain at least 6 characters");
      return false;
    }

    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      showToast("error", "Enter a valid 10-digit Indian phone number");
      return false;
    }

    if (!ROLES.includes(formData.role)) {
      showToast("error", "Select a valid staff role");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingStaff) {
        await updateStaff(editingStaff.id, payload);
        showToast("success", "Staff member updated successfully");
      } else {
        await createStaff(payload);
        showToast("success", "Staff member added successfully");
      }

      setModalOpen(false);
      setFormData(emptyForm);
      setEditingStaff(null);

      await fetchStaff();
    } catch (error) {
      console.error("Failed to save staff:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to save staff member"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (member) => {
    setStaffToDelete(member);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!staffToDelete) return;

    try {
      setLoading(true);

      await deleteStaff(staffToDelete.id);

      showToast("success", "Staff member deleted successfully");

      setDeleteOpen(false);
      setStaffToDelete(null);

      await fetchStaff();
    } catch (error) {
      console.error("Failed to delete staff:", error);

      showToast(
        "error",
        error.response?.data?.message || "Failed to delete staff member"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "STAFF MEMBER",
      render: (row) => (
        <div className="staff-name-cell">
          <div className="staff-avatar">
            {row.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <div className="staff-name">{row.name}</div>
            <div className="staff-email">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      header: "PHONE",
      accessor: "phone",
    },
    {
      key: "role",
      header: "ROLE",
      render: (row) => (
        <span className={`staff-role-badge ${row.role?.toLowerCase()}`}>
          {row.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "JOINED DATE",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString()
          : "-",
    },
  ];

    const actions = [
    {
        label: "View",
        icon: "view",
        variant: "view",
        onClick: openViewModal,
    },
    {
        label: "Edit",
        icon: "edit",
        variant: "edit",
        onClick: openEditModal,
    },
    {
        label: "Delete",
        icon: "delete",
        variant: "delete",
        onClick: confirmDelete,
    },
];

  return (
    <div className="staff-management">

      {/* Header */}
      <div className="staff-page-header">
        <div>
          <h1>Staff Management</h1>
          <p>Manage your restaurant team and their roles.</p>
        </div>

        <button className="staff-add-btn" onClick={openAddModal}>
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Statistics */}
      <div className="staff-stats-grid">
        <div className="staff-stat-card">
          <div className="staff-stat-icon blue">
            <Users size={22} />
          </div>
          <div>
            <span>Total Staff</span>
            <h2>{staff.length}</h2>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon purple">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span>Admins</span>
            <h2>{roleCounts.ADMIN}</h2>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon orange">
            <ChefHat size={22} />
          </div>
          <div>
            <span>Kitchen</span>
            <h2>{roleCounts.KITCHEN}</h2>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon green">
            <UserRound size={22} />
          </div>
          <div>
            <span>Waiters</span>
            <h2>{roleCounts.WAITER}</h2>
          </div>
        </div>

        <div className="staff-stat-card">
          <div className="staff-stat-icon yellow">
            <Wallet size={22} />
          </div>
          <div>
            <span>Cashiers</span>
            <h2>{roleCounts.CASHIER}</h2>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="staff-filter-section">
        <AdminSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by name, email or phone..."
          filters={[
            {
              name: "role",
              label: "All Roles",
              value: roleFilter,
              options: ROLES.map((role) => ({
                label: role,
                value: role,
              })),
            },
          ]}
          onFilterChange={(name, value) => setRoleFilter(value)}
          onReset={() => {
            setSearchTerm("");
            setRoleFilter("");
          }}
          showReset={Boolean(searchTerm || roleFilter)}
        />
      </div>

      {/* Staff table */}
      <div className="staff-table-section">
        <div className="staff-table-heading">
          <div>
            <h2>Team Members</h2>
            <p>{filteredStaff.length} staff members found</p>
          </div>
        </div>

        <AdminDataTable
          columns={columns}
          data={filteredStaff}
          loading={loading}
          emptyMessage="No staff members found."
          getRowKey={(row) => row.id}
          actions={actions}
        />
      </div>

      {/* Add/Edit modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStaff ? "Edit Staff Member" : "Add Staff Member"}
        subtitle={
          editingStaff
            ? "Update the staff member's information."
            : "Enter the details of the new staff member."
        }
        onSubmit={handleSubmit}
        submitText={editingStaff ? "Update Staff" : "Create Staff"}
        loading={loading}
        size="medium"
      >
        <div className="staff-form">

          <div className="staff-form-group">
            <label>Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="staff-form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="staff-form-group">
            <label>
              Password {editingStaff ? "(Optional)" : "*"}
            </label>

            <div className="staff-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={
                  editingStaff
                    ? "Leave blank to keep existing password"
                    : "Enter password"
                }
                required={!editingStaff}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="staff-form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />
          </div>

          <div className="staff-form-group">
            <label>Staff Role *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

        </div>
      </AdminModal>

      {/* View modal */}
      <AdminModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title="Staff Details"
        subtitle="Staff member information"
        showFooter={false}
        size="medium"
      >
        {selectedStaff && (
          <div className="staff-view-details">
            <div className="staff-view-avatar">
              {selectedStaff.name?.charAt(0).toUpperCase()}
            </div>

            <h2>{selectedStaff.name}</h2>

            <span className={`staff-role-badge ${selectedStaff.role?.toLowerCase()}`}>
              {selectedStaff.role}
            </span>

            <div className="staff-detail-row">
              <span>Email</span>
              <strong>{selectedStaff.email}</strong>
            </div>

            <div className="staff-detail-row">
              <span>Phone</span>
              <strong>{selectedStaff.phone}</strong>
            </div>

            <div className="staff-detail-row">
              <span>Joined</span>
              <strong>
                {selectedStaff.createdAt
                  ? new Date(selectedStaff.createdAt).toLocaleString()
                  : "-"}
              </strong>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete confirmation */}
      <AdminConfirmationModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        itemName={staffToDelete?.name}
        confirmText="Delete Staff"
        loading={loading}
        variant="danger"
      />

      {/* Toast */}
      <AdminToast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() =>
          setToast((previous) => ({
            ...previous,
            isOpen: false,
          }))
        }
      />

    </div>
  );
};

export default StaffManagement;