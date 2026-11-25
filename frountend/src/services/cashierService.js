import api from "./api";

// Fetch payment details using payment ID
export const getPayment = async (paymentId) => {
const response = await api.get(
`/cashier/payments/${paymentId}`
);

return response.data;
};

// Fetch payment details using session ID
export const getPaymentBySession = async (sessionId) => {
const response = await api.get(
`/cashier/payments/session/${sessionId}`
);

return response.data;
};

// Complete a cash payment
export const completeCashPayment = async (paymentId) => {
const response = await api.post(
`/cashier/payments/${paymentId}/cash/complete`
);

return response.data;
};

// Complete a UPI payment using the transaction ID
export const completeUpiPayment = async (paymentId, transactionId) => {
const response = await api.post(
`/cashier/payments/${paymentId}/upi/complete`,
null,
{
params: {
transactionId,
},
}
);

return response.data;
};

// Close a session after payment
export const closeSession = async (sessionId) => {
const response = await api.post(
`/cashier/sessions/${sessionId}/close`
);

return response.data;
};

// Fetch all sessions waiting for bill payment
export const getPendingBillSessions = async () => {
    const response = await api.get(
        "/cashier/sessions/pending-bills"
    );

    return response.data;
};

// Create payment for a selected session
export const createPayment = async (sessionId, paymentMethod) => {
    const response = await api.post(
        `/payments/session/${sessionId}`,
        {
            paymentMethod
        }
    );

    return response.data;
};

export const getAllPayments = async () => {
    const response = await api.get("/payments");
    return response.data;
};
const cashierService = {
    getPayment,
    getPaymentBySession,
    completeCashPayment,
    completeUpiPayment,
    closeSession,
    getPendingBillSessions,
    createPayment,
    getAllPayments
};



export default cashierService;
