package restaurant_backend.dto.order;

import restaurant_backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(

        Long id,

        String orderNumber,

        Long sessionId,

        OrderStatus status,

        BigDecimal totalAmount,

        LocalDateTime createdAt,

        List<OrderItemResponse> items

) {
}