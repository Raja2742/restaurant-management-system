import "./KitchenOrderCard.css";
import KitchenOrderActions from "./KitchenOrderActions";

function KitchenOrderCard({
  id,
  orderNumber,
  status,
  items,
  totalAmount,
  createdAt,
  onStatusUpdated,
}) {
return ( <article className="kitchen-order-card"> <header className="kitchen-order-card__header"> <h3 className="kitchen-order-card__number">
Order #{orderNumber} </h3>


    <span className={`kitchen-order-card__status kitchen-order-card__status--${status?.toLowerCase()}`}>
      {status}
    </span>
  </header>

  <section className="kitchen-order-card__items">
    <h4 className="kitchen-order-card__section-title">Order Items</h4>

    {items?.length > 0 ? (
      <ul className="kitchen-order-card__item-list">
        {items.map((item) => (
          <li className="kitchen-order-card__item" key={item.id}>
            <span className="kitchen-order-card__item-name">
              {item.menuItemName}
            </span>

            <span className="kitchen-order-card__item-quantity">
              × {item.quantity}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="kitchen-order-card__empty">No items in this order.</p>
    )}
  </section>

  <footer className="kitchen-order-card__footer">
    <div className="kitchen-order-card__time">
      <span>Ordered at</span>
      <time dateTime={createdAt}>
        {createdAt ? new Date(createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) : "Time unavailable"}
      </time>
    </div>

    <div className="kitchen-order-card__total">
      <span>Total</span>
      <strong>₹{Number(totalAmount ?? 0).toFixed(2)}</strong>
    </div>
  </footer>

  <KitchenOrderActions
  orderId={id}
  status={status}
  onStatusUpdated={onStatusUpdated}
/>
</article>


);
}

export default KitchenOrderCard;
