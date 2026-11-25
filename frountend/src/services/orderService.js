import api from "./api";

// Create a new order for a session
export const createOrder = async (sessionId, items) => {
    const response = await api.post(
        `/orders?sessionId=${sessionId}`,
        { items }
    );

    return response.data;
};

// Get order using its ID
export const getOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);

    return response.data;
};

// Get order using its order number
export const getOrderByNumber = async (orderNumber) => {
    const response = await api.get(
        `/orders/number/${orderNumber}`
    );

    return response.data;
};

// Get all orders belonging to a session
export const getOrdersBySession = async (sessionId) => {
    const response = await api.get(
        `/orders/session/${sessionId}`
    );

    return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    const response = await api.patch(
        `/orders/${orderId}/status`,
        null,
        {
            params: { status }
        }
    );

    return response.data;
};