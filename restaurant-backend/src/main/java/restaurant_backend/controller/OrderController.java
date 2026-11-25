package restaurant_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.order.CreateOrderRequest;
import restaurant_backend.dto.order.OrderResponse;
import restaurant_backend.entity.OrderStatus;
import restaurant_backend.service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @RequestParam Long sessionId,
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication
    ) {

        String customerEmail =
                authentication.getName();

        OrderResponse response =
                orderService.createOrder(
                        sessionId,
                        customerEmail,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                orderService.getOrderById(orderId)
        );
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(
            @PathVariable String orderNumber
    ) {

        return ResponseEntity.ok(
                orderService.getOrderByNumber(
                        orderNumber
                )
        );
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<OrderResponse>> getOrdersBySession(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                orderService.getOrdersBySession(
                        sessionId
                )
        );
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(
                        orderId,
                        status
                )
        );
    }
}