import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

import AdminDataTable from "../../../components/admin/AdminDataTable";
import AdminSearchFilter from "../../../components/admin/AdminSearchFilter";
import AdminModal from "../../../components/admin/AdminModal";
import AdminConfirmationModal from "../../../components/admin/AdminConfirmationModal";
import AdminToast from "../../../components/admin/AdminToast";

import {
getCategories,
createCategory,
updateCategory,
deleteCategory,
} from "../../../services/adminService";

import "./CategoriesManagement.css";

const INITIAL_FORM = {
name: "",
description: "",
active: true,
};

function CategoriesManagement() {
const [categories, setCategories] = useState([]);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [deleting, setDeleting] = useState(false);

const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");

const [isModalOpen, setIsModalOpen] = useState(false);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

const [modalMode, setModalMode] = useState("create");
const [selectedCategory, setSelectedCategory] = useState(null);

const [formData, setFormData] = useState(INITIAL_FORM);

const [toast, setToast] = useState({
isOpen: false,
type: "success",
message: "",
});

// -------------------- TOAST --------------------

const showToast = (type, message) => {
setToast({
isOpen: true,
type,
message,
});
};

// -------------------- FETCH CATEGORIES --------------------

const fetchCategories = async (showLoader = true) => {
try {
if (showLoader) setLoading(true);


  const response = await getCategories();

  setCategories(Array.isArray(response) ? response : []);
} catch (error) {
  console.error("Failed to fetch categories:", error);

  showToast(
    "error",
    error.response?.data?.message || "Unable to load categories."
  );
} finally {
  if (showLoader) setLoading(false);
}


};

useEffect(() => {
fetchCategories();
}, []);

// -------------------- SEARCH AND FILTER --------------------

const filteredCategories = useMemo(() => {
return categories.filter((category) => {
const matchesSearch =
category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
category.description?.toLowerCase().includes(searchTerm.toLowerCase());


  const matchesStatus =
    statusFilter === "ALL" ||
    (statusFilter === "ACTIVE" && category.active === true) ||
    (statusFilter === "INACTIVE" && category.active === false);

  return matchesSearch && matchesStatus;
});


}, [categories, searchTerm, statusFilter]);

// -------------------- FORM HANDLING --------------------

const handleInputChange = (event) => {
const { name, value, type, checked } = event.target;


setFormData((previous) => ({
  ...previous,
  [name]: type === "checkbox" ? checked : value,
}));


};

const resetForm = () => {
setFormData(INITIAL_FORM);
setSelectedCategory(null);
};

const closeFormModal = () => {
if (saving) return;


setIsModalOpen(false);
resetForm();


};

// -------------------- ADD CATEGORY --------------------

const openCreateModal = () => {
resetForm();
setModalMode("create");
setIsModalOpen(true);
};

const handleCreateCategory = async (event) => {
event.preventDefault();


const name = formData.name.trim();
const description = formData.description.trim();

if (!name || !description) {
  showToast("error", "Please enter category name and description.");
  return;
}

const alreadyExists = categories.some(
  (category) => category.name.toLowerCase() === name.toLowerCase()
);

if (alreadyExists) {
  showToast("error", "This category already exists.");
  return;
}

try {
  setSaving(true);

  await createCategory({
    name,
    description,
    active: formData.active,
  });

  setIsModalOpen(false);
  resetForm();

  showToast("success", "Category created successfully!");

  await fetchCategories(false);
} catch (error) {
  console.error("Create category error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Failed to create category."
  );
} finally {
  setSaving(false);
}


};

// -------------------- EDIT CATEGORY --------------------

const openEditModal = (category) => {
setSelectedCategory(category);


setFormData({
  name: category.name || "",
  description: category.description || "",
  active: category.active ?? true,
});

setModalMode("edit");
setIsModalOpen(true);


};

const handleUpdateCategory = async (event) => {
event.preventDefault();


if (!selectedCategory) return;

const name = formData.name.trim();
const description = formData.description.trim();

if (!name || !description) {
  showToast("error", "Please enter category name and description.");
  return;
}

const duplicateCategory = categories.some(
  (category) =>
    category.id !== selectedCategory.id &&
    category.name.toLowerCase() === name.toLowerCase()
);

if (duplicateCategory) {
  showToast("error", "Another category already uses this name.");
  return;
}

try {
  setSaving(true);

  await updateCategory(selectedCategory.id, {
    name,
    description,
    active: formData.active,
  });

  setIsModalOpen(false);
  resetForm();

  showToast("success", "Category updated successfully!");

  await fetchCategories(false);
} catch (error) {
  console.error("Update category error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Failed to update category."
  );
} finally {
  setSaving(false);
}


};

// -------------------- VIEW CATEGORY --------------------

const openViewModal = (category) => {
setSelectedCategory(category);
setIsViewModalOpen(true);
};

// -------------------- DELETE CATEGORY --------------------

const openDeleteModal = (category) => {
setSelectedCategory(category);
setIsDeleteModalOpen(true);
};

const handleDeleteCategory = async () => {
if (!selectedCategory) return;


try {
  setDeleting(true);

  await deleteCategory(selectedCategory.id);

  setIsDeleteModalOpen(false);
  setSelectedCategory(null);

  showToast("success", "Category deleted successfully!");

  await fetchCategories(false);
} catch (error) {
  console.error("Delete category error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Failed to delete category."
  );
} finally {
  setDeleting(false);
}


};

// -------------------- TABLE COLUMNS --------------------

const columns = [
{
key: "name",
header: "Category Name",
accessor: "name",
},
{
key: "description",
header: "Description",
accessor: "description",
render: (row) => row.description || "-",
},
{
key: "active",
header: "Status",
accessor: "active",
render: (row) => (
<span
className={`category-status ${
            row.active ? "category-active" : "category-inactive"
          }`}
>
{row.active ? "Active" : "Inactive"} </span>
),
},
];

// -------------------- ACTIONS --------------------

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
onClick: openDeleteModal,
},
];

// -------------------- RENDER --------------------

return ( <div className="categories-management">


  {/* HEADER */}

  <div className="categories-page-header">
    <div>
      <h1>Categories Management</h1>
      <p>Organize and manage your restaurant menu categories.</p>
    </div>

    <div className="categories-header-actions">
      <button
        className="categories-refresh-button"
        onClick={() => fetchCategories()}
        disabled={loading}
      >
        <RefreshCw size={17} />
        Refresh
      </button>

      <button
        className="categories-add-button"
        onClick={openCreateModal}
      >
        <Plus size={18} />
        Add Category
      </button>
    </div>
  </div>

  {/* SUMMARY */}

  <div className="categories-summary">

    <div className="categories-summary-card">
      <div>
        <span>Total Categories</span>
        <h2>{categories.length}</h2>
      </div>
      <div className="category-summary-icon total-category-icon">
        <span>▦</span>
      </div>
    </div>

    <div className="categories-summary-card">
      <div>
        <span>Active Categories</span>
        <h2>
          {categories.filter((category) => category.active).length}
        </h2>
      </div>
      <div className="category-summary-icon active-category-icon">
        <span>✓</span>
      </div>
    </div>

    <div className="categories-summary-card">
      <div>
        <span>Inactive Categories</span>
        <h2>
          {categories.filter((category) => !category.active).length}
        </h2>
      </div>
      <div className="category-summary-icon inactive-category-icon">
        <span>○</span>
      </div>
    </div>

  </div>

  {/* SEARCH AND FILTER */}

  <AdminSearchFilter
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    searchPlaceholder="Search category name or description..."
    filters={[
      {
        name: "status",
        label: "Status",
        value: statusFilter,
        options: [
          { label: "All Categories", value: "ALL" },
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
        ],
      },
    ]}
    onFilterChange={(name, value) => {
      if (name === "status") setStatusFilter(value);
    }}
    onReset={() => {
      setSearchTerm("");
      setStatusFilter("ALL");
    }}
    showReset={searchTerm !== "" || statusFilter !== "ALL"}
  />

  {/* CATEGORY TABLE */}

  <AdminDataTable
    columns={columns}
    data={filteredCategories}
    loading={loading}
    emptyMessage="No categories found."
    getRowKey={(row) => row.id}
    actions={actions}
  />

  {/* ADD / EDIT MODAL */}

  <AdminModal
    isOpen={isModalOpen}
    onClose={closeFormModal}
    title={
      modalMode === "create" ? "Add New Category" : "Edit Category"
    }
    subtitle={
      modalMode === "create"
        ? "Enter the details for the new category."
        : "Update the category information."
    }
    onSubmit={
      modalMode === "create"
        ? handleCreateCategory
        : handleUpdateCategory
    }
    submitText={
      modalMode === "create" ? "Create Category" : "Update Category"
    }
    loading={saving}
  >
    <div className="category-form">

      <div className="category-form-group">
        <label htmlFor="name">Category Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Example: Main Course"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="category-form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          placeholder="Describe this category..."
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="category-checkbox-group">
        <input
          id="active"
          name="active"
          type="checkbox"
          checked={formData.active}
          onChange={handleInputChange}
        />
        <label htmlFor="active">Active Category</label>
      </div>

    </div>
  </AdminModal>

  {/* VIEW MODAL */}

  <AdminModal
    isOpen={isViewModalOpen}
    onClose={() => {
      setIsViewModalOpen(false);
      setSelectedCategory(null);
    }}
    title="Category Details"
    subtitle="View category information."
    showFooter={false}
  >
    {selectedCategory && (
      <div className="category-details">

        <div>
          <span>Category ID</span>
          <strong>{selectedCategory.id}</strong>
        </div>

        <div>
          <span>Category Name</span>
          <strong>{selectedCategory.name}</strong>
        </div>

        <div>
          <span>Description</span>
          <strong>{selectedCategory.description}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>
            {selectedCategory.active ? "Active" : "Inactive"}
          </strong>
        </div>

      </div>
    )}
  </AdminModal>

  {/* DELETE CONFIRMATION */}

  <AdminConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => {
      if (!deleting) {
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
      }
    }}
    onConfirm={handleDeleteCategory}
    title="Delete Category"
    message="Are you sure you want to delete this category? This action cannot be undone."
    itemName={selectedCategory?.name}
    confirmText="Delete Category"
    cancelText="Cancel"
    loading={deleting}
    variant="danger"
  />

  {/* TOAST */}

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
}

export default CategoriesManagement;
