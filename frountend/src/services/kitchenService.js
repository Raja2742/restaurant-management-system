import api from "./api";

// 1. Get all kitchen orders
export const getKitchenOrders = async() => {
const responce=
  await api.get("/kitchen/orders");
  return responce.data;
};

// 2. Get orders by status
export const getOrdersByStatus = async(status) => {
const responce= await  api.get(`/kitchen/orders/status/${status}`);
return responce.data;
};

// 3. Get a specific order
export const getKitchenOrder = async(orderId) => {
const responce= await api.get(`/kitchen/orders/${orderId}`);
return responce.data;
};

// 4. Accept an order
export const acceptOrder = async(orderId) => {
const responce= await api.patch(`/kitchen/orders/${orderId}/accept`);
return responce.data;
};

// 5. Start preparing an order
export const startPreparing = async(orderId) => {
const responce= await api.patch(`/kitchen/orders/${orderId}/preparing`);
return responce.data;
};

// 6. Mark an order as ready
export const markOrderReady = async(orderId) => {
const responce= await api.patch(`/kitchen/orders/${orderId}/ready`);
return responce.data;
};
