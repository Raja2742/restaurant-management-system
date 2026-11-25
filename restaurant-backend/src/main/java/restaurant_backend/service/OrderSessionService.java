package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.session.SessionResponse;
import restaurant_backend.entity.OrderSession;
import restaurant_backend.entity.OrderSessionStatus;
import restaurant_backend.entity.RestaurantTable;
import restaurant_backend.entity.TableStatus;
import restaurant_backend.exception.BadRequestException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.OrderSessionRepository;
import restaurant_backend.repository.RestaurantTableRepository;
import restaurant_backend.repository.OrderRepository;
import java.util.List;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderSessionService {

    private final OrderRepository orderRepository;
    private final OrderSessionRepository orderSessionRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final WebSocketNotificationService
            webSocketNotificationService;

    public List<SessionResponse> getPendingBillSessions() {

        return orderSessionRepository
                .findByStatus(OrderSessionStatus.BILL_REQUESTED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SessionResponse releaseSession(Long sessionId) {

        OrderSession session = getSessionEntity(sessionId);

        // Only ACTIVE sessions can be released.
        if (session.getStatus() != OrderSessionStatus.ACTIVE) {
            throw new BadRequestException(
                    "Only active sessions can be released"
            );
        }

        // Do not release a session if an order already exists.
        boolean hasOrders =
                orderRepository.existsByOrderSessionId(sessionId);

        if (hasOrders) {
            throw new BadRequestException(
                    "Cannot release this table because orders already exist"
            );
        }

        // Close the session.
        session.setStatus(OrderSessionStatus.CLOSED);
        session.setClosedAt(LocalDateTime.now());

        // Make the table available again.
        RestaurantTable table = session.getRestaurantTable();
        table.setStatus(TableStatus.AVAILABLE);

        restaurantTableRepository.save(table);

        OrderSession closedSession =
                orderSessionRepository.save(session);

        SessionResponse response = toResponse(closedSession);

        // Notify the waiter dashboard.
        webSocketNotificationService.notifyWaiterSession(
                "SESSION_RELEASED",
                response
        );

        // Notify the customer's session topic as well.
        webSocketNotificationService.notifySession(
                sessionId,
                "SESSION_RELEASED",
                response
        );

        return response;
    }
    public SessionResponse getActiveSession(Long tableId) {

        OrderSession session =
                orderSessionRepository
                        .findByRestaurantTableIdAndStatus(
                                tableId,
                                OrderSessionStatus.ACTIVE
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No active session found for this table"
                                )
                        );

        return toResponse(session);
    }

    @Transactional
    public SessionResponse createSession(Long tableId) {

        RestaurantTable table =
                restaurantTableRepository.findById(tableId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        boolean activeSessionExists =
                orderSessionRepository
                        .findByRestaurantTableIdAndStatus(
                                tableId,
                                OrderSessionStatus.ACTIVE
                        )
                        .isPresent();

        if (activeSessionExists) {
            throw new BadRequestException(
                    "Table already has an active session"
            );
        }

        OrderSession session = new OrderSession();

        session.setSessionNumber(
                generateSessionNumber()
        );

        session.setRestaurantTable(table);
        session.setStatus(OrderSessionStatus.ACTIVE);

        table.setStatus(TableStatus.OCCUPIED);

        restaurantTableRepository.save(table);

        OrderSession savedSession =
                orderSessionRepository.save(session);

        SessionResponse response = toResponse(savedSession);

        webSocketNotificationService.notifyWaiterSession(
                "SESSION_CREATED",
                response
        );

        return response;
    }

    @Transactional
    public SessionResponse getOrCreateActiveSession(
            Long tableId
    ) {

        return orderSessionRepository
                .findByRestaurantTableIdAndStatus(
                        tableId,
                        OrderSessionStatus.ACTIVE
                )
                .map(this::toResponse)
                .orElseGet(() ->
                        createSession(tableId)
                );
    }

    @Transactional
    public SessionResponse requestBill(Long sessionId) {

        OrderSession session =
                getSessionEntity(sessionId);

        if (session.getStatus()
                != OrderSessionStatus.ACTIVE) {

            throw new BadRequestException(
                    "Bill cannot be requested for this session"
            );
        }

        session.setStatus(
                OrderSessionStatus.BILL_REQUESTED
        );

        RestaurantTable table =
                session.getRestaurantTable();

        table.setStatus(
                TableStatus.WAITING_FOR_BILL
        );

        restaurantTableRepository.save(table);

        OrderSession updatedSession =
                orderSessionRepository.save(session);

        SessionResponse response =
                toResponse(updatedSession);


        webSocketNotificationService.notifySession(
                sessionId,
                "BILL_REQUESTED",
                response
        );

        webSocketNotificationService.notifyCashierSession(
                "BILL_REQUESTED",
                response
        );

        return response;
    }

    @Transactional
    public SessionResponse markAsPaid(Long sessionId) {

        OrderSession session =
                getSessionEntity(sessionId);

        if (session.getStatus()
                != OrderSessionStatus.BILL_REQUESTED) {

            throw new BadRequestException(
                    "Session is not waiting for payment"
            );
        }

        session.setStatus(
                OrderSessionStatus.PAID
        );

        OrderSession updatedSession =
                orderSessionRepository.save(session);

        SessionResponse response =
                toResponse(updatedSession);

        webSocketNotificationService.notifySession(
                sessionId,
                "SESSION_PAID",
                response
        );

        return response;
    }

    @Transactional
    public SessionResponse closeSession(Long sessionId) {

        OrderSession session =
                getSessionEntity(sessionId);

        if (session.getStatus()
                != OrderSessionStatus.PAID) {

            throw new BadRequestException(
                    "Session cannot be closed before payment"
            );
        }

        session.setStatus(
                OrderSessionStatus.CLOSED
        );

        session.setClosedAt(
                LocalDateTime.now()
        );

        RestaurantTable table =
                session.getRestaurantTable();

        table.setStatus(
                TableStatus.AVAILABLE
        );

        restaurantTableRepository.save(table);

        OrderSession closedSession =
                orderSessionRepository.save(session);

        SessionResponse response =
                toResponse(closedSession);

        webSocketNotificationService.notifySession(
                sessionId,
                "SESSION_CLOSED",
                response
        );

        return response;
    }

    public SessionResponse getSessionById(Long sessionId) {

        return toResponse(
                getSessionEntity(sessionId)
        );
    }

    /*
     * Internal method.
     *
     * Other services such as OrderService and PaymentService
     * can use this when they need the actual entity.
     */
    public OrderSession getSessionEntity(Long sessionId) {

        return orderSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order session not found"
                        )
                );
    }

    private SessionResponse toResponse(
            OrderSession session
    ) {

        return new SessionResponse(
                session.getId(),
                session.getSessionNumber(),
                session.getRestaurantTable().getId(),
                session.getRestaurantTable().getTableNumber(),
                session.getStatus(),
                session.getCreatedAt(),
                session.getClosedAt()
        );
    }

    private String generateSessionNumber() {

        return "SES-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }
}