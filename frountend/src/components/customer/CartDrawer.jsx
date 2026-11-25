import {
    getImageUrl,
    handleFoodImageError
} from "../../utils/imageUtils";

import "./CartDrawer.css";

export default function CartDrawer({
    isOpen,
    cart = [],
    cartCount = 0,
    cartTotal = 0,
    onClose,
    onUpdateQuantity,
    onCheckout
}) {
    if (!isOpen) return null;

    return (
        <div
            className="cart-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <aside
                className="cart-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
            >

                {/* Header */}
                <div className="cart-header">
                    <div>
                        <span className="section-eyebrow">
                            YOUR SELECTION
                        </span>

                        <h2>Your cart ({cartCount})</h2>
                    </div>

                    <button
                        className="close-cart"
                        type="button"
                        onClick={onClose}
                        aria-label="Close cart"
                    >
                        ×
                    </button>
                </div>

                {/* Empty Cart */}
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <span className="empty-cart-icon">🛍</span>

                        <h3>Your cart is empty</h3>

                        <p>
                            Discover something delicious from our menu.
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Explore menu
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div
                                    className="cart-item"
                                    key={item.id}
                                >
                                    <img
                                        src={getImageUrl(item.imageUrl)}
                                        alt={item.name}
                                        onError={handleFoodImageError}
                                    />

                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>

                                        <p>
                                            ₹{Number(item.price || 0).toFixed(2)}
                                        </p>

                                        <div className="quantity-control">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onUpdateQuantity(item.id, -1)
                                                }
                                                aria-label={`Remove one ${item.name}`}
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onUpdateQuantity(item.id, 1)
                                                }
                                                aria-label={`Add one ${item.name}`}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <strong className="cart-item-total">
                                        ₹{(
                                            Number(item.price || 0) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary">
                            <div className="cart-subtotal">
                                <span>Subtotal</span>

                                <strong>
                                    ₹{Number(cartTotal).toFixed(2)}
                                </strong>
                            </div>

                            <p>
                                Final charges and applicable taxes will be
                                confirmed by the server.
                            </p>

                            <button
                                type="button"
                                className="checkout-button"
                                onClick={onCheckout}
                                disabled={cart.length === 0}
                            >
                                Proceed to Checkout
                                <span>→</span>
                            </button>
                        </div>
                    </>
                )}

            </aside>
        </div>
    );
}