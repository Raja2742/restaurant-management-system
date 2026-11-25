import "./CashierPaymentModal.css";

function CashierPaymentModal({ payment, onClose }) {
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

const formattedAmount = `₹${(
    Number.isFinite(amount) ? amount : 0
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const details = [
{
label: "Payment ID",
value: paymentId != null ? `#${paymentId}` : "Not available"
},
{
label: "Session ID",
value: sessionId != null ? `#${sessionId}` : "Not available"
},
{
label: "Payment Method",
value: method.replaceAll("*", " ")
},
{
label: "Payment Status",
value: status.replaceAll("*", " ")
},
{
label: "Transaction ID",
value: payment.transactionId ?? "Not available"
},
{
label: "Created At",
value: payment.createdAt
? new Date(payment.createdAt).toLocaleString("en-IN")
: "Not available"
},
{
label: "Updated At",
value: payment.updatedAt
? new Date(payment.updatedAt).toLocaleString("en-IN")
: "Not available"
}
];

const handleBackdropClick = (event) => {
if (event.target === event.currentTarget) {
onClose?.();
}
};

const handleKeyDown = (event) => {
if (event.key === "Escape") {
onClose?.();
}
};

return ( <div
   className="cashier-modal-backdrop"
   onMouseDown={handleBackdropClick}
   onKeyDown={handleKeyDown}
 > <section
     className="cashier-payment-modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="cashier-modal-title"
   > <header className="cashier-modal-header"> <div> <span className="cashier-modal-eyebrow">
PAYMENT INFORMATION </span>


        <h2 id="cashier-modal-title">
          Payment Details
        </h2>

        <p>
          Review the transaction information below.
        </p>
      </div>

      <button
        type="button"
        className="cashier-modal-close"
        onClick={onClose}
        aria-label="Close payment details"
      >
        ×
      </button>
    </header>

    <div className="cashier-modal-amount">
      <span>Payment Amount</span>
      <h3>{formattedAmount}</h3>

      <span
        className={`cashier-modal-status status-${status.toLowerCase()}`}
      >
        {status.replaceAll("_", " ")}
      </span>
    </div>

    <div className="cashier-modal-details">
      {details.map((detail) => (
        <div
          className="cashier-modal-detail"
          key={detail.label}
        >
          <span>{detail.label}</span>
          <strong>{detail.value}</strong>
        </div>
      ))}
    </div>

    <footer className="cashier-modal-footer">
      <p>
        Confirm the transaction details before completing any
        payment-related action.
      </p>

      <button
        type="button"
        className="cashier-modal-done-btn"
        onClick={onClose}
      >
        Close Details
      </button>
    </footer>
  </section>
</div>


);
}

export default CashierPaymentModal;
