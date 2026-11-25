package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import restaurant_backend.dto.order.OrderResponse;
import restaurant_backend.dto.payment.PaymentResponse;
import restaurant_backend.dto.session.SessionResponse;
import restaurant_backend.dto.websocket.WebSocketEvent;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyWaiterSession(
            String eventType,
            SessionResponse session
    ) {

        WebSocketEvent<SessionResponse> event =
                new WebSocketEvent<>(
                        eventType,
                        session,
                        LocalDateTime.now()
                );

        messagingTemplate.convertAndSend(
                "/topic/waiter",
                event
        );
    }

    public void notifyKitchen(
            String eventType,
            OrderResponse order
    ) {

        WebSocketEvent<OrderResponse> event =
                new WebSocketEvent<>(
                        eventType,
                        order,
                        LocalDateTime.now()
                );

        messagingTemplate.convertAndSend(
                "/topic/kitchen",
                event
        );
    }

    public void notifyWaiter(
            String eventType,
            OrderResponse order
    ) {

        WebSocketEvent<OrderResponse> event =
                new WebSocketEvent<>(
                        eventType,
                        order,
                        LocalDateTime.now()
                );

        messagingTemplate.convertAndSend(
                "/topic/waiter",
                event
        );
    }

    public void notifyCustomer(
            Long sessionId,
            String eventType,
            OrderResponse order
    ) {

        WebSocketEvent<OrderResponse> event =
                new WebSocketEvent<>(
                        eventType,
                        order,
                        LocalDateTime.now()
                );

        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId,
                event
        );
    }

    public void notifyPayment(
            Long sessionId,
            String eventType,
            PaymentResponse payment
    ) {

        WebSocketEvent<PaymentResponse> event =
                new WebSocketEvent<>(
                        eventType,
                        payment,
                        LocalDateTime.now()
                );

        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/payment",
                event
        );
    }

    public void notifySession(
            Long sessionId,
            String eventType,
            SessionResponse session
    ) {

        WebSocketEvent<SessionResponse> event =
                new WebSocketEvent<>(
                        eventType,
                        session,
                        LocalDateTime.now()
                );

        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId,
                event
        );
    }
    public void notifyCashierSession(
            String eventType,
            SessionResponse session
    ) {
        messagingTemplate.convertAndSend(
                "/topic/cashier",
                new WebSocketEvent<>(
                        eventType,
                        session,
                        LocalDateTime.now()
                )
        );
    }
}