import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const order = location.state?.order;
    const session = location.state?.session;

    // Handle direct access without order information
    if (!order) {
        return (
            <div className="confirmation-error">
                <h2>Order information not found</h2>
                <p>Please check your order history.</p>

                <button onClick={() => navigate("/customer")}>
                    Back to Menu
                </button>
            </div>
        );
    }

    const formatPrice = (amount) =>
        `₹${Number(amount || 0).toFixed(2)}`;

    return (
        <div className="confirmation-page">

            <div className="confirmation-card">

                {/* Success Section */}
                <div className="confirmation-success">
                    <div className="success-icon">✓</div>

                    <h1>Order Placed Successfully!</h1>

                    <p>
                        Your order has been received.
                        We're getting it ready for you.
                    </p>
                </div>

                {/* Order Information */}
                <div className="confirmation-order-info">

                    <div>
                        <span>Order Number</span>
                        <h2>{order.orderNumber}</h2>
                    </div>

                    <div>
                        <span>Table Number</span>
                        <h2>
                            {session?.tableNumber ||
                                order.tableNumber ||
                                "N/A"}
                        </h2>
                    </div>

                    <div>
                        <span>Order Status</span>
                        <h2 className="order-status">
                            {order.status}
                        </h2>
                    </div>

                </div>

                {/* Ordered Items */}
                <div className="confirmation-items">

                    <h3>Order Summary</h3>

                    {order.items?.map((item) => (
                        <div
                            className="confirmation-item"
                            key={item.id}
                        >
                            <div>
                                <h4>{item.menuItemName}</h4>

                                <span>
                                    {item.quantity} × {formatPrice(item.price)}
                                </span>
                            </div>

                            <strong>
                                {formatPrice(item.subtotal)}
                            </strong>
                        </div>
                    ))}

                </div>

                {/* Total */}
                <div className="confirmation-total">
                    <span>Total Amount</span>

                    <h2>
                        {formatPrice(order.totalAmount)}
                    </h2>
                </div>

                {/* Actions */}
                <div className="confirmation-actions">

                    <button
                        className="track-order-btn"
                        onClick={() =>
                            navigate(
                                `/customer/orders/${order.id}`,
                                {
                                    state: {
                                        order,
                                        session
                                    }
                                }
                            )
                        }
                    >
                        Track Order
                    </button>

                    <button
                        className="back-menu-btn"
                        onClick={() => navigate("/customer")}
                    >
                        Back to Menu
                    </button>

                </div>

            </div>

        </div>
    );
};

export default OrderConfirmation;