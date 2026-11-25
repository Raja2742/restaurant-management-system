package restaurant_backend.dto.menu;

public record MenuCategoryResponse(
        Long id,
        String name,
        String description,
        Boolean active
) {
}