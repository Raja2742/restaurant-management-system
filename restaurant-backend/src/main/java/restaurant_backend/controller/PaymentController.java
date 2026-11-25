package restaurant_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.payment.CreatePaymentRequest;
import restaurant_backend.dto.payment.PaymentResponse;
import restaurant_backend.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/session/{sessionId}")
    public ResponseEntity<PaymentResponse> createPayment(
            @PathVariable Long sessionId,
            @Valid @RequestBody CreatePaymentRequest request
    ) {

        PaymentResponse response =
                paymentService.createPayment(
                        sessionId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPaymentById(
            @PathVariable Long paymentId
    ) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(
                        paymentId
                )
        );
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<PaymentResponse> getPaymentBySession(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                paymentService.getPaymentBySession(
                        sessionId
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {

        System.out.println("========== GET ALL PAYMENTS CALLED ==========");

        List<PaymentResponse> payments =
                paymentService.getAllPayments();

        System.out.println("Payments fetched: " + payments.size());

        return ResponseEntity.ok(payments);
    }
}