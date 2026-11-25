import "./CashierPaymentFilters.css";

function CashierPaymentFilters({
searchTerm = "",
setSearchTerm = () => {},
statusFilter = "ALL",
setStatusFilter = () => {},
methodFilter = "ALL",
setMethodFilter = () => {},
onReset = () => {}
}) {
const handleReset = () => {
setSearchTerm("");
setStatusFilter("ALL");
setMethodFilter("ALL");
onReset();
};

return ( <section className="cashier-payment-filters"> <div className="cashier-filter-heading"> <div> <h2>Payment Management</h2> <p>Search and filter payment records</p> </div>


    <button
      type="button"
      className="cashier-reset-btn"
      onClick={handleReset}
    >
      Reset Filters
    </button>
  </div>

  <div className="cashier-filter-controls">
    <div className="cashier-search-wrapper">
      <span className="cashier-search-icon" aria-hidden="true">
        🔍
      </span>

      <input
        type="search"
        className="cashier-search-input"
        placeholder="Search by payment ID or session ID..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        aria-label="Search payments by payment ID or session ID"
      />
    </div>

    <div className="cashier-filter-group">
      <label htmlFor="cashier-status-filter">Payment Status</label>

      <select
        id="cashier-status-filter"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="ALL">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="PROCESSING">Processing</option>
        <option value="COMPLETED">Completed</option>
        <option value="FAILED">Failed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>

    <div className="cashier-filter-group">
      <label htmlFor="cashier-method-filter">Payment Method</label>

      <select
        id="cashier-method-filter"
        value={methodFilter}
        onChange={(event) => setMethodFilter(event.target.value)}
      >
        <option value="ALL">All Methods</option>
        <option value="CASH">Cash</option>
        <option value="UPI">UPI</option>
        <option value="CARD">Card</option>
      </select>
    </div>
  </div>
</section>


);
}

export default CashierPaymentFilters;
