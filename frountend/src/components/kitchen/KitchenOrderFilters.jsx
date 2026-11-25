import "./KitchenOrderFilters.css";
function KitchenOrderFilters({ activeFilter, onFilterChange, orders = [] }) {
const filters = [
{ label: "All Orders", value: "ALL" },
{ label: "placed", value: "PLACED" },
{ label: "Preparing", value: "PREPARING" },
{ label: "Ready", value: "READY" },
];

const getCount = (filterValue) => {
if (filterValue === "ALL") {
return orders.length;
}


return orders.filter(
  (order) => order.status === filterValue
).length;


};

return ( <section className="kitchen-order-filters"> <div className="kitchen-order-filters__heading"> <h2>Kitchen Orders</h2> <p>Track and manage your orders</p> </div>


  <div className="kitchen-order-filters__buttons">
    {filters.map((filter) => (
      <button
        key={filter.value}
        type="button"
        className={`kitchen-order-filters__button ${
          activeFilter === filter.value
            ? "kitchen-order-filters__button--active"
            : ""
        }`}
        onClick={() => onFilterChange(filter.value)}
        aria-pressed={activeFilter === filter.value}
      >
        {filter.label}
        <span className="kitchen-order-filters__count">
          {getCount(filter.value)}
        </span>
      </button>
    ))}
  </div>
</section>


);
}

export default KitchenOrderFilters;
