import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  RefreshCw,
 
  Table2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import AdminDataTable from "../../../components/admin/AdminDataTable";
import AdminSearchFilter from "../../../components/admin/AdminSearchFilter";
import AdminModal from "../../../components/admin/AdminModal";
import AdminConfirmationModal from "../../../components/admin/AdminConfirmationModal";
import AdminToast from "../../../components/admin/AdminToast";

import {
getTables,
getTableById,
createTable,
updateTable,
deleteTable,
} from "../../../services/adminService";

import "./TablesManagement.css";

const INITIAL_FORM = {
tableNumber: "",
capacity: "",
qrCode: "",
};

function TablesManagement() {
const [tables, setTables] = useState([]);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [deleting, setDeleting] = useState(false);

const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");

const [isModalOpen, setIsModalOpen] = useState(false);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);

const [modalMode, setModalMode] = useState("create");
const [selectedTable, setSelectedTable] = useState(null);

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

// -------------------- FETCH TABLES --------------------

const fetchTables = async (showLoader = true) => {
try {
if (showLoader) setLoading(true);


  const response = await getTables();

  setTables(Array.isArray(response) ? response : []);
} catch (error) {
  console.error("Failed to fetch tables:", error);

  showToast(
    "error",
    error.response?.data?.message || "Unable to load tables."
  );
} finally {
  if (showLoader) setLoading(false);
}


};

useEffect(() => {
fetchTables();
}, []);

// -------------------- SEARCH AND FILTER --------------------

const filteredTables = useMemo(() => {
return tables.filter((table) => {
const matchesSearch =
table.tableNumber
?.toLowerCase()
.includes(searchTerm.toLowerCase()) ||
table.qrCode
?.toLowerCase()
.includes(searchTerm.toLowerCase());


  const matchesStatus =
    statusFilter === "ALL" || table.status === statusFilter;

  return matchesSearch && matchesStatus;
});


}, [tables, searchTerm, statusFilter]);

// -------------------- FORM HANDLING --------------------

const handleInputChange = (event) => {
const { name, value } = event.target;


setFormData((previous) => ({
  ...previous,
  [name]: value,
}));


};

const resetForm = () => {
setFormData(INITIAL_FORM);
setSelectedTable(null);
};

const closeFormModal = () => {
if (saving) return;


setIsModalOpen(false);
resetForm();


};

// -------------------- ADD TABLE --------------------

const openCreateModal = () => {
resetForm();
setModalMode("create");
setIsModalOpen(true);
};

const handleCreateTable = async (event) => {
event.preventDefault();


const tableNumber = formData.tableNumber.trim();
const qrCode = formData.qrCode.trim();
const capacity = Number(formData.capacity);

if (
  !tableNumber ||
  !qrCode ||
  !Number.isInteger(capacity) ||
  capacity <= 0
) {
  showToast("error", "Please enter valid table details.");
  return;
}

const alreadyExists = tables.some(
  (table) =>
    table.tableNumber.toLowerCase() === tableNumber.toLowerCase()
);

if (alreadyExists) {
  showToast("error", "Table number already exists.");
  return;
}

const qrAlreadyExists = tables.some(
  (table) => table.qrCode?.toLowerCase() === qrCode.toLowerCase()
);

if (qrAlreadyExists) {
  showToast("error", "QR code already exists.");
  return;
}

try {
  setSaving(true);

  await createTable({
    tableNumber,
    capacity,
    qrCode,
  });

  setIsModalOpen(false);
  resetForm();

  showToast("success", "Table created successfully!");

  await fetchTables(false);
} catch (error) {
  console.error("Create table error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Failed to create table."
  );
} finally {
  setSaving(false);
}


};

// -------------------- EDIT TABLE --------------------

const openEditModal = async (table) => {
try {
setSaving(true);


  const response = await getTableById(table.id);
  const data = response || table;

  setSelectedTable(data);

  setFormData({
    tableNumber: data.tableNumber || "",
    capacity: String(data.capacity ?? ""),
    qrCode: data.qrCode || "",
  });

  setModalMode("edit");
  setIsModalOpen(true);
} catch (error) {
  console.error("Fetch table details error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Unable to load table details."
  );
} finally {
  setSaving(false);
}


};

const handleUpdateTable = async (event) => {
event.preventDefault();


if (!selectedTable) return;

const tableNumber = formData.tableNumber.trim();
const qrCode = formData.qrCode.trim();
const capacity = Number(formData.capacity);

if (
  !tableNumber ||
  !qrCode ||
  !Number.isInteger(capacity) ||
  capacity <= 0
) {
  showToast("error", "Please enter valid table details.");
  return;
}

const duplicateTable = tables.some(
  (table) =>
    table.id !== selectedTable.id &&
    table.tableNumber.toLowerCase() === tableNumber.toLowerCase()
);

if (duplicateTable) {
  showToast("error", "Another table already uses this table number.");
  return;
}

const duplicateQr = tables.some(
  (table) =>
    table.id !== selectedTable.id &&
    table.qrCode?.toLowerCase() === qrCode.toLowerCase()
);

if (duplicateQr) {
  showToast("error", "Another table already uses this QR code.");
  return;
}

try {
  setSaving(true);

  await updateTable(selectedTable.id, {
    tableNumber,
    capacity,
    qrCode,
  });

  setIsModalOpen(false);
  resetForm();

  showToast("success", "Table updated successfully!");

  await fetchTables(false);
} catch (error) {
  console.error("Update table error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Failed to update table."
  );
} finally {
  setSaving(false);
}


};

// -------------------- VIEW TABLE --------------------

const openViewModal = async (table) => {
try {
const response = await getTableById(table.id);
setSelectedTable(response || table);
setIsViewModalOpen(true);
} catch (error) {
console.error("View table error:", error);
showToast("error", "Unable to load table details.");
}
};

// -------------------- DELETE TABLE --------------------

const openDeleteModal = (table) => {
setSelectedTable(table);
setIsDeleteModalOpen(true);
};

const handleDeleteTable = async () => {
if (!selectedTable) return;


try {
  setDeleting(true);

  await deleteTable(selectedTable.id);

  setIsDeleteModalOpen(false);
  setSelectedTable(null);

  showToast("success", "Table deleted successfully!");

  await fetchTables(false);
} catch (error) {
  console.error("Delete table error:", error);

  showToast(
    "error",
    error.response?.data?.message || "Failed to delete table."
  );
} finally {
  setDeleting(false);
}


};

// -------------------- TABLE COLUMNS --------------------

const columns = [
  {
    key: "tableNumber",
    header: "Table Number",
    accessor: "tableNumber",
  },
  {
    key: "capacity",
    header: "Capacity",
    accessor: "capacity",
    render: (row) => `${row.capacity} Seats`,
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (row) => (
      <span className={`table-status status-${row.status?.toLowerCase()}`}>
        {row.status}
      </span>
    ),
  },
  {
    key: "qrCode",
    header: "QR Code",
    accessor: "qrCode",
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

return ( <div className="tables-management">


  {/* HEADER */}

  <div className="tables-page-header">
    <div>
      <h1>Tables Management</h1>
      <p>Manage restaurant tables and monitor their availability.</p>
    </div>

    <div className="tables-header-actions">
      <button
        className="tables-refresh-button"
        onClick={() => fetchTables()}
        disabled={loading}
      >
        <RefreshCw size={17} />
        Refresh
      </button>

      <button
        className="tables-add-button"
        onClick={openCreateModal}
      >
        <Plus size={18} />
        Add Table
      </button>
    </div>
  </div>

  {/* SUMMARY */}

  <div className="tables-summary">

  <div className="tables-summary-card">
    <div className="summary-card-content">
      <div>
        <span>Total Tables</span>
        <h2>{tables.length}</h2>
      </div>
      <div className="summary-icon total-icon">
        <Table2 size={24} />
      </div>
    </div>
  </div>

  <div className="tables-summary-card">
    <div className="summary-card-content">
      <div>
        <span>Available</span>
        <h2>
          {tables.filter((table) => table.status === "AVAILABLE").length}
        </h2>
      </div>
      <div className="summary-icon available-icon">
        <CheckCircle2 size={24} />
      </div>
    </div>
  </div>

  <div className="tables-summary-card">
    <div className="summary-card-content">
      <div>
        <span>Occupied</span>
        <h2>
          {tables.filter((table) => table.status === "OCCUPIED").length}
        </h2>
      </div>
      <div className="summary-icon occupied-icon">
        <Clock3 size={24} />
      </div>
    </div>
  </div>

</div>
  {/* SEARCH AND FILTER */}

  <AdminSearchFilter
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    searchPlaceholder="Search table number or QR code..."
    filters={[
      {
        name: "status",
        label: "Status",
        value: statusFilter,
        options: [
          { label: "All Statuses", value: "ALL" },
          { label: "Available", value: "AVAILABLE" },
          { label: "Occupied", value: "OCCUPIED" },
          { label: "Reserved", value: "RESERVED" },
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

  {/* TABLE DATA */}

  <AdminDataTable
    columns={columns}
    data={filteredTables}
    loading={loading}
    emptyMessage="No tables found."
    getRowKey={(row) => row.id}
    actions={actions}
  />

  {/* ADD / EDIT MODAL */}

  <AdminModal
    isOpen={isModalOpen}
    onClose={closeFormModal}
    title={modalMode === "create" ? "Add New Table" : "Edit Table"}
    subtitle={
      modalMode === "create"
        ? "Enter the new table details."
        : "Update the existing table details."
    }
    onSubmit={
      modalMode === "create"
        ? handleCreateTable
        : handleUpdateTable
    }
    submitText={
      modalMode === "create" ? "Create Table" : "Update Table"
    }
    loading={saving}
  >
    <div className="table-form">
      <div className="table-form-group">
        <label htmlFor="tableNumber">Table Number</label>
        <input
          id="tableNumber"
          name="tableNumber"
          type="text"
          placeholder="Example: T6"
          value={formData.tableNumber}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="table-form-group">
        <label htmlFor="capacity">Seating Capacity</label>
        <input
          id="capacity"
          name="capacity"
          type="number"
          min="1"
          step="1"
          placeholder="Example: 4"
          value={formData.capacity}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="table-form-group">
        <label htmlFor="qrCode">QR Code</label>
        <input
          id="qrCode"
          name="qrCode"
          type="text"
          placeholder="Example: QR-TABLE-T6"
          value={formData.qrCode}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  </AdminModal>

  {/* VIEW MODAL */}

  <AdminModal
    isOpen={isViewModalOpen}
    onClose={() => {
      setIsViewModalOpen(false);
      setSelectedTable(null);
    }}
    title="Table Details"
    subtitle="View complete table information."
    showFooter={false}
  >
    {selectedTable && (
      <div className="table-details">
        <div>
          <span>Table Number</span>
          <strong>{selectedTable.tableNumber}</strong>
        </div>

        <div>
          <span>Seating Capacity</span>
          <strong>{selectedTable.capacity} Seats</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{selectedTable.status}</strong>
        </div>

        <div>
          <span>QR Code</span>
          <strong>{selectedTable.qrCode}</strong>
        </div>

        <div>
          <span>Table ID</span>
          <strong>{selectedTable.id}</strong>
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
        setSelectedTable(null);
      }
    }}
    onConfirm={handleDeleteTable}
    title="Delete Table"
    message="Are you sure you want to delete this table? This action cannot be undone."
    itemName={selectedTable?.tableNumber}
    confirmText="Delete Table"
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

export default TablesManagement;
