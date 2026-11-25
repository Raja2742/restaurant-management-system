import "./OrderStatusTimeline.css";

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
        description: "Your order is completed."
    }
];

const OrderStatusTimeline = ({ status }) => {

    const currentStep = ORDER_STEPS.findIndex(
        (step) => step.status === status
    );

    if (status === "CANCELLED") {
        return (
            <div className="order-timeline-cancelled">
                <span>!</span>
                <div>
                    <h3>Order Cancelled</h3>
                    <p>This order has been cancelled.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="order-status-timeline">

            {ORDER_STEPS.map((step, index) => {

                const isCompleted = currentStep >= index;
                const isCurrent = currentStep === index;

                return (
                    <div
                        className={`order-timeline-step ${
                            isCompleted ? "completed" : ""
                        } ${isCurrent ? "current" : ""}`}
                        key={step.status}
                    >

                        <div className="order-timeline-indicator">
                            {isCompleted ? "✓" : index + 1}
                        </div>

                        <div className="order-timeline-content">
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>

                    </div>
                );
            })}

        </div>
    );
};

export default OrderStatusTimeline;
