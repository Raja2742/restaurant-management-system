import { useEffect, useMemo, useState } from "react";

import {
getMenuItems,
getMenuItemById,
createMenuItem,
updateMenuItem,
deleteMenuItem,
getCategories,
} from "../../../services/adminService";

import {
getImageUrl,
handleFoodImageError,
} from "../../../utils/imageUtils";

import AdminSearchFilter from "../../../components/admin/AdminSearchFilter";
import AdminDataTable from "../../../components/admin/AdminDataTable";
import AdminModal from "../../../components/admin/AdminModal";
import AdminConfirmationModal from "../../../components/admin/AdminConfirmationModal";
import AdminToast from "../../../components/admin/AdminToast";

import "./MenuManagement.css";

const initialForm = {
name: "",
description: "",
price: "",
categoryId: "",
available: true,
};

const MenuManagement = () => {
const [menuItems, setMenuItems] = useState([]);
const [categories, setCategories] = useState([]);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [searchTerm, setSearchTerm] = useState("");
const [categoryFilter, setCategoryFilter] = useState("");
const [availabilityFilter, setAvailabilityFilter] = useState("");

const [modalOpen, setModalOpen] = useState(false);
const [modalMode, setModalMode] = useState("add");
const [selectedItem, setSelectedItem] = useState(null);

const [form, setForm] = useState(initialForm);
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState("");

const [deleteOpen, setDeleteOpen] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);

const [toast, setToast] = useState({
isOpen: false,
type: "success",
message: "",
});

// Toast
const showToast = (type, message) => {
setToast({
isOpen: true,
type,
message,
});
};

const closeToast = () => {
setToast((prev) => ({
...prev,
isOpen: false,
}));
};

// Fetch menu items and categories
const fetchData = async () => {
try {
setLoading(true);


  const [itemsData, categoriesData] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  setMenuItems(Array.isArray(itemsData) ? itemsData : []);
  setCategories(Array.isArray(categoriesData) ? categoriesData : []);
} catch (error) {
  console.error("Failed to fetch menu data:", error);
  showToast("error", "Unable to load menu items.");
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchData();
}, []);

// Search and filters
const filteredItems = useMemo(() => {
return menuItems.filter((item) => {
const search = searchTerm.toLowerCase();


  const matchesSearch =
    item.name?.toLowerCase().includes(search) ||
    item.description?.toLowerCase().includes(search) ||
    item.categoryName?.toLowerCase().includes(search);

  const matchesCategory =
    !categoryFilter ||
    String(item.categoryId) === categoryFilter;

  const matchesAvailability =
    !availabilityFilter ||
    String(item.available) === availabilityFilter;

  return (
    matchesSearch &&
    matchesCategory &&
    matchesAvailability
  );
});


}, [
menuItems,
searchTerm,
categoryFilter,
availabilityFilter,
]);

// Statistics
const availableCount = menuItems.filter(
(item) => item.available
).length;

const unavailableCount = menuItems.length - availableCount;

// Reset form
const resetForm = () => {
if (imagePreview.startsWith("blob:")) {
URL.revokeObjectURL(imagePreview);
}


setForm(initialForm);
setImageFile(null);
setImagePreview("");
setSelectedItem(null);


};

// Add modal
const openAddModal = () => {
resetForm();
setModalMode("add");
setModalOpen(true);
};

// View modal
const openViewModal = async (item) => {
try {
const data = await getMenuItemById(item.id);


  setSelectedItem(data);
  setModalMode("view");
  setModalOpen(true);
} catch (error) {
  console.error(error);
  showToast("error", "Unable to load menu item details.");
}


};

// Edit modal
const openEditModal = async (item) => {
try {
const data = await getMenuItemById(item.id);


  setSelectedItem(data);

  setForm({
    name: data.name || "",
    description: data.description || "",
    price: data.price ?? "",
    categoryId: String(data.categoryId ?? ""),
    available: Boolean(data.available),
  });

  setImageFile(null);
  setImagePreview(data.imageUrl || "");

  setModalMode("edit");
  setModalOpen(true);
} catch (error) {
  console.error(error);
  showToast("error", "Unable to load item for editing.");
}


};

// Close modal
const closeModal = () => {
if (saving) return;


setModalOpen(false);
resetForm();


};

// Handle input changes
const handleChange = (event) => {
const { name, value, type, checked } = event.target;


setForm((prev) => ({
  ...prev,
  [name]: type === "checkbox" ? checked : value,
}));


};

// Handle image selection
const handleImageChange = (event) => {
const file = event.target.files?.[0];


if (!file) return;

if (!file.type.startsWith("image/")) {
  showToast("error", "Please select a valid image file.");
  event.target.value = "";
  return;
}

if (file.size > 5 * 1024 * 1024) {
  showToast("error", "Image size must be less than 5 MB.");
  event.target.value = "";
  return;
}

if (imagePreview.startsWith("blob:")) {
  URL.revokeObjectURL(imagePreview);
}

setImageFile(file);
setImagePreview(URL.createObjectURL(file));


};

// Submit form
const handleSubmit = async (event) => {
event.preventDefault();


if (saving) return;

if (!form.categoryId) {
  showToast("error", "Please select a category.");
  return;
}

if (modalMode === "add" && !imageFile) {
  showToast("error", "Please upload a menu item image.");
  return;
}

const payload = {
  name: form.name.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  categoryId: Number(form.categoryId),
  available: form.available,
};

if (
  !payload.name ||
  !payload.description ||
  !Number.isFinite(payload.price) ||
  payload.price <= 0
) {
  showToast("error", "Please enter valid menu item details.");
  return;
}

try {
  setSaving(true);

  if (modalMode === "add") {
    await createMenuItem(payload, imageFile);

    showToast("success", "Menu item added successfully.");
  } else {
    await updateMenuItem(
      selectedItem.id,
      payload,
      imageFile
    );

    showToast("success", "Menu item updated successfully.");
  }

  setModalOpen(false);
  resetForm();

  await fetchData();
} catch (error) {
  console.error("Failed to save menu item:", error);

  showToast(
    "error",
    error.response?.data?.message ||
      error.response?.data?.error ||
      "Unable to save menu item."
  );
} finally {
  setSaving(false);
}


};

// Delete
const openDeleteModal = (item) => {
setItemToDelete(item);
setDeleteOpen(true);
};

const handleDelete = async () => {
if (!itemToDelete || saving) return;


try {
  setSaving(true);

  await deleteMenuItem(itemToDelete.id);

  setDeleteOpen(false);
  setItemToDelete(null);

  showToast("success", "Menu item deleted successfully.");

  await fetchData();
} catch (error) {
  console.error(error);

  showToast(
    "error",
    error.response?.data?.message ||
      "Unable to delete menu item."
  );
} finally {
  setSaving(false);
}


};

// Reset filters
const resetFilters = () => {
setSearchTerm("");
setCategoryFilter("");
setAvailabilityFilter("");
};

// Table columns
const columns = [
{
key: "item",
header: "MENU ITEM",
render: (row) => ( <div className="menu-item-cell"> <img
         src={getImageUrl(row.imageUrl)}
         alt={row.name}
         className="menu-item-thumbnail"
         onError={handleFoodImageError}
       />


      <div>
        <div className="menu-item-name">
          {row.name}
        </div>

        <div className="menu-item-description">
          {row.description}
        </div>
      </div>
    </div>
  ),
},
{
  key: "categoryName",
  header: "CATEGORY",
  accessor: "categoryName",
},
{
  key: "price",
  header: "PRICE",
  render: (row) => `₹${Number(row.price).toFixed(2)}`,
},
{
  key: "available",
  header: "AVAILABILITY",
  render: (row) => (
    <span
      className={`menu-status ${
        row.available
          ? "menu-status-available"
          : "menu-status-unavailable"
      }`}
    >
      {row.available ? "Available" : "Unavailable"}
    </span>
  ),
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
onClick: openDeleteModal,
},
];

return ( <div className="menu-management">


  {/* Header */}
  <div className="menu-management-header">
    <div>
      <h1>Menu Management</h1>
      <p>
        Manage your restaurant menu items, prices and availability.
      </p>
    </div>

    <button
      className="menu-add-button"
      onClick={openAddModal}
    >
      <span>＋</span>
      Add Menu Item
    </button>
  </div>

  {/* Statistics */}
  <div className="menu-summary">

    <div className="menu-summary-card">
      <span className="menu-summary-icon">🍽️</span>

      <div>
        <p>Total Menu Items</p>
        <h2>{menuItems.length}</h2>
      </div>
    </div>

    <div className="menu-summary-card">
      <span className="menu-summary-icon">✓</span>

      <div>
        <p>Available Items</p>
        <h2>{availableCount}</h2>
      </div>
    </div>

    <div className="menu-summary-card">
      <span className="menu-summary-icon">⊘</span>

      <div>
        <p>Unavailable Items</p>
        <h2>{unavailableCount}</h2>
      </div>
    </div>

  </div>

  {/* Search and filters */}
  <AdminSearchFilter
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    searchPlaceholder="Search menu items..."
    filters={[
      {
        name: "category",
        label: "Category",
        value: categoryFilter,
        options: categories.map((category) => ({
          label: category.name,
          value: String(category.id),
        })),
      },
      {
        name: "availability",
        label: "Availability",
        value: availabilityFilter,
        options: [
          { label: "Available", value: "true" },
          { label: "Unavailable", value: "false" },
        ],
      },
    ]}
    onFilterChange={(name, value) => {
      if (name === "category") {
        setCategoryFilter(value);
      }

      if (name === "availability") {
        setAvailabilityFilter(value);
      }
    }}
    onReset={resetFilters}
    showReset={Boolean(
      searchTerm || categoryFilter || availabilityFilter
    )}
  />

  {/* Data table */}
  <div className="menu-table-container">
    <AdminDataTable
      columns={columns}
      data={filteredItems}
      loading={loading}
      emptyMessage="No menu items found."
      getRowKey={(row) => row.id}
      actions={actions}
    />
  </div>

  {/* Add / Edit / View modal */}
  <AdminModal
    isOpen={modalOpen}
    onClose={closeModal}
    title={
      modalMode === "add"
        ? "Add Menu Item"
        : modalMode === "edit"
        ? "Edit Menu Item"
        : "Menu Item Details"
    }
    subtitle={
      modalMode === "view"
        ? "View menu item information."
        : "Enter the menu item details below."
    }
    onSubmit={
      modalMode === "view" ? undefined : handleSubmit
    }
    submitText={
      modalMode === "add" ? "Add Item" : "Save Changes"
    }
    loading={saving}
    size="large"
    showFooter={modalMode !== "view"}
  >

    {modalMode === "view" ? (

      <div className="menu-view-details">

        <img
          src={getImageUrl(selectedItem?.imageUrl)}
          alt={selectedItem?.name || "Menu item"}
          className="menu-view-image"
          onError={handleFoodImageError}
        />

        <h3>{selectedItem?.name}</h3>

        <p>{selectedItem?.description}</p>

        <div className="menu-view-row">
          <span>Category</span>
          <strong>{selectedItem?.categoryName}</strong>
        </div>

        <div className="menu-view-row">
          <span>Price</span>
          <strong>
            ₹{Number(selectedItem?.price || 0).toFixed(2)}
          </strong>
        </div>

        <div className="menu-view-row">
          <span>Availability</span>
          <strong>
            {selectedItem?.available
              ? "Available"
              : "Unavailable"}
          </strong>
        </div>

      </div>

    ) : (

      <div className="menu-form">

        <div className="menu-form-group">
          <label>Item Name *</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter item name"
            maxLength={100}
            required
          />
        </div>

        <div className="menu-form-group">
          <label>Description *</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the menu item"
            rows="3"
            required
          />
        </div>

        <div className="menu-form-row">

          <div className="menu-form-group">
            <label>Price (₹) *</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="menu-form-group">
            <label>Category *</label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Image upload */}
        <div className="menu-form-group">
          <label>
            Menu Item Image {modalMode === "add" ? "*" : ""}
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={modalMode === "add"}
          />

          <small>
            Select an image. Maximum size: 5 MB.
          </small>

          {/* Image preview */}
          {imagePreview && (
            <div className="menu-image-preview">

              <img
                src={
                  imageFile
                    ? imagePreview
                    : getImageUrl(imagePreview)
                }
                alt="Menu item preview"
                onError={handleFoodImageError}
              />

              <div>
                <strong>
                  {imageFile
                    ? imageFile.name
                    : "Current image"}
                </strong>

                <p>
                  {imageFile
                    ? "New image selected"
                    : "Choose another image to replace it"}
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Availability */}
        <label className="menu-availability-checkbox">

          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={handleChange}
          />

          <span>
            Item is available for ordering
          </span>

        </label>

      </div>

    )}

  </AdminModal>

  {/* Delete confirmation */}
  <AdminConfirmationModal
    isOpen={deleteOpen}
    onClose={() => {
      if (!saving) {
        setDeleteOpen(false);
        setItemToDelete(null);
      }
    }}
    onConfirm={handleDelete}
    title="Delete Menu Item"
    message="Are you sure you want to delete this menu item? This action cannot be undone."
    itemName={itemToDelete?.name}
    confirmText="Delete Item"
    loading={saving}
    variant="danger"
  />

  {/* Toast */}
  <AdminToast
    isOpen={toast.isOpen}
    type={toast.type}
    message={toast.message}
    onClose={closeToast}
  />

</div>


);
};

export default MenuManagement;
