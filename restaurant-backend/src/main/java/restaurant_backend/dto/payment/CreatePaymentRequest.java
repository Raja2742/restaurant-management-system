package restaurant_backend.dto.payment;

import jakarta.validation.constraints.NotNull;
import restaurant_backend.entity.PaymentMethod;

public record CreatePaymentRequest(

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod
) {
}