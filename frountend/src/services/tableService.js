import api from "./api";

export async function getAllTables() {
    const response = await api.get("/tables");
    return response.data;
}

export async function getTableById(tableId) {
    const response = await api.get(`/tables/${tableId}`);
    return response.data;
}

export async function getTableByQrCode(qrCode) {
    const response = await api.get(
        `/tables/qr/${encodeURIComponent(qrCode)}`
    );
    return response.data;
}