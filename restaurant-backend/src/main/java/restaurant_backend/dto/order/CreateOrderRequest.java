package restaurant_backend.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateOrderRequest(

        @NotEmpty(message = "Order must contain at least one item")
        List<@Valid OrderItemRequest> items
) {
}