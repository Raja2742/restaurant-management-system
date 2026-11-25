import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSession } from "../../context/SessionContext";
import { getOrdersBySession } from "../../services/orderService";

import "./OrderHistory.css";

const OrderHistory = () => {
    const navigate = useNavigate();
    const { session } = useSession();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        if (!session?.id) {
            setOrders([]);
            setLoading(false);
            return;
        }

        try {
            setError("");

            const data = await getOrdersBySession(session.id);

            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load order history."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [session?.id]);

    const formatPrice = (amount) =>
        `₹${Number(amount || 0).toFixed(2)}`;

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "COMPLETED":
            case "SERVED":
                return "history-status-success";

            case "CANCELLED":
                return "history-status-cancelled";

            case "PREPARING":
                return "history-status-preparing";

            case "READY":
                return "history-status-ready";

            default:
                return "history-status-pending";
        }
    };

    if (loading) {
        return (
            <div className="history-message">
                Loading your orders...
            </div>
        );
    }

    return (
        <div className="order-history-page">

            <div className="order-history-container">

                <div className="history-header">
                    <div>
                        <h1>Your Orders</h1>
                        <p>
                            View the orders placed during your current table session.
                        </p>
                    </div>

                    <button
                        className="history-back-btn"
                        onClick={() => navigate("/customer")}
                    >
                        Back to Menu
                    </button>
                </div>

                {!session?.id ? (
                    <div className="history-empty">
                        <h2>No active table session</h2>
                        <p>
                            Select a table to view its orders.
                        </p>

                        <button onClick={() => navigate("/customer")}>
                            Select Table
                        </button>
                    </div>
                ) : error ? (
                    <div className="history-empty">
                        <h2>Something went wrong</h2>
                        <p>{error}</p>

                        <button onClick={fetchOrders}>
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="history-empty">
                        <div className="history-empty-icon">🛒</div>

                        <h2>No orders yet</h2>

                        <p>
                            Your orders will appear here after you place them.
                        </p>

                        <button onClick={() => navigate("/customer")}>
                            Explore Menu
                        </button>
                    </div>
                ) : (
                    <div className="history-orders">

                        {orders.map((order) => (
                            <div
                                className="history-order-card"
                                key={order.id}
                            >

                                <div className="history-order-header">

                                    <div>
                                        <span>Order Number</span>
                                        <h3>{order.orderNumber}</h3>
                                    </div>

                                    <span
                                        className={`history-status ${getStatusClass(order.status)}`}
                                    >
                                        {order.status}
                                    </span>

                                </div>

                                <div className="history-order-date">
                                    {formatDate(order.createdAt)}
                                </div>

                                <div className="history-order-items">

                                    {order.items?.map((item) => (
                                        <div
                                            className="history-item"
                                            key={item.id}
                                        >
                                            <span>
                                                {item.menuItemName} × {item.quantity}
                                            </span>

                                            <strong>
                                                {formatPrice(item.subtotal)}
                                            </strong>
                                        </div>
                                    ))}

                                </div>

                                <div className="history-order-footer">

                                    <div>
                                        <span>Total Amount</span>
                                        <h3>
                                            {formatPrice(order.totalAmount)}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/customer/orders/${order.id}`,
                                                {
                                                    state: { order }
                                                }
                                            )
                                        }
                                    >
                                        Track Order
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
};

export default OrderHistory;