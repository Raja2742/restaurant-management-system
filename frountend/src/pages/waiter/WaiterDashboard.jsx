import React, {
useCallback,
useEffect,
useMemo,
useState,
} from "react";

import WaiterNavbar from "../../components/waiter/WaiterNavbar";
import WaiterStats from "../../components/waiter/WaiterStats";
import TableGrid from "../../components/waiter/TableGrid";
import WaiterOrderFilters from "../../components/waiter/WaiterOrderFilters";
import WaiterOrderCard from "../../components/waiter/WaiterOrderCard";
import WaiterEmptyState from "../../components/waiter/WaiterEmptyState";
import { connectWebSocket } from "../../services/websocketService";
import {
    getWaiterOrders,
    getReadyOrders,
    getWaiterTables,
    markOrderAsServed,
    releaseTableSession,
    requestBill
} from "../../services/waiterService";

import "./WaiterDashboard.css";


const WaiterDashboard = () => {
const [tables, setTables] = useState([]);
const [orders, setOrders] = useState([]);
const [releasingTableId, setReleasingTableId] = useState(null);
const [requestingBillSessionId, setRequestingBillSessionId] = useState(null);
const [activeFilter, setActiveFilter] = useState("ALL");
const [selectedTable, setSelectedTable] = useState(null);
const [selectedOrder, setSelectedOrder] = useState(null);

const [loading, setLoading] = useState(true);
const [servingOrderId, setServingOrderId] = useState(null);
const [error, setError] = useState("");

// Fetch actual tables and orders from Spring Boot.

const fetchDashboardData = useCallback(async (showLoader = true) => {
if (showLoader) {
setLoading(true);
}


setError("");

try {
  const [tablesData, activeOrdersData, readyOrdersData] =
    await Promise.all([
      getWaiterTables(),
      getWaiterOrders(),
      getReadyOrders(),
    ]);

  const tableList = Array.isArray(tablesData)
    ? tablesData
    : [];

  const activeList = Array.isArray(activeOrdersData)
    ? activeOrdersData
    : [];

  const readyList = Array.isArray(readyOrdersData)
    ? readyOrdersData
    : [];

  // Merge active and ready orders, avoiding duplicate IDs.
  const orderMap = new Map();

  [...activeList, ...readyList].forEach((order) => {
    orderMap.set(order.id, order);
  });

  const normalizedTables = tableList.map((table) => ({
    ...table,
    tableNumber:
      table.tableNumber ??
      table.number ??
      table.id,
  }));

  const normalizedOrders = Array.from(orderMap.values()).map(
    (order) => ({
      ...order,
      tableNumber:
        order.tableNumber ??
        order.table?.tableNumber ??
        order.table?.number ??
        null,
      items: Array.isArray(order.items)
        ? order.items
        : [],
    })
  );

  setTables(normalizedTables);
  setOrders(normalizedOrders);

  // Keep selected order details synchronized after refreshing.
  setSelectedOrder((previousSelectedOrder) => {
    if (!previousSelectedOrder) {
      return null;
    }

    return (
      normalizedOrders.find(
        (order) => order.id === previousSelectedOrder.id
      ) ?? null
    );
  });
} catch (err) {
  console.error("Failed to fetch waiter dashboard data:", err);

  setError(
    err.response?.data?.message ||
      "Unable to load dashboard data. Check your backend connection and try again."
  );
} finally {
  setLoading(false);
}


}, []);

const handleReleaseTable = useCallback(async (table) => {

    const confirmed = window.confirm(
        `Are you sure you want to release Table ${table.tableNumber}?`
    );

    if (!confirmed) return;

    try {
        setReleasingTableId(table.id);
        setError("");

        await releaseTableSession(table.activeSessionId);

        await fetchDashboardData(false);

        alert(`Table ${table.tableNumber} released successfully!`);

    } catch (error) {

        console.error("Failed to release table:", error);

        setError(
            error.response?.data?.message ||
            "Unable to release table. Please try again."
        );

    } finally {
        setReleasingTableId(null);
    }

}, [fetchDashboardData]);

// Request bill for the selected table session.
const handleRequestBill = useCallback(async (table) => {

    if (!table?.activeSessionId) {
        setError("No active session found for this table.");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to request the bill for Table ${table.tableNumber}?`
    );

    if (!confirmed) return;

    try {
        setRequestingBillSessionId(table.activeSessionId);
        setError("");

        await requestBill(table.activeSessionId);

        // Refresh table information after requesting the bill.
        await fetchDashboardData(false);

        alert(`Bill requested successfully for Table ${table.tableNumber}!`);

    } catch (error) {

        console.error("Failed to request bill:", error);

        setError(
            error.response?.data?.message ||
            "Unable to request bill. Please try again."
        );

    } finally {
        setRequestingBillSessionId(null);
    }

}, [fetchDashboardData]);

// Initial dashboard loading.
useEffect(() => {
    fetchDashboardData();
}, [fetchDashboardData]);

// WebSocket connection for real-time updates.
useEffect(() => {
    let refreshTimer;

    const disconnect = connectWebSocket("/topic/waiter", (event) => {
    clearTimeout(refreshTimer);

    refreshTimer = setTimeout(() => {
        fetchDashboardData(false);
    }, 300);
});
    return () => {
        clearTimeout(refreshTimer);
        disconnect();
    };
}, [fetchDashboardData]);

// Filter by status and optionally by selected table.
const filteredOrders = useMemo(() => {
let result = orders;


if (activeFilter !== "ALL") {
  result = result.filter(
    (order) =>
      order.status?.toUpperCase() === activeFilter
  );
}

if (selectedTable) {
  const tableNumber =
    selectedTable.tableNumber ?? selectedTable.id;

  result = result.filter(
    (order) =>
      Number(order.tableNumber) === Number(tableNumber)
  );
}

return result;


}, [orders, activeFilter, selectedTable]);

const filterOrdersForSelectedTable = useMemo(() => {
if (!selectedTable) {
return orders;
}


const tableNumber =
  selectedTable.tableNumber ?? selectedTable.id;

return orders.filter(
  (order) =>
    Number(order.tableNumber) === Number(tableNumber)
);


}, [orders, selectedTable]);

const handleSelectTable = (table) => {
setSelectedTable(table);
setSelectedOrder(null);


document
  .getElementById("waiter-orders-section")
  ?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });


};

const handleShowAllOrders = () => {
setSelectedTable(null);
setActiveFilter("ALL");
};

// Update the order through the backend.
const handleMarkServed = async (order) => {
if (!order?.id || servingOrderId !== null) {
return;
}


try {
  setServingOrderId(order.id);
  setError("");

  await markOrderAsServed(order.id);

  // Reload the latest state from the database.
  await fetchDashboardData(false);

  setSelectedOrder(null);
} catch (err) {
  console.error("Failed to mark order as served:", err);

  setError(
    err.response?.data?.message ||
      "Unable to mark the order as served. Please try again."
  );
} finally {
  setServingOrderId(null);
}


};

return ( <div className="waiter-dashboard"> <WaiterNavbar />


  {error && (
    <div className="waiter-error-banner" role="alert">
      <span>{error}</span>

      <button
        type="button"
        onClick={() => fetchDashboardData()}
      >
        Retry
      </button>
    </div>
  )}

  <main className="waiter-dashboard-main">
    {/* Dashboard heading */}
    <section className="waiter-welcome">
      <div>
        <span className="waiter-eyebrow">
          RESTAURANT OPERATIONS
        </span>

        <h1>Waiter Dashboard</h1>

        <p>
          Manage tables, track orders, and deliver great service.
        </p>
      </div>

      <button
        type="button"
        className="waiter-refresh-btn"
        onClick={() => fetchDashboardData()}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "Refresh Data"}
      </button>
    </section>

    {/* Statistics */}
    <section className="waiter-stats-section">
      {loading ? (
        <div className="waiter-loading-message">
          Loading statistics...
        </div>
      ) : (
        <WaiterStats
          tables={tables}
          orders={orders}
        />
      )}
    </section>

    {/* Tables */}
    <section className="waiter-tables-section">
      <div className="waiter-section-heading">
        <div>
          <h2>Restaurant Tables</h2>

          <p>
            Select a table to view its associated orders.
          </p>
        </div>

        {selectedTable && (
    <div className="waiter-table-actions">

        <button
            type="button"
            className="waiter-request-bill-btn"
            onClick={() => handleRequestBill(selectedTable)}
            disabled={
                !selectedTable.activeSessionId ||
                requestingBillSessionId !== null ||
                selectedTable.status === "WAITING_FOR_BILL"
            }
        >
            {requestingBillSessionId === selectedTable.activeSessionId
                ? "Requesting..."
                : selectedTable.status === "WAITING_FOR_BILL"
                    ? "Bill Requested"
                    : "Request Bill"}
        </button>

        <button
            type="button"
            className="waiter-clear-selection"
            onClick={() => setSelectedTable(null)}
        >
            Clear Selection
        </button>

    </div>
)}
      </div>

      {loading ? (
        <WaiterEmptyState
          icon="⏳"
          title="Loading tables..."
          message="Fetching table information from the server."
        />
      ) : (
        <TableGrid
    tables={tables}
    onSelectTable={handleSelectTable}
    onReleaseTable={handleReleaseTable}
    onRequestBill={handleRequestBill}
    releasingTableId={releasingTableId}
    requestingBillSessionId={requestingBillSessionId}
/>
      )}
    </section>

    {/* Orders */}
    <section
      id="waiter-orders-section"
      className="waiter-orders-section"
    >
      <WaiterOrderFilters
        orders={filterOrdersForSelectedTable}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {loading ? (
        <WaiterEmptyState
          icon="⏳"
          title="Loading orders..."
          message="Fetching the latest orders from the server."
        />
      ) : filteredOrders.length > 0 ? (
        <div className="waiter-orders-grid">
          {filteredOrders.map((order) => (
            <WaiterOrderCard
              key={order.id}
              order={order}
              onSelectOrder={setSelectedOrder}
            />
          ))}
        </div>
      ) : (
        <WaiterEmptyState
          icon="🍽️"
          title="No orders found"
          message={
            selectedTable
              ? `No matching orders were found for Table ${
                  selectedTable.tableNumber ??
                  selectedTable.id
                }.`
              : "There are no orders matching the selected status."
          }
          actionLabel="Show All Orders"
          onAction={handleShowAllOrders}
        />
      )}
    </section>

    {/* Order details modal */}
    {selectedOrder && (
      <div
        className="waiter-modal-overlay"
        onClick={() => setSelectedOrder(null)}
      >
        <div
          className="waiter-order-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waiter-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="waiter-modal-header">
            <div>
              <span>ORDER DETAILS</span>

              <h2 id="waiter-modal-title">
                {selectedOrder.orderNumber ??
                  `Order #${selectedOrder.id}`}
              </h2>
            </div>

            <button
              type="button"
              className="waiter-modal-close"
              aria-label="Close order details"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
          </div>

          <div className="waiter-modal-info">
            <p>
              <strong>Table:</strong>{" "}
              {selectedOrder.tableNumber ?? "Not available"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedOrder.status}
            </p>
          </div>

          <h3>Ordered Items</h3>

          <div className="waiter-modal-items">
            {selectedOrder.items?.length > 0 ? (
              selectedOrder.items.map((item, index) => (
                <div
                  className="waiter-modal-item"
                  key={item.id ?? index}
                >
                  <span>
                    {item.menuItemName ??
                      item.name ??
                      "Menu item"}
                  </span>

                  <span>× {item.quantity}</span>
                </div>
              ))
            ) : (
              <p>No item details available.</p>
            )}
          </div>

          <div className="waiter-modal-total">
            <span>Total Amount</span>

            <strong>
              ₹
              {Number(
                selectedOrder.totalAmount ?? 0
              ).toFixed(2)}
            </strong>
          </div>

          {selectedOrder.status?.toUpperCase() ===
            "READY" && (
            <button
              type="button"
              className="waiter-modal-served-btn"
              onClick={() => handleMarkServed(selectedOrder)}
              disabled={servingOrderId !== null}
            >
              {servingOrderId === selectedOrder.id
                ? "Updating..."
                : "Mark as Served"}
            </button>
          )}
        </div>
      </div>
    )}
  </main>
</div>


);
};

export default WaiterDashboard;
