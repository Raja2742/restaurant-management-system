package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.order.*;
import restaurant_backend.entity.*;
import restaurant_backend.exception.BadRequestException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.MenuItemRepository;
import restaurant_backend.repository.OrderRepository;
import restaurant_backend.repository.UserRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final OrderSessionService orderSessionService;
    private final WebSocketNotificationService webSocketNotificationService;

    @Transactional
    public void completeOrdersBySession(Long sessionId) {

        List<Order> orders =
                orderRepository.findByOrderSessionId(sessionId);

        for (Order order : orders) {

            // Don't modify cancelled orders
            if (order.getStatus() == OrderStatus.CANCELLED) {
                continue;
            }

            order.setStatus(OrderStatus.COMPLETED);
        }

        orderRepository.saveAll(orders);
    }

    @Transactional
    public OrderResponse createOrder(
            Long sessionId,
            String customerEmail,
            CreateOrderRequest request
    ) {

        OrderSession session =
                orderSessionService.getSessionEntity(
                        sessionId
                );

        if (session.getStatus()
                != OrderSessionStatus.ACTIVE) {

            throw new BadRequestException(
                    "Cannot place order. Session is not active."
            );
        }

        Order order = new Order();

        order.setOrderNumber(
                generateOrderNumber()
        );

        order.setOrderSession(session);

        order.setStatus(
                OrderStatus.PLACED
        );

        order.setTotalAmount(
                BigDecimal.ZERO
        );

        /*
         * Get customer from authenticated user.
         */
        if (customerEmail != null) {

            User customer =
                    userRepository
                            .findByEmail(customerEmail)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Customer not found"
                                    )
                            );

            order.setCustomer(customer);
        }

        BigDecimal totalAmount =
                BigDecimal.ZERO;

        List<OrderItem> orderItems =
                new ArrayList<>();

        for (OrderItemRequest requestItem :
                request.items()) {

            MenuItem menuItem =
                    menuItemRepository
                            .findById(
                                    requestItem.menuItemId()
                            )
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Menu item not found: "
                                                    + requestItem.menuItemId()
                                    )
                            );

            if (!menuItem.getAvailable()) {

                throw new BadRequestException(
                        menuItem.getName()
                                + " is currently unavailable"
                );
            }

            BigDecimal price =
                    menuItem.getPrice();

            BigDecimal subtotal =
                    price.multiply(
                            BigDecimal.valueOf(
                                    requestItem.quantity()
                            )
                    );

            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(
                    requestItem.quantity()
            );
            orderItem.setPrice(price);
            orderItem.setSubtotal(subtotal);

            orderItems.add(orderItem);

            totalAmount =
                    totalAmount.add(subtotal);
        }

        order.setOrderItems(orderItems);

        order.setTotalAmount(
                totalAmount
        );

        Order savedOrder =
                orderRepository.save(order);

        OrderResponse response =
                toOrderResponse(savedOrder);

        /*
         * Notify kitchen that a new order has arrived.
         */
        webSocketNotificationService.notifyKitchen(
                "ORDER_PLACED",
                response
        );

        webSocketNotificationService.notifyWaiter(
                "ORDER_PLACED",
                response
        );

        /*
         * Notify customer dashboard as well.
         */
        webSocketNotificationService.notifyCustomer(
                sessionId,
                "ORDER_PLACED",
                response
        );

        return response;
    }

    public OrderResponse getOrderById(
            Long orderId
    ) {

        return toOrderResponse(
                getOrderEntity(orderId)
        );
    }

    public OrderResponse getOrderByNumber(
            String orderNumber
    ) {

        Order order =
                orderRepository
                        .findByOrderNumber(orderNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );

        return toOrderResponse(order);
    }

    public List<OrderResponse> getOrdersBySession(
            Long sessionId
    ) {

        return orderRepository
                .findByOrderSessionId(sessionId)
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    /*
     * Internal entity method.
     *
     * PaymentService and other backend services
     * can use this when necessary.
     */
    public Order getOrderEntity(Long orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );
    }

    @Transactional
    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus newStatus
    ) {

        Order order =
                getOrderEntity(orderId);

        order.setStatus(newStatus);

        Order updatedOrder =
                orderRepository.save(order);

        return toOrderResponse(updatedOrder);
    }

    public OrderResponse toOrderResponse(Order order) {

        List<OrderItemResponse> items =
                order.getOrderItems()
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getId(),
                                        item.getMenuItem().getId(),
                                        item.getMenuItem().getName(),
                                        item.getQuantity(),
                                        item.getPrice(),
                                        item.getSubtotal()
                                )
                        )
                        .toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getOrderSession().getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items
        );
    }

    private String generateOrderNumber() {

        return "ORD-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    public List<Order> getOrderEntitiesBySession(
            Long sessionId
    ) {

        return orderRepository.findByOrderSessionId(
                sessionId
        );
    }
}