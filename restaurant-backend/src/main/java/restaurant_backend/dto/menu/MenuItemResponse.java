package restaurant_backend.dto.menu;

import java.math.BigDecimal;

public record MenuItemResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        Boolean available,
        Long categoryId,
        String categoryName
) {
}