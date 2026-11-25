package restaurant_backend.dto.session;

import restaurant_backend.entity.OrderSessionStatus;

import java.time.LocalDateTime;

public record SessionResponse(

        Long id,

        String sessionNumber,

        Long tableId,

        String tableNumber,

        OrderSessionStatus status,

        LocalDateTime createdAt,

        LocalDateTime closedAt

) {
}