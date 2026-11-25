import api from "./api";

// Start a new session or retrieve the existing active session
export const startTableSession = async (tableId) => {
    const response = await api.post(`/sessions/table/${tableId}/start`);
    return response.data;
};

// Retrieve a session using its ID
export const getSessionById = async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
};

// Retrieve the active session for a particular table
export const getActiveSession = async (tableId) => {
    const response = await api.get(`/sessions/table/${tableId}`);
    return response.data;
};

// Request the bill for a session
export const requestSessionBill = async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/request-bill`);
    return response.data;
};