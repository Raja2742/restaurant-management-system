package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.payment.PaymentResponse;
import restaurant_backend.dto.session.SessionResponse;
import restaurant_backend.entity.OrderSession;
import restaurant_backend.entity.OrderSessionStatus;
import restaurant_backend.entity.Payment;
import restaurant_backend.entity.PaymentMethod;
import restaurant_backend.exception.BadRequestException;
import java.util.List;
import restaurant_backend.repository.OrderSessionRepository;

@Service
@RequiredArgsConstructor
public class CashierService {

    private final PaymentService paymentService;
    private final OrderSessionService orderSessionService;
    private final OrderSessionRepository orderSessionRepository;

    public PaymentResponse getPayment(Long paymentId) {

        return paymentService.getPaymentById(paymentId);
    }

    public PaymentResponse getPaymentBySession(Long sessionId) {

        return paymentService.getPaymentBySession(sessionId);
    }

    @Transactional
    public PaymentResponse completeCashPayment(
            Long paymentId
    ) {

        Payment payment =
                paymentService.getPaymentEntity(paymentId);

        if (payment.getMethod() != PaymentMethod.CASH) {

            throw new BadRequestException(
                    "This is not a cash payment"
            );
        }

        return paymentService.completeCashPayment(
                paymentId
        );
    }

    @Transactional
    public PaymentResponse completeUpiPayment(
            Long paymentId,
            String transactionId
    ) {

        Payment payment =
                paymentService.getPaymentEntity(paymentId);

        if (payment.getMethod() != PaymentMethod.UPI) {

            throw new BadRequestException(
                    "This is not a UPI payment"
            );
        }

        return paymentService.completeUpiPayment(
                paymentId,
                transactionId
        );
    }

    @Transactional
    public SessionResponse closeSession(
            Long sessionId
    ) {

        OrderSession session =
                orderSessionService.getSessionEntity(
                        sessionId
                );

        if (session.getStatus() !=
                OrderSessionStatus.PAID) {

            throw new BadRequestException(
                    "Only PAID sessions can be closed"
            );
        }

        return orderSessionService.closeSession(
                sessionId
        );
    }
    public List<SessionResponse> getPendingBillSessions() {

        return orderSessionService.getPendingBillSessions();
    }
}