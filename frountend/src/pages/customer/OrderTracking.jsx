import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import { getOrderById } from "../../services/orderService";
import "./OrderTracking.css";

const ORDER_STEPS = [
    {
        status: "PLACED",
        title: "Order Placed",
        description: "Your order has been received."
    },
    {
        status: "ACCEPTED",
        title: "Order Accepted",
        description: "The restaurant has accepted your order."
    },
    {
        status: "PREPARING",
        title: "Preparing",
        description: "Your food is being prepared."
    },
    {
        status: "READY",
        title: "Ready",
        description: "Your order is ready."
    },
    {
        status: "SERVED",
        title: "Served",
        description: "Your order has been served."
    },
    {
        status: "COMPLETED",
        title: "Completed",
        description: "Enjoy your meal!"
    }
];

const OrderTracking = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [order, setOrder] = useState(
        location.state?.order || null
    );

    const [loading, setLoading] = useState(!order);
    const [error, setError] = useState("");

    // Fetch latest order information
    const fetchOrder = async () => {
        try {
            setError("");

            const data = await getOrderById(orderId);

            setOrder(data);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to retrieve order details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();

        const interval = setInterval(() => {
            fetchOrder();
        }, 15000);

        return () => clearInterval(interval);
    }, [orderId]);

    const currentStep = ORDER_STEPS.findIndex(
        (step) => step.status === order?.status
    );

    const formatPrice = (amount) =>
        `₹${Number(amount || 0).toFixed(2)}`;

    if (loading) {
        return (
            <div className="tracking-message">
                Loading order details...
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="tracking-message">
                <h2>Unable to load order</h2>
                <p>{error}</p>

                <button onClick={fetchOrder}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="tracking-page">

            <div className="tracking-container">

                <div className="tracking-header">
                    <div>
                        <h1>Track Your Order</h1>
                        <p>
                            Order #{order.orderNumber}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/customer")}
                    >
                        Back to Menu
                    </button>
                </div>

                {/* Cancelled Order */}
                {order.status === "CANCELLED" ? (
                    <div className="cancelled-card">
                        <div className="cancelled-icon">!</div>

                        <h2>Order Cancelled</h2>

                        <p>
                            Unfortunately, this order has been cancelled.
                        </p>
                    </div>
                ) : (

                    <>
                        {/* Progress Timeline */}
                        <div className="tracking-card">

                            <h2>Order Progress</h2>

                            <div className="tracking-timeline">

                                {ORDER_STEPS.map((step, index) => {

                                    const isCompleted =
                                        currentStep >= index;

                                    const isCurrent =
                                        currentStep === index;

                                    return (
                                        <div
                                            className={`timeline-step ${
                                                isCompleted ? "completed" : ""
                                            } ${
                                                isCurrent ? "current" : ""
                                            }`}
                                            key={step.status}
                                        >

                                            <div className="timeline-indicator">
                                                {isCompleted ? "✓" : index + 1}
                                            </div>

                                            <div className="timeline-content">
                                                <h3>{step.title}</h3>
                                                <p>{step.description}</p>
                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                        {/* Order Summary */}
                        <div className="tracking-card">

                            <h2>Order Summary</h2>

                            {order.items?.map((item) => (
                                <div
                                    className="tracking-item"
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

                            <div className="tracking-total">
                                <span>Total Amount</span>

                                <strong>
                                    {formatPrice(order.totalAmount)}
                                </strong>
                            </div>

                        </div>
                    </>
                )}

                <p className="tracking-refresh-note">
                    Order status refreshes automatically every 15 seconds.
                </p>

            </div>

        </div>
    );
};

export default OrderTracking;