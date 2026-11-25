import "./CheckoutSummary.css";

const CheckoutSummary = ({ cart = [], cartTotal = 0 }) => {

    const formatPrice = (amount) =>
        `₹${Number(amount || 0).toFixed(2)}`;

    return (
        <div className="checkout-summary">

            <div className="checkout-summary-header">
                <h2>Order Summary</h2>
                <span>{cart.length} items</span>
            </div>

            <div className="checkout-summary-items">

                {cart.length === 0 ? (
                    <p className="checkout-summary-empty">
                        Your cart is empty.
                    </p>
                ) : (
                    cart.map((item) => (
                        <div
                            className="checkout-summary-item"
                            key={item.id}
                        >
                            <div className="checkout-summary-item-info">
                                <h4>{item.name}</h4>

                                <span>
                                    {item.quantity} × {formatPrice(item.price)}
                                </span>
                            </div>

                            <strong>
                                {formatPrice(
                                    Number(item.price) * item.quantity
                                )}
                            </strong>
                        </div>
                    ))
                )}

            </div>

            <div className="checkout-summary-total">
                <span>Total Amount</span>
                <strong>{formatPrice(cartTotal)}</strong>
            </div>

        </div>
    );
};

export default CheckoutSummary;