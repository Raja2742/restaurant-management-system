const API_ORIGIN = "http://localhost:8080";

export function getImageUrl(imageUrl) {
    if (!imageUrl) return "/food-placeholder.svg";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
        return imageUrl;
    }

    return `${API_ORIGIN}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

export function handleFoodImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/food-placeholder.svg";
}
