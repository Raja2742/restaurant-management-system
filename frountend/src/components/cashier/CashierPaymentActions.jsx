import { useState } from "react";
import "./CashierPaymentActions.css";

function CashierPaymentActions({
payment,
onCompleteCash,
onCompleteUpi,
onCloseSession,
loading = false
}) {
const [transactionId, setTransactionId] = useState("");
const [error, setError] = useState("");

if (!payment) return null;

const paymentId = payment.paymentId ?? payment.id;
const sessionId = payment.sessionId ?? payment.session?.sessionId;

const status = String(
payment.status ??
payment.paymentStatus ??
payment.paymentState ??
""
).toUpperCase();

const method = String(
payment.paymentMethod ??
payment.method ??
payment.paymentType ??
""
).toUpperCase();

const isCompleted = [
"COMPLETED",
"PAID",
"SUCCESS",
"SUCCESSFUL"
].includes(status);

const isPending = [
"PENDING",
"INITIATED",
"PROCESSING"
].includes(status);

const handleCashPayment = async () => {
setError("");


if (paymentId == null) {
  setError("Payment ID is missing.");
  return;
}

if (!onCompleteCash) {
  setError("Cash payment action is not configured.");
  return;
}

try {
  await onCompleteCash(paymentId);
} catch (err) {
  setError(err?.message || "Unable to complete cash payment.");
}


};

const handleUpiPayment = async (event) => {
event.preventDefault();
setError("");


if (paymentId == null) {
  setError("Payment ID is missing.");
  return;
}

const trimmedTransactionId = transactionId.trim();

if (!trimmedTransactionId) {
  setError("Please enter the UPI transaction ID.");
  return;
}

if (!onCompleteUpi) {
  setError("UPI payment action is not configured.");
  return;
}

try {
  await onCompleteUpi(paymentId, trimmedTransactionId);
  setTransactionId("");
} catch (err) {
  setError(err?.message || "Unable to complete UPI payment.");
}


};

const handleCloseSession = async () => {
setError("");


if (sessionId == null) {
  setError("Session ID is missing.");
  return;
}

if (!onCloseSession) {
  setError("Close session action is not configured.");
  return;
}

try {
  await onCloseSession(sessionId);
} catch (err) {
  setError(err?.message || "Unable to close session.");
}


};

return ( <section className="cashier-payment-actions"> <div className="cashier-actions-heading"> <div> <h3>Payment Actions</h3> <p>
Payment ID: {paymentId != null ? `#${paymentId}` : "Unavailable"} </p> </div>


    <span
      className={`cashier-action-status ${
        isCompleted ? "is-completed" : isPending ? "is-pending" : ""
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  </div>

  {isCompleted ? (
    <div className="cashier-action-success">
      <span aria-hidden="true">✓</span>
      <div>
        <strong>Payment completed</strong>
        <p>This payment has already been marked as completed.</p>
      </div>
    </div>
  ) : isPending ? (
    <div className="cashier-action-options">
      {method === "CASH" || method === "" ? (
        <div className="cashier-action-option">
          <div className="cashier-action-option-icon cash-icon">
            💵
          </div>

          <div className="cashier-action-option-content">
            <h4>Cash Payment</h4>
            <p>Confirm that the cash has been received.</p>

            <button
              type="button"
              className="cashier-action-cash-btn"
              onClick={handleCashPayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Cash Received"}
            </button>
          </div>
        </div>
      ) : null}

      {method === "UPI" || method === "" ? (
        <form
          className="cashier-action-option"
          onSubmit={handleUpiPayment}
        >
          <div className="cashier-action-option-icon upi-icon">
            📱
          </div>

          <div className="cashier-action-option-content">
            <h4>UPI Payment</h4>
            <p>Enter the transaction ID after verifying payment.</p>

            <label htmlFor="cashier-upi-transaction">
              UPI Transaction ID
            </label>

            <input
              id="cashier-upi-transaction"
              type="text"
              value={transactionId}
              onChange={(event) =>
                setTransactionId(event.target.value)
              }
              placeholder="Enter transaction ID"
              autoComplete="off"
              disabled={loading}
            />

            <button
              type="submit"
              className="cashier-action-upi-btn"
              disabled={loading}
            >
              {loading ? "Processing..." : "Verify & Complete UPI"}
            </button>
          </div>
        </form>
      ) : null}

      {method && !["CASH", "UPI"].includes(method) && (
        <div className="cashier-action-info">
          <strong>Payment method: {method}</strong>
          <p>
            This payment method does not have a completion action
            configured in the current backend controller.
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className="cashier-action-info">
      <strong>Payment cannot be completed from this screen.</strong>
      <p>
        Current payment status: {status || "UNKNOWN"}.
      </p>
    </div>
  )}

  {isCompleted && sessionId != null && onCloseSession && (
    <div className="cashier-close-session-section">
      <div>
        <h4>Close Table Session</h4>
        <p>
          Session ID: #{sessionId}. Close the session after confirming
          the table is ready to be released.
        </p>
      </div>

      <button
        type="button"
        className="cashier-close-session-btn"
        onClick={handleCloseSession}
        disabled={loading}
      >
        {loading ? "Closing..." : "Close Session"}
      </button>
    </div>
  )}

  {error && (
    <p className="cashier-action-error" role="alert">
      {error}
    </p>
  )}
</section>


);
}

export default CashierPaymentActions;
