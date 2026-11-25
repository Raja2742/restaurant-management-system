import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

import CashierNavbar from "../../components/cashier/CashierNavbar";
import CashierStats from "../../components/cashier/CashierStats";
import CashierPaymentFilters from "../../components/cashier/CashierPaymentFilters";
import CashierPaymentCard from "../../components/cashier/CashierPaymentCard";
import CashierPaymentActions from "../../components/cashier/CashierPaymentActions";
import CashierPaymentModal from "../../components/cashier/CashierPaymentModal";
import CashierEmptyState from "../../components/cashier/CashierEmptyState";
import { getOrdersBySession } from "../../services/orderService";

import {
    getPayment,
    getPaymentBySession,
    getAllPayments,
    createPayment,
    completeCashPayment,
    completeUpiPayment,
    closeSession,
    getPendingBillSessions
} from "../../services/cashierService";

import "./CashierDashboard.css";

function CashierDashboard() {
const [searchTerm, setSearchTerm] = useState("");
const [searchType, setSearchType] = useState("payment");

const [payment, setPayment] = useState(null);
const [payments, setPayments] = useState([]);

const [selectedPayment, setSelectedPayment] = useState(null);

const [sessionOrders, setSessionOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(false);
const [ordersError, setOrdersError] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [statusFilter, setStatusFilter] = useState("ALL");
const [methodFilter, setMethodFilter] = useState("ALL");

const [pendingBills, setPendingBills] = useState([]);
const [pendingBillsLoading, setPendingBillsLoading] = useState(false);
const [pendingBillsError, setPendingBillsError] = useState("");


const fetchAllPayments = async () => {
    try {
        const data = await getAllPayments();
        setPayments(data);
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        setError("Unable to load payment records.");
    }
};

useEffect(() => {
    fetchAllPayments();
}, []);

const fetchPendingBills = async () => {
    try {
        setPendingBillsLoading(true);
        setPendingBillsError("");

        const data = await getPendingBillSessions();

        setPendingBills(data || []);

    } catch (error) {
        console.error("Failed to fetch pending bills:", error);

        setPendingBillsError(
            "Unable to load pending bills. Please try again."
        );

    } finally {
        setPendingBillsLoading(false);
    }
};

const fetchSessionOrders = async (sessionId) => {
    if (!sessionId) return;

    try {
        setOrdersLoading(true);
        setOrdersError("");

        const data = await getOrdersBySession(sessionId);

        setSessionOrders(data || []);

    } catch (error) {
        console.error("Failed to fetch session orders:", error);

        setOrdersError("Unable to load order details.");
        setSessionOrders([]);
    } finally {
        setOrdersLoading(false);
    }
};

// Load the pending-bills queue when the cashier dashboard opens.
useEffect(() => {

    // 1. Fetch existing pending bills when dashboard opens
    fetchPendingBills();

    // 2. Create WebSocket client
    const client = new Client({
        brokerURL: "ws://localhost:8080/ws",

        reconnectDelay: 5000,

        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {
            console.log("Cashier WebSocket Connected");

            // 3. Subscribe to cashier notifications
            client.subscribe("/topic/cashier", (message) => {

                try {
                    const event = JSON.parse(message.body);

                    console.log("Cashier WebSocket Event:", event);

                    // 4. Refresh pending bills when a new bill is requested
                    if (event.type === "BILL_REQUESTED") {
                        console.log("New bill requested!");

                        fetchPendingBills();
                    }

                } catch (error) {
                    console.error(
                        "Error processing cashier notification:",
                        error
                    );
                }
            });
        },

        onStompError: (frame) => {
            console.error(
                "Cashier STOMP Error:",
                frame.headers["message"]
            );
        },

        onWebSocketError: (error) => {
            console.error("Cashier WebSocket Error:", error);
        }
    });

    // 5. Establish connection
    client.activate();

    // 6. Cleanup when dashboard unmounts
    return () => {
        client.deactivate();
    };

}, []);

const isCompleted = (status) =>
["COMPLETED", "PAID", "SUCCESS", "SUCCESSFUL"].includes(
String(status || "").toUpperCase()
);

const isPending = (status) =>
["PENDING", "INITIATED", "PROCESSING"].includes(
String(status || "").toUpperCase()
);

const filteredPayments = payments.filter((item) => {
    const search = searchTerm.trim().toLowerCase();

    const paymentStatus = String(
        item.status ?? item.paymentStatus ?? item.paymentState ?? ""
    ).trim().toUpperCase();

    const paymentMethod = String(
        item.method ?? item.paymentMethod ?? ""
    ).trim().toUpperCase();

    const matchesSearch =
        !search ||
        String(item.id ?? "").toLowerCase().includes(search) ||
        String(item.sessionId ?? "").toLowerCase().includes(search);

    const matchesStatus =
        statusFilter === "ALL" ||
        paymentStatus === statusFilter;

    const matchesMethod =
        methodFilter === "ALL" ||
        paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
});

const handleSearch = async (event) => {
event.preventDefault();


const id = Number(searchTerm.trim());

if (!searchTerm.trim() || !Number.isInteger(id) || id <= 0) {
  setError("Enter a valid positive numeric ID.");
  setSuccess("");
  return;
}

setLoading(true);
setError("");
setSuccess("");
setPayment(null);
setPayments([]);

try {
  const result =
    searchType === "session"
      ? await getPaymentBySession(id)
      : await getPayment(id);

  if (!result) {
    setError("No payment information was returned.");
    return;
  }

  setPayment(result);
  setPayments([result]);
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Unable to find the payment. Check the ID and try again."
  );
} finally {
  setLoading(false);
}


};

const handleStartPayment = async (sessionId, method) => {
    if (!sessionId || !["CASH", "UPI"].includes(method)) {
        setError("Invalid session or payment method.");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
        const newPayment = await createPayment(sessionId, method);

        console.log("New Payment Response:", newPayment);

        setPayment(newPayment);
        setPayments([newPayment]);

        setSearchTerm("");
        setSearchType("payment");

        // Reset filters so the newly created PENDING payment is visible.
        setStatusFilter("ALL");
        setMethodFilter("ALL");

        setSuccess(`${method} payment initiated successfully.`);

    } catch (err) {
        console.error("Payment creation error:", err);

        setError(
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to initiate payment."
        );
    } finally {
        setLoading(false);
    }
};

const handleCompleteCash = async (paymentId) => {
setLoading(true);
setError("");
setSuccess("");


try {
  const updatedPayment = await completeCashPayment(paymentId);

  await fetchAllPayments();

// Load all orders belonging to this session.
await fetchSessionOrders(updatedPayment.sessionId);

setSuccess("Cash payment completed successfully.");

await fetchPendingBills();
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Unable to complete the cash payment."
  );
} finally {
  setLoading(false);
}


};

const handleCompleteUpi = async (paymentId, transactionId) => {
if (!transactionId?.trim()) {
setError("Enter the UPI transaction ID.");
return;
}


setLoading(true);
setError("");
setSuccess("");

try {
  const updatedPayment = await completeUpiPayment(
    paymentId,
    transactionId.trim()
  );

  await fetchAllPayments();

// Load all orders belonging to this session.
await fetchSessionOrders(updatedPayment.sessionId);

setSuccess("UPI payment completed successfully.");

await fetchPendingBills();
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Unable to complete the UPI payment."
  );
} finally {
  setLoading(false);
}


};

const handleCloseSession = async (sessionId) => {
if (!window.confirm(`Close session ${sessionId}?`)) {
return;
}


setLoading(true);
setError("");
setSuccess("");

try {
  await closeSession(sessionId);
  setSuccess(`Session ${sessionId} closed successfully.`);
} catch (err) {
  setError(
    err.response?.data?.message ||
      err.response?.data?.error ||
      "Unable to close the session. Only PAID sessions can be closed."
  );
} finally {
  setLoading(false);
}


};

const handleReset = () => {
setSearchTerm("");
setPayment(null);
setPayments([]);
setSelectedPayment(null);
setError("");
setSuccess("");
setStatusFilter("ALL");
setMethodFilter("ALL");
};

const completedCount = payments.filter((item) =>
isCompleted(item.status)
).length;

const pendingCount = payments.filter((item) =>
isPending(item.status)
).length;

const totalCollected = payments
.filter((item) => isCompleted(item.status))
.reduce((total, item) => total + Number(item.amount || 0), 0);

return ( <div className="cashier-dashboard"> <CashierNavbar />


  <main className="cashier-main">
    <section className="cashier-heading">
      <div>
        <span className="cashier-eyebrow">PAYMENTS MANAGEMENT</span>
        <h1>Cashier Dashboard</h1>
        <p>
          Find payments, verify transactions, and manage completed
          order sessions.
        </p>
      </div>

      <div className="cashier-status-indicator">
        <span />
        Cashier Portal
      </div>
    </section>

    <CashierStats payments={payments} />

    <section className="cashier-pending-bills-section">
      <div className="cashier-section-heading">
        <div>
          <h2>Pending Bills</h2>
          <p>
            {pendingBills.length
              ? `${pendingBills.length} session${pendingBills.length === 1 ? "" : "s"} waiting for payment`
              : "Sessions for which the waiter has requested a bill."}
          </p>
        </div>

        <button
          type="button"
          className="cashier-refresh-button"
          onClick={fetchPendingBills}
          disabled={pendingBillsLoading}
        >
          {pendingBillsLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {pendingBillsError && (
        <div className="cashier-alert cashier-alert-error" role="alert">
          <span>{pendingBillsError}</span>
          <button
            type="button"
            onClick={fetchPendingBills}
            disabled={pendingBillsLoading}
          >
            Retry
          </button>
        </div>
      )}

      {pendingBillsLoading && pendingBills.length === 0 ? (
        <div className="cashier-pending-bills-empty">
          Loading pending bills...
        </div>
      ) : pendingBills.length === 0 ? (
        <div className="cashier-pending-bills-empty">
          <h3>No Pending Bills</h3>
          <p>New bill requests will appear here.</p>
        </div>
      ) : (
        <div className="cashier-pending-bills-list">
          {pendingBills.map((bill) => (
            <article
              className="cashier-pending-bill-card"
              key={bill.id}
            >
              <div className="cashier-pending-bill-details">
                <div>
                  <span className="cashier-pending-bill-label">TABLE</span>
                  <strong>{bill.tableNumber || `Table ${bill.tableId}`}</strong>
                </div>

                <div>
                  <span className="cashier-pending-bill-label">SESSION</span>
                  <strong>{bill.sessionNumber || `#${bill.id}`}</strong>
                </div>

                <div>
                  <span className="cashier-pending-bill-label">STATUS</span>
                  <span className="cashier-pending-bill-status">
                    {bill.status || "BILL_REQUESTED"}
                  </span>
                </div>
              </div>
              <div className="cashier-pending-bill-actions">

              <button
                  type="button"
                  className="cashier-process-cash-button"
                  onClick={() => handleStartPayment(bill.id, "CASH")}
                  disabled={loading}
              >
                  Pay by Cash
              </button>

              <button
                  type="button"
                  className="cashier-process-upi-button"
                  onClick={() => handleStartPayment(bill.id, "UPI")}
                  disabled={loading}
              >
                  Pay by UPI
              </button>

          </div>
            </article>
          ))}
        </div>
      )}
    </section>

    <section className="cashier-lookup-section">
      <div className="cashier-section-heading">
        <div>
          <h2>Find a Payment</h2>
          <p>
            Search using a payment ID or an order session ID.
          </p>
        </div>
      </div>

      <form className="cashier-search-form" onSubmit={handleSearch}>
        <div className="cashier-search-type">
          <label htmlFor="cashier-search-type">
            Search by
          </label>

          <select
            id="cashier-search-type"
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
          >
            <option value="payment">Payment ID</option>
            <option value="session">Session ID</option>
          </select>
        </div>

        <div className="cashier-search-input">
          <label htmlFor="cashier-search-id">
            {searchType === "payment" ? "Payment ID" : "Session ID"}
          </label>

          <input
            id="cashier-search-id"
            type="number"
            min="1"
            step="1"
            placeholder={
              searchType === "payment"
                ? "Enter payment ID"
                : "Enter session ID"
            }
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Find Payment"}
        </button>

        <button
          type="button"
          className="cashier-reset-button"
          onClick={handleReset}
          disabled={loading}
        >
          Reset
        </button>
      </form>
    </section>

    {error && (
      <div className="cashier-alert cashier-alert-error" role="alert">
        <span>{error}</span>
        <button onClick={() => setError("")} aria-label="Dismiss error">
          ×
        </button>
      </div>
    )}

    {success && (
      <div
        className="cashier-alert cashier-alert-success"
        role="status"
      >
        <span>{success}</span>
        <button
          onClick={() => setSuccess("")}
          aria-label="Dismiss success message"
        >
          ×
        </button>
      </div>
    )}

    <section className="cashier-payments-section">
      <div className="cashier-section-heading">
        <div>
          <h2>Payment Details</h2>
          <p>
            {payments.length
              ? `${payments.length} payment loaded`
              : "Search for a payment to view its details."}
          </p>
        </div>
      </div>

      <CashierPaymentFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        onReset={handleReset}
      />

      {filteredPayments.length > 0 ? (
        <div className="cashier-payment-list">
          {filteredPayments.map((item) => (
            <div className="cashier-payment-item" key={item.id}>
              <CashierPaymentCard
                payment={item}
                onViewDetails={() => setSelectedPayment(item)}
                onCompletePayment={(selected) => {
                  if (
                    String(selected.method || "").toUpperCase() === "CASH"
                  ) {
                    handleCompleteCash(selected.id);
                  } else if (
                    String(selected.method || "").toUpperCase() === "UPI"
                  ) {
                    handleCompleteUpi(
                      selected.id,
                      window.prompt("Enter the UPI transaction ID:") || ""
                    );
                  }
                }}
                onCloseSession={() =>
                  handleCloseSession(item.sessionId)
                }
              />

              <CashierPaymentActions
                payment={item}
                onCompleteCash={handleCompleteCash}
                onCompleteUpi={handleCompleteUpi}
                onCloseSession={handleCloseSession}
                loading={loading}
              />
            </div>
          ))}
        </div>
      ) : (
        <CashierEmptyState
          title={
            payments.length
              ? "No matching payments"
              : "No payment selected"
          }
          message={
            payments.length
              ? "Try changing your filters."
              : "Enter a payment ID or session ID above to retrieve payment details."
          }
          onReset={handleReset}
          resetLabel="Clear Search"
          showReset={Boolean(searchTerm || payments.length)}
        />
      )}
    </section>

    <section className="cashier-orders-section">

    <div className="cashier-section-heading">
        <div>
            <h2>Order Details</h2>
            <p>Items associated with the selected payment session.</p>
        </div>
    </div>

    {ordersLoading ? (
        <div className="cashier-orders-empty">
            Loading order details...
        </div>
    ) : ordersError ? (
        <div className="cashier-alert cashier-alert-error">
            {ordersError}
        </div>
    ) : sessionOrders.length === 0 ? (
        <div className="cashier-orders-empty">
            <h3>No Orders Found</h3>
            <p>Order details will appear when a payment session is selected.</p>
        </div>
    ) : (
        <div className="cashier-orders-list">

            {sessionOrders.map((order) => (
                <article
                    className="cashier-order-card"
                    key={order.id}
                >

                    <div className="cashier-order-header">
                        <div>
                            <h3>Order #{order.orderNumber}</h3>
                            <span>
                                {order.status}
                            </span>
                        </div>

                        <strong>
                            ₹{Number(order.totalAmount || 0).toFixed(2)}
                        </strong>
                    </div>

                    <div className="cashier-order-items">

                        {order.items?.map((item) => (
                            <div
                                className="cashier-order-item"
                                key={item.id}
                            >
                                <div>
                                    <strong>{item.menuItemName}</strong>
                                    <span>
                                        ₹{Number(item.price || 0).toFixed(2)}
                                        {" "}× {item.quantity}
                                    </span>
                                </div>

                                <strong>
                                    ₹{Number(item.subtotal || 0).toFixed(2)}
                                </strong>
                            </div>
                        ))}

                    </div>

                </article>
            ))}

        </div>
    )}

</section>

    <section className="cashier-summary-row">
      <div className="cashier-summary-card">
        <span>Loaded Payments</span>
        <strong>{payments.length}</strong>
      </div>

      <div className="cashier-summary-card">
        <span>Completed</span>
        <strong>{completedCount}</strong>
      </div>

      <div className="cashier-summary-card">
        <span>Pending</span>
        <strong>{pendingCount}</strong>
      </div>

      <div className="cashier-summary-card">
        <span>Collected Amount</span>
        <strong>
          ₹
          {totalCollected.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
      </div>
    </section>
  </main>

  {selectedPayment && (
    <CashierPaymentModal
      payment={selectedPayment}
      onClose={() => setSelectedPayment(null)}
    />
  )}
</div>


);
}

export default CashierDashboard;
