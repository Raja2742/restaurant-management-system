package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.payment.CreatePaymentRequest;
import restaurant_backend.dto.payment.PaymentResponse;
import restaurant_backend.entity.*;
import restaurant_backend.exception.BadRequestException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.PaymentRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderSessionService orderSessionService;
    private final OrderService orderService;
    private final WebSocketNotificationService
            webSocketNotificationService;


    @Transactional
    public PaymentResponse createPayment(
            Long sessionId,
            CreatePaymentRequest request
    ) {

        OrderSession session =
                orderSessionService.getSessionEntity(sessionId);

        if (session.getStatus()
                != OrderSessionStatus.BILL_REQUESTED) {

            throw new BadRequestException(
                    "Payment cannot be created. Bill has not been requested."
            );
        }

        if (paymentRepository.existsByOrderSessionIdAndStatus(
                sessionId,
                PaymentStatus.SUCCESS
        )) {

            throw new BadRequestException(
                    "This session has already been paid"
            );
        }

        /*
         * Prevent multiple pending payments
         * for the same session.
         */
        if (paymentRepository.findByOrderSessionId(sessionId)
                .filter(payment ->
                        payment.getStatus()
                                == PaymentStatus.PENDING)
                .isPresent()) {

            throw new BadRequestException(
                    "A pending payment already exists for this session"
            );
        }

        List<Order> orders =
                orderService.getOrderEntitiesBySession(
                        sessionId
                );

        if (orders.isEmpty()) {

            throw new BadRequestException(
                    "No orders found for this session"
            );
        }

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        for (Order order : orders) {

            if (order.getStatus()
                    == OrderStatus.CANCELLED) {

                continue;
            }

            totalAmount =
                    totalAmount.add(
                            order.getTotalAmount()
                    );
        }

        if (totalAmount.compareTo(
                BigDecimal.ZERO
        ) <= 0) {

            throw new BadRequestException(
                    "Payment amount must be greater than zero"
            );
        }

        Payment payment = new Payment();

        payment.setOrderSession(session);
        payment.setAmount(totalAmount);

        payment.setMethod(
                request.paymentMethod()
        );

        payment.setStatus(
                PaymentStatus.PENDING
        );

        /*
         * Cash payments get an internal reference.
         *
         * UPI transaction ID will be supplied only
         * after actual payment verification later.
         */
        if (request.paymentMethod()
                == PaymentMethod.CASH) {

            payment.setTransactionId(
                    generateCashTransactionId()
            );
        }

        Payment savedPayment =
                paymentRepository.save(payment);

        PaymentResponse response =
                toResponse(savedPayment);

        webSocketNotificationService.notifyPayment(
                sessionId,
                "PAYMENT_CREATED",
                response
        );

        return response;
    }

    @Transactional
    public PaymentResponse completeCashPayment(
            Long paymentId
    ) {

        Payment payment =
                getPaymentEntity(paymentId);

        if (payment.getMethod()
                != PaymentMethod.CASH) {

            throw new BadRequestException(
                    "This payment is not a cash payment"
            );
        }

        if (payment.getStatus()
                != PaymentStatus.PENDING) {

            throw new BadRequestException(
                    "Payment cannot be completed"
            );
        }

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setPaidAt(
                LocalDateTime.now()
        );

        Payment savedPayment =
                paymentRepository.save(payment);

        Long sessionId = payment.getOrderSession().getId();

// Update session status
        orderSessionService.markAsPaid(sessionId);

// Update all orders belonging to this session
        orderService.completeOrdersBySession(sessionId);

        PaymentResponse response =
                toResponse(savedPayment);

        webSocketNotificationService.notifyPayment(
                payment.getOrderSession().getId(),
                "PAYMENT_SUCCESS",
                response
        );

        return response;
    }

    @Transactional
    public PaymentResponse completeUpiPayment(
            Long paymentId,
            String transactionId
    ) {

        Payment payment =
                getPaymentEntity(paymentId);

        if (payment.getMethod()
                != PaymentMethod.UPI) {

            throw new BadRequestException(
                    "This payment is not a UPI payment"
            );
        }

        if (payment.getStatus()
                != PaymentStatus.PENDING) {

            throw new BadRequestException(
                    "Payment cannot be completed"
            );
        }

        if (transactionId == null ||
                transactionId.isBlank()) {

            throw new BadRequestException(
                    "Transaction ID is required"
            );
        }

        /*
         * TEMPORARY:
         * In the future this must be verified
         * using the actual UPI/payment gateway.
         */
        payment.setTransactionId(
                transactionId
        );

        payment.setStatus(
                PaymentStatus.SUCCESS
        );

        payment.setPaidAt(
                LocalDateTime.now()
        );

        Payment savedPayment =
                paymentRepository.save(payment);

        Long sessionId = payment.getOrderSession().getId();

        orderSessionService.markAsPaid(sessionId);

        orderService.completeOrdersBySession(sessionId);
        PaymentResponse response =
                toResponse(savedPayment);

        webSocketNotificationService.notifyPayment(
                payment.getOrderSession().getId(),
                "PAYMENT_SUCCESS",
                response
        );

        return response;
    }

    public PaymentResponse getPaymentById(
            Long paymentId
    ) {

        return toResponse(
                getPaymentEntity(paymentId)
        );
    }

    public PaymentResponse getPaymentBySession(
            Long sessionId
    ) {

        Payment payment =
                paymentRepository
                        .findByOrderSessionId(sessionId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payment not found for this session"
                                )
                        );

        return toResponse(payment);
    }

    /*
     * Internal entity method.
     */
    public Payment getPaymentEntity(
            Long paymentId
    ) {

        return paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found"
                        )
                );
    }

    private PaymentResponse toResponse(
            Payment payment
    ) {

        return new PaymentResponse(
                payment.getId(),
                payment.getOrderSession().getId(),
                payment.getAmount(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getTransactionId(),
                payment.getPaidAt(),
                payment.getCreatedAt()
        );
    }

    public List<PaymentResponse> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private String generateCashTransactionId() {

        return "CASH-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }
}