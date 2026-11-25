package restaurant_backend.dto.table;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TableRequest(

        @NotBlank(message = "Table number is required")
        @Size(
                max = 20,
                message = "Table number cannot exceed 20 characters"
        )
        String tableNumber,

        @NotNull(message = "Capacity is required")
        @Min(
                value = 1,
                message = "Table capacity must be at least 1"
        )
        Integer capacity,

        @Size(
                max = 255,
                message = "QR code cannot exceed 255 characters"
        )
        String qrCode
) {
}