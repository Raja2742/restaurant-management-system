import { useState } from "react";
import {
acceptOrder,
startPreparing,
markOrderReady,
} from "../../services/kitchenService";
import "./KitchenOrderActions.css";

function KitchenOrderActions({ orderId, status, onStatusUpdated }) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleAction = async (action) => {
try {
setLoading(true);
setError("");


  let response;

  if (action === "accept") {
    response = await acceptOrder(orderId);
  } else if (action === "preparing") {
    response = await startPreparing(orderId);
  } else if (action === "ready") {
    response = await markOrderReady(orderId);
  }

  if (onStatusUpdated) {
    onStatusUpdated(orderId, response.data);
  }
} catch (err) {
  console.error("Failed to update order status:", err);
  setError(
    err.response?.data?.message || "Unable to update order status."
  );
} finally {
  setLoading(false);
}


};

return ( <div className="kitchen-order-actions">
{status === "PLACED" && (
<button
type="button"
disabled={loading}
onClick={() => handleAction("accept")}
>
{loading ? "Updating..." : "Accept Order"} </button>
)}


  {status === "ACCEPTED" && (
    <button
      type="button"
      disabled={loading}
      onClick={() => handleAction("preparing")}
    >
      {loading ? "Updating..." : "Start Preparing"}
    </button>
  )}

  {status === "PREPARING" && (
    <button
      type="button"
      disabled={loading}
      onClick={() => handleAction("ready")}
    >
      {loading ? "Updating..." : "Mark as Ready"}
    </button>
  )}

  {status === "READY" && (
    <p className="kitchen-order-actions__complete">
      Order is ready!
    </p>
  )}

  {error && (
    <p className="kitchen-order-actions__error">{error}</p>
  )}
</div>


);
}

export default KitchenOrderActions;
