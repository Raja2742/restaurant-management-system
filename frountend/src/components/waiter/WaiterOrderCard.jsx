import "./WaiterOrderCard.css";

function WaiterOrderCard({ order, onSelectOrder }) {
const {
id,
orderNumber,
status,
items = [],
totalAmount,
createdAt,
tableNumber,
} = order;

const normalizedStatus = (status ?? "UNKNOWN").toLowerCase();

const formattedTime = createdAt
? new Date(createdAt).toLocaleTimeString("en-IN", {
hour: "2-digit",
minute: "2-digit",
})
: "Time unavailable";

return ( <article className="waiter-order-card"> <header className="waiter-order-card__header"> <div> <p className="waiter-order-card__label">Order Number</p> <h3 className="waiter-order-card__number">
#{orderNumber ?? id} </h3> </div>


    <span
      className={`waiter-order-card__status waiter-order-card__status--${normalizedStatus}`}
    >
      {(status ?? "UNKNOWN").replace(/_/g, " ")}
    </span>
  </header>

  <div className="waiter-order-card__info">
    <div className="waiter-order-card__info-item">
      <span aria-hidden="true">🪑</span>
      <span>
        {tableNumber != null
          ? `Table ${tableNumber}`
          : "Table not assigned"}
      </span>
    </div>

    <div className="waiter-order-card__info-item">
      <span aria-hidden="true">🕒</span>
      <time dateTime={createdAt || undefined}>
        {formattedTime}
      </time>
    </div>
  </div>

  <section className="waiter-order-card__items">
    <h4>Ordered Items</h4>

    {items.length > 0 ? (
      <ul>
        {items.map((item) => (
          <li key={item.id ?? item.menuItemId}>
            <span className="waiter-order-card__item-name">
              {item.menuItemName}
            </span>

            <span className="waiter-order-card__item-quantity">
              × {item.quantity}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="waiter-order-card__empty">
        No items available.
      </p>
    )}
  </section>

  <footer className="waiter-order-card__footer">
    <div>
      <span className="waiter-order-card__total-label">
        Total Amount
      </span>

      <strong className="waiter-order-card__total">
        ₹{Number(totalAmount ?? 0).toFixed(2)}
      </strong>
    </div>

    <button
      type="button"
      className="waiter-order-card__button"
      onClick={() => onSelectOrder?.(order)}
    >
      View Details
    </button>
  </footer>
</article>


);
}

export default WaiterOrderCard;
