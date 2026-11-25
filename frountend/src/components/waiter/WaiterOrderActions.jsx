import React from "react";
import "./WaiterOrderActions.css";

const WaiterOrderActions = ({
order,
onViewOrder,
onMarkServed,
loading = false,
}) => {
if (!order) return null;

const status = order.status?.toUpperCase();

const canMarkServed = status === "READY";

return ( <div className="waiter-order-actions">
<button
type="button"
className="waiter-action-btn waiter-view-btn"
onClick={() => onViewOrder?.(order)}
disabled={loading}
>
View Details </button>


  {canMarkServed && (
    <button
      type="button"
      className="waiter-action-btn waiter-served-btn"
      onClick={() => onMarkServed?.(order)}
      disabled={loading}
    >
      {loading ? "Updating..." : "Mark as Served"}
    </button>
  )}

  {status === "SERVED" && (
    <span className="waiter-served-label">
      ✓ Served
    </span>
  )}

  {status === "PLACED" && (
    <span className="waiter-action-hint">
      Waiting for confirmation
    </span>
  )}

  {["ACCEPTED", "PREPARING"].includes(status) && (
    <span className="waiter-action-hint">
      Kitchen is processing
    </span>
  )}
</div>


);
};

export default WaiterOrderActions;
