package restaurant_backend.dto.payment;

import restaurant_backend.entity.PaymentMethod;
import restaurant_backend.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(

        Long id,

        Long sessionId,

        BigDecimal amount,

        PaymentMethod method,

        PaymentStatus status,

        String transactionId,

        LocalDateTime paidAt,

        LocalDateTime createdAt

) {
}