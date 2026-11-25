package restaurant_backend.dto.table;

import restaurant_backend.entity.TableStatus;

public record TableResponse(
        Long id,
        String tableNumber,
        Integer capacity,
        TableStatus status,
        String qrCode,
        Long activeSessionId
) {
}