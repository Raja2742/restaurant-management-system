import api from "./api";

export async function getAvailableMenuItems() {
    const response = await api.get("/menu/items/available");
    return response.data;
}
