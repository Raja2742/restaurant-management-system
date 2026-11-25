package restaurant_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.order.OrderResponse;
import restaurant_backend.entity.OrderStatus;
import restaurant_backend.service.KitchenService;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
@RequiredArgsConstructor
public class KitchenController {

    private final KitchenService kitchenService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getKitchenOrders() {

        return ResponseEntity.ok(
                kitchenService.getKitchenOrders()
        );
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(
            @PathVariable OrderStatus status
    ) {

        return ResponseEntity.ok(
                kitchenService.getOrdersByStatus(status)
        );
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                kitchenService.getOrder(orderId)
        );
    }

    @PatchMapping("/orders/{orderId}/accept")
    public ResponseEntity<OrderResponse> acceptOrder(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                kitchenService.acceptOrder(orderId)
        );
    }

    @PatchMapping("/orders/{orderId}/preparing")
    public ResponseEntity<OrderResponse> startPreparing(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                kitchenService.startPreparing(orderId)
        );
    }

    @PatchMapping("/orders/{orderId}/ready")
    public ResponseEntity<OrderResponse> markReady(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                kitchenService.markReady(orderId)
        );
    }
}