import "./KitchenEmptyState.css";
function KitchenEmptyState({ filter = "ALL" }) {
const message =
filter === "ALL"
? "There are no orders yet."
: `There are no ${filter.toLowerCase()} orders right now.`;

return ( <div className="kitchen-empty-state"> <div className="kitchen-empty-state__icon" aria-hidden="true">
📋 </div>


  <h3>No Orders Found</h3>
  <p>{message}</p>
</div>


);
}

export default KitchenEmptyState;
