import "./CashierEmptyState.css";

function CashierEmptyState({
title = "No Payments Found",
message = "There are no payment records to display right now.",
onReset,
resetLabel = "Reset Filters",
showReset = false,
icon = "💳"
}) {
return ( <section className="cashier-empty-state"> <div className="cashier-empty-icon" aria-hidden="true">
{icon} </div>


  <h3>{title}</h3>

  <p>{message}</p>

  {showReset && onReset && (
    <button
      type="button"
      className="cashier-empty-reset-btn"
      onClick={onReset}
    >
      {resetLabel}
    </button>
  )}
</section>


);
}

export default CashierEmptyState;
