package restaurant_backend.dto.websocket;

import java.time.LocalDateTime;

public record WebSocketEvent<T>(
        String type,
        T data,
        LocalDateTime timestamp
) {
}