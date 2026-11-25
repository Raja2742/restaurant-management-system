import "./CashierPaymentCard.css";

function CashierPaymentCard({
payment,
onViewDetails,
onCompletePayment,
onCloseSession
}) {
if (!payment) return null;

const paymentId = payment.paymentId ?? payment.id;
const sessionId = payment.sessionId ?? payment.session?.sessionId;

const status = String(
payment.status ??
payment.paymentStatus ??
payment.paymentState ??
"UNKNOWN"
).toUpperCase();

const method = String(
payment.paymentMethod ??
payment.method ??
payment.paymentType ??
"NOT SPECIFIED"
).toUpperCase();

const amount = Number(
payment.amount ??
payment.totalAmount ??
payment.paidAmount ??
0
);

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

const formattedAmount = `₹${(
    Number.isFinite(amount) ? amount : 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const formattedMethod =
method === "UPI"
? "UPI"
: method === "CASH"
? "Cash"
: method === "CARD"
? "Card"
: method.replaceAll("_", " ");

const handleCompletePayment = () => {
if (onCompletePayment) {
onCompletePayment(payment);
}
};

const handleViewDetails = () => {
if (onViewDetails) {
onViewDetails(payment);
}
};

const handleCloseSession = () => {
if (onCloseSession) {
onCloseSession(payment);
}
};

return ( <article className="cashier-payment-card"> <div className="cashier-payment-card-header"> <div className="cashier-payment-id-section"> <span className="cashier-payment-label">
Payment ID </span>


      <h3>
        {paymentId != null ? `#${paymentId}` : "Not available"}
      </h3>
    </div>

    <span
      className={`cashier-payment-status status-${status.toLowerCase()}`}
    >
      <span className="cashier-status-dot" />
      {status.replaceAll("_", " ")}
    </span>
  </div>

  <div className="cashier-payment-amount-section">
    <span className="cashier-payment-label">
      Payment Amount
    </span>

    <h2>{formattedAmount}</h2>
  </div>

  <div className="cashier-payment-details">
    <div className="cashier-payment-detail-row">
      <span className="cashier-payment-detail-label">
        Payment Method
      </span>

      <span className="cashier-payment-method">
        <span aria-hidden="true">
          {method === "CASH"
            ? "💵"
            : method === "UPI"
              ? "📱"
              : method === "CARD"
                ? "💳"
                : "💰"}
        </span>

        {formattedMethod}
      </span>
    </div>

    <div className="cashier-payment-detail-row">
      <span className="cashier-payment-detail-label">
        Session ID
      </span>

      <span className="cashier-payment-detail-value">
        {sessionId != null ? `#${sessionId}` : "Not available"}
      </span>
    </div>

    {payment.transactionId && (
      <div className="cashier-payment-detail-row">
        <span className="cashier-payment-detail-label">
          Transaction ID
        </span>

        <span className="cashier-payment-detail-value cashier-transaction-id">
          {payment.transactionId}
        </span>
      </div>
    )}
  </div>

  <div className="cashier-payment-card-actions">
    <button
      type="button"
      className="cashier-payment-view-btn"
      onClick={handleViewDetails}
    >
      View Details
    </button>

    {isPending && (
      <button
        type="button"
        className="cashier-payment-complete-btn"
        onClick={handleCompletePayment}
      >
        Complete Payment
      </button>
    )}

    {isCompleted && sessionId != null && onCloseSession && (
      <button
        type="button"
        className="cashier-payment-close-session-btn"
        onClick={handleCloseSession}
      >
        Close Session
      </button>
    )}
  </div>
</article>


);
}

export default CashierPaymentCard;
