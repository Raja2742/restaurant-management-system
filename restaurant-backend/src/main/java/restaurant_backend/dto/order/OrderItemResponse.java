package restaurant_backend.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long menuItemId,
        String menuItemName,
        Integer quantity,
        BigDecimal price,
        BigDecimal subtotal
) {
}