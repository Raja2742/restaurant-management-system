import "./CashierSessionCard.css";

function CashierSessionCard({
session,
onCloseSession,
loading = false
}) {
if (!session) return null;

const sessionId = session.sessionId ?? session.id;
const tableId = session.tableId ?? session.table?.tableId;

const sessionStatus = String(
session.status ??
session.sessionStatus ??
"UNKNOWN"
).toUpperCase();

const paymentStatus = String(
session.paymentStatus ??
session.payment?.status ??
session.payment?.paymentStatus ??
"UNKNOWN"
).toUpperCase();

const amount = Number(
session.totalAmount ??
session.amount ??
session.payment?.amount ??
0
);

const isSessionClosed = [
"CLOSED",
"COMPLETED"
].includes(sessionStatus);

const isPaymentCompleted = [
"COMPLETED",
"PAID",
"SUCCESS",
"SUCCESSFUL"
].includes(paymentStatus);

const canCloseSession =
!isSessionClosed &&
isPaymentCompleted &&
sessionId != null &&
Boolean(onCloseSession);

const formattedAmount = `₹${(
    Number.isFinite(amount) ? amount : 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const handleCloseSession = () => {
if (canCloseSession && !loading) {
onCloseSession(sessionId);
}
};

return ( <article className="cashier-session-card"> <div className="cashier-session-header"> <div className="cashier-session-icon" aria-hidden="true">
🧾 </div>


    <div className="cashier-session-title">
      <span>SESSION</span>

      <h3>
        {sessionId != null ? `#${sessionId}` : "Unavailable"}
      </h3>
    </div>

    <span
      className={`cashier-session-status session-${sessionStatus.toLowerCase()}`}
    >
      {sessionStatus.replaceAll("_", " ")}
    </span>
  </div>

  <div className="cashier-session-details">
    <div className="cashier-session-detail">
      <span>Table</span>

      <strong>
        {tableId != null ? `Table ${tableId}` : "Not available"}
      </strong>
    </div>

    <div className="cashier-session-detail">
      <span>Session Amount</span>

      <strong className="cashier-session-amount">
        {formattedAmount}
      </strong>
    </div>

    <div className="cashier-session-detail">
      <span>Payment Status</span>

      <strong
        className={
          isPaymentCompleted
            ? "cashier-session-payment-paid"
            : "cashier-session-payment-pending"
        }
      >
        {paymentStatus.replaceAll("_", " ")}
      </strong>
    </div>

    <div className="cashier-session-detail">
      <span>Started At</span>

      <strong>
        {session.createdAt
          ? new Date(session.createdAt).toLocaleString("en-IN")
          : "Not available"}
      </strong>
    </div>
  </div>

  <div className="cashier-session-footer">
    {isSessionClosed ? (
      <div className="cashier-session-closed-message">
        <span aria-hidden="true">✓</span>
        Session closed
      </div>
    ) : !isPaymentCompleted ? (
      <p className="cashier-session-warning">
        Complete the payment before closing this session.
      </p>
    ) : (
      <button
        type="button"
        className="cashier-session-close-btn"
        onClick={handleCloseSession}
        disabled={!canCloseSession || loading}
      >
        {loading ? "Closing Session..." : "Close Session"}
      </button>
    )}
  </div>
</article>


);
}

export default CashierSessionCard;
