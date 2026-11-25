import { useCallback, useEffect, useState } from "react";

import { getKitchenOrders } from "../../services/kitchenService";

import KitchenNavbar from "../../components/kitchen/KitchenNavbar";
import KitchenStats from "../../components/kitchen/KitchenStats";
import KitchenOrderFilters from "../../components/kitchen/KitchenOrderFilters";
import KitchenOrderCard from "../../components/kitchen/KitchenOrderCard";
import KitchenEmptyState from "../../components/kitchen/KitchenEmptyState";
import { connectWebSocket } from "../../services/websocketService";

import "./KitchenDashboard.css";

function KitchenDashboard() {
const [orders, setOrders] = useState([]);
const [activeFilter, setActiveFilter] = useState("ALL");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const fetchOrders = useCallback(async (showLoader = true) => {
    try {
        if (showLoader) {
            setLoading(true);
        }

        setError("");

        const data = await getKitchenOrders();

        if (!Array.isArray(data)) {
            throw new Error("The server did not return an order list.");
        }

        setOrders(data);

    } catch (err) {

        console.error("Failed to fetch kitchen orders:", err);

        setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to load kitchen orders. Please try again."
        );

    } finally {

        if (showLoader) {
            setLoading(false);
        }
    }
}, []);

useEffect(() => {
fetchOrders();
}, [fetchOrders]);

// Real-time Kitchen Dashboard updates
useEffect(() => {

    let refreshTimer;

    const disconnect = connectWebSocket(
    "/topic/kitchen",
    (event) => {
        console.log("Kitchen WebSocket Event:", event.type);

        const supportedEvents = [
            "ORDER_PLACED",
            "ORDER_ACCEPTED",
            "ORDER_PREPARING",
            "ORDER_READY"
        ];

        if (!supportedEvents.includes(event.type)) {
            return;
        }

        clearTimeout(refreshTimer);

        refreshTimer = setTimeout(() => {
            fetchOrders(false);
        }, 300);
    }
);

}, [fetchOrders]);


// Update an order locally after a successful backend action.
const handleStatusUpdated = useCallback(
(orderId, updatedOrder) => {
if (updatedOrder && typeof updatedOrder === "object") {
setOrders((previousOrders) =>
previousOrders.map((order) =>
order.id === orderId
? { ...order, ...updatedOrder }
: order
)
);
} else {
// If the backend doesn't return the updated order, fetch it again.
fetchOrders();
}
},
[fetchOrders]
);

// Filter orders based on the selected status.
const filteredOrders =
activeFilter === "ALL"
? orders
: orders.filter((order) => order.status === activeFilter);

return ( <div className="kitchen-dashboard"> <KitchenNavbar />


  <main className="kitchen-dashboard__main">
    <header className="kitchen-dashboard__header">
      <div>
        <h1>Kitchen Dashboard</h1>
        <p>Manage incoming orders and track preparation progress.</p>
      </div>

      <button
        type="button"
        className="kitchen-dashboard__refresh"
        onClick={fetchOrders}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "↻ Refresh Orders"}
      </button>
    </header>

    {!error && (
      <KitchenStats orders={orders} />
    )}

    {!error && (
      <KitchenOrderFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        orders={orders}
      />
    )}

    {loading && (
      <div
        className="kitchen-dashboard__message"
        role="status"
        aria-live="polite"
      >
        <div className="kitchen-dashboard__spinner" />
        <p>Loading kitchen orders...</p>
      </div>
    )}

    {!loading && error && (
      <div
        className="kitchen-dashboard__message kitchen-dashboard__message--error"
        role="alert"
      >
        <p>{error}</p>

        <button
          type="button"
          className="kitchen-dashboard__retry"
          onClick={fetchOrders}
        >
          Try Again
        </button>
      </div>
    )}

    {!loading && !error && filteredOrders.length === 0 && (
      <KitchenEmptyState filter={activeFilter} />
    )}

    {!loading && !error && filteredOrders.length > 0 && (
      <section
        className="kitchen-dashboard__orders"
        aria-label="Kitchen orders"
      >
        {filteredOrders.map((order) => (
          <KitchenOrderCard
            key={order.id}
            id={order.id}
            orderNumber={order.orderNumber}
            status={order.status}
            items={order.items}
            totalAmount={order.totalAmount}
            createdAt={order.createdAt}
            onStatusUpdated={handleStatusUpdated}
          />
        ))}
      </section>
    )}
  </main>
</div>


);
}

export default KitchenDashboard;
