package restaurant_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.order.OrderResponse;
import restaurant_backend.dto.session.SessionResponse;
import restaurant_backend.dto.table.TableResponse;
import restaurant_backend.service.OrderSessionService;
import restaurant_backend.service.WaiterService;

import java.util.List;

@RestController
@RequestMapping("/api/waiter")
@RequiredArgsConstructor
public class WaiterController {

    private final WaiterService waiterService;
    private final OrderSessionService orderSessionService;

    @PatchMapping("/sessions/{sessionId}/release")
    public ResponseEntity<SessionResponse> releaseSession(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                orderSessionService.releaseSession(sessionId)
        );
    }

    @GetMapping("/orders/ready")
    public ResponseEntity<List<OrderResponse>> getReadyOrders() {

        return ResponseEntity.ok(
                waiterService.getReadyOrders()
        );
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getActiveOrders() {

        return ResponseEntity.ok(
                waiterService.getActiveOrders()
        );
    }

    @GetMapping("/tables")
    public ResponseEntity<List<TableResponse>> getAllTables() {

        return ResponseEntity.ok(
                waiterService.getAllTables()
        );
    }

    @GetMapping("/tables/{tableId}")
    public ResponseEntity<TableResponse> getTable(
            @PathVariable Long tableId
    ) {

        return ResponseEntity.ok(
                waiterService.getTable(tableId)
        );
    }

    @PatchMapping("/orders/{orderId}/served")
    public ResponseEntity<OrderResponse> serveOrder(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                waiterService.serveOrder(orderId)
        );
    }

    @PatchMapping("/orders/{orderId}/complete")
    public ResponseEntity<OrderResponse> completeOrder(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                waiterService.completeOrder(orderId)
        );
    }
}