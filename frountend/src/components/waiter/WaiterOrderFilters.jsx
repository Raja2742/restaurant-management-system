import React from "react";
import "./WaiterOrderFilters.css";

const FILTERS = [
{ label: "All Orders", value: "ALL" },
{ label: "placed", value: "PLACED" },
{ label: "Accepted", value: "ACCEPTED" },
{ label: "Preparing", value: "PREPARING" },
{ label: "Ready", value: "READY" },
{ label: "Served", value: "SERVED" },
];

const WaiterOrderFilters = ({
orders = [],
activeFilter = "ALL",
onFilterChange,
}) => {
const getCount = (status) => {
if (status === "ALL") {
return orders.length;
}


return orders.filter(
  (order) => order.status?.toUpperCase() === status
).length;


};

return ( <section className="waiter-order-filters"> <div className="waiter-filter-heading"> <div> <h2>Customer Orders</h2> <p>Track orders and manage table service.</p> </div>


    <span className="waiter-total-orders">
      {orders.length} {orders.length === 1 ? "order" : "orders"}
    </span>
  </div>

  <div className="waiter-filter-list">
    {FILTERS.map((filter) => (
      <button
        key={filter.value}
        type="button"
        className={`waiter-filter-btn ${
          activeFilter === filter.value ? "active" : ""
        }`}
        onClick={() => onFilterChange?.(filter.value)}
        aria-pressed={activeFilter === filter.value}
      >
        <span>{filter.label}</span>
        <span className="waiter-filter-count">
          {getCount(filter.value)}
        </span>
      </button>
    ))}
  </div>
</section>


);
};

export default WaiterOrderFilters;
