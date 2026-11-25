package restaurant_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.payment.PaymentResponse;
import restaurant_backend.dto.session.SessionResponse;
import restaurant_backend.service.CashierService;
import java.util.List;
import restaurant_backend.service.OrderSessionService;

@RestController
@RequestMapping("/api/cashier")
@RequiredArgsConstructor
public class CashierController {

    private final CashierService cashierService;
    private final OrderSessionService orderSessionService;

    @GetMapping("/payments/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(
            @PathVariable Long paymentId
    ) {

        return ResponseEntity.ok(
                cashierService.getPayment(paymentId)
        );
    }

    @GetMapping("/payments/session/{sessionId}")
    public ResponseEntity<PaymentResponse> getPaymentBySession(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                cashierService.getPaymentBySession(
                        sessionId
                )
        );
    }

    @PostMapping("/payments/{paymentId}/cash/complete")
    public ResponseEntity<PaymentResponse> completeCashPayment(
            @PathVariable Long paymentId
    ) {

        return ResponseEntity.ok(
                cashierService.completeCashPayment(
                        paymentId
                )
        );
    }

    @PostMapping("/payments/{paymentId}/upi/complete")
    public ResponseEntity<PaymentResponse> completeUpiPayment(
            @PathVariable Long paymentId,
            @RequestParam String transactionId
    ) {

        return ResponseEntity.ok(
                cashierService.completeUpiPayment(
                        paymentId,
                        transactionId
                )
        );
    }

    @PostMapping("/sessions/{sessionId}/close")
    public ResponseEntity<SessionResponse> closeSession(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                cashierService.closeSession(
                        sessionId
                )
        );
    }
    @GetMapping("/sessions/pending-bills")
    public ResponseEntity<List<SessionResponse>> getPendingBillSessions() {

        return ResponseEntity.ok(
                cashierService.getPendingBillSessions()
        );
    }

}