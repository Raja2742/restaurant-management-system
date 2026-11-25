
import api from "./api";

// ==================== TABLES ====================

// 1. Get all tables
export const getTables = async () => {
  const response = await api.get("/admin/tables");
  return response.data;
};

// 2. Get a specific table
export const getTableById = async (tableId) => {
  const response = await api.get(`/admin/tables/${tableId}`);
  return response.data;
};

// 3. Create a table
export const createTable = async (tableData) => {
  const response = await api.post("/admin/tables", tableData);
  return response.data;
};

// 4. Update a table
export const updateTable = async (tableId, tableData) => {
  const response = await api.put(`/admin/tables/${tableId}`, tableData);
  return response.data;
};

// 5. Delete a table
export const deleteTable = async (tableId) => {
  const response = await api.delete(`/admin/tables/${tableId}`);
  return response.data;
};

// ==================== CATEGORIES ====================

// 6. Get all categories
export const getCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data;
};

// 7. Create a category
export const createCategory = async (categoryData) => {
  const response = await api.post("/admin/categories", categoryData);
  return response.data;
};

// 8. Update a category
export const updateCategory = async (categoryId, categoryData) => {
  const response = await api.put(
    `/admin/categories/${categoryId}`,
    categoryData
  );
  return response.data;
};

// 9. Delete a category
export const deleteCategory = async (categoryId) => {
  const response = await api.delete(`/admin/categories/${categoryId}`);
  return response.data;
};

// ==================== MENU ITEMS ====================

// 10. Get all menu items
export const getMenuItems = async () => {
  const response = await api.get("/admin/menu-items");
  return response.data;
};

// 11. Get a specific menu item
export const getMenuItemById = async (menuItemId) => {
  const response = await api.get(`/admin/menu-items/${menuItemId}`);
  return response.data;
};

// 12. Create a menu item with an image
export const createMenuItem = async (itemData, imageFile) => {
  const formData = new FormData();

  formData.append(
    "item",
    new Blob([JSON.stringify(itemData)], {
      type: "application/json",
    })
  );

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await api.post("/admin/menu-items", formData);
  return response.data;
};

// 13. Update a menu item, optionally replacing its image
export const updateMenuItem = async (menuItemId, itemData, imageFile) => {
  try {

    // Add these two lines here
    // console.log("Item data:", itemData);
    // console.log("JSON data:", JSON.stringify(itemData));

    const formData = new FormData();

    formData.append(
      "item",
      new Blob([JSON.stringify(itemData)], {
        type: "application/json",
      })
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await api.put(
      `/admin/menu-items/${menuItemId}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("UPDATE ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// 14. Delete a menu item
export const deleteMenuItem = async (menuItemId) => {
  const response = await api.delete(`/admin/menu-items/${menuItemId}`);
  return response.data;
};

// ==================== STAFF ====================

// 15. Get all staff
export const getStaff = async () => {
  const response = await api.get("/admin/staff");
  return response.data;
};

// 16. Get a specific staff member
export const getStaffById = async (staffId) => {
  const response = await api.get(`/admin/staff/${staffId}`);
  return response.data;
};

// 17. Create a staff member
export const createStaff = async (staffData) => {
  const response = await api.post("/admin/staff", staffData);
  return response.data;
};

// 18. Update a staff member
export const updateStaff = async (staffId, staffData) => {
  const response = await api.put(`/admin/staff/${staffId}`, staffData);
  return response.data;
};

// 19. Delete a staff member
export const deleteStaff = async (staffId) => {
  const response = await api.delete(`/admin/staff/${staffId}`);
  return response.data;
};

