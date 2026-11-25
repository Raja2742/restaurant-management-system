import api from "./api";


export const getWaiterOrders = async () => {
const response = await api.get("/waiter/orders");
return response.data;
};

export const getReadyOrders = async () => {
const response = await api.get("/waiter/orders/ready");
return response.data;
};

export const getWaiterTables = async () => {
const response = await api.get("/waiter/tables");
return response.data;
};

export const getWaiterTable = async (tableId) => {
const response = await api.get(`/waiter/tables/${tableId}`);
return response.data;
};

export const markOrderAsServed = async (orderId) => {
const response = await api.patch(`/waiter/orders/${orderId}/served`);
return response.data;
};

export const completeOrder = async (orderId) => {
const response = await api.patch(`/waiter/orders/${orderId}/complete`);
return response.data;
};

export const releaseTableSession = async (sessionId) => {
    return (
        await api.patch(`/waiter/sessions/${sessionId}/release`)
    ).data;
};

export const requestBill = async (sessionId) => {
    const response = await api.post(
        `/sessions/${sessionId}/request-bill`
    );

    return response.data;
};