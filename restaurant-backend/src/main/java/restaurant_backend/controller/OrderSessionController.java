package restaurant_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.session.SessionResponse;
import restaurant_backend.service.OrderSessionService;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class OrderSessionController {

    private final OrderSessionService orderSessionService;

    @GetMapping("/table/{tableId}")
    public ResponseEntity<SessionResponse> getActiveSession(
            @PathVariable Long tableId
    ) {

        return ResponseEntity.ok(
                orderSessionService.getActiveSession(tableId)
        );
    }

    @PostMapping("/table/{tableId}")
    public ResponseEntity<SessionResponse> createSession(
            @PathVariable Long tableId
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        orderSessionService.createSession(
                                tableId
                        )
                );
    }

    @PostMapping("/table/{tableId}/start")
    public ResponseEntity<SessionResponse> startSession(
            @PathVariable Long tableId
    ) {

        return ResponseEntity.ok(
                orderSessionService
                        .getOrCreateActiveSession(tableId)
        );
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<SessionResponse> getSession(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                orderSessionService
                        .getSessionById(sessionId)
        );
    }

    @PostMapping("/{sessionId}/request-bill")
    public ResponseEntity<SessionResponse> requestBill(
            @PathVariable Long sessionId
    ) {

        return ResponseEntity.ok(
                orderSessionService
                        .requestBill(sessionId)
        );
    }




}