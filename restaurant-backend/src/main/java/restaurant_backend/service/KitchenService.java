package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.order.OrderResponse;
import restaurant_backend.entity.Order;
import restaurant_backend.entity.OrderStatus;
import restaurant_backend.exception.BadRequestException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.OrderRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KitchenService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final WebSocketNotificationService webSocketNotificationService;

    public List<OrderResponse> getKitchenOrders() {

        return orderRepository.findByStatusIn(
                        List.of(
                                OrderStatus.PLACED,
                                OrderStatus.ACCEPTED,
                                OrderStatus.PREPARING,
                                OrderStatus.READY
                        )
                )
                .stream()
                .map(orderService::toOrderResponse)
                .toList();
    }

    public List<OrderResponse> getOrdersByStatus(
            OrderStatus status
    ) {

        return orderRepository.findByStatus(status)
                .stream()
                .map(orderService::toOrderResponse)
                .toList();
    }

    public OrderResponse getOrder(Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order not found"
                                )
                        );

        return orderService.toOrderResponse(order);
    }

    @Transactional
    public OrderResponse acceptOrder(Long orderId) {

        Order order = getOrderEntity(orderId);

        if (order.getStatus() != OrderStatus.PLACED) {

            throw new BadRequestException(
                    "Only PLACED orders can be accepted"
            );
        }

        order.setStatus(OrderStatus.ACCEPTED);

        Order savedOrder =
                orderRepository.save(order);

        OrderResponse response =
                orderService.toOrderResponse(savedOrder);

        webSocketNotificationService.notifyWaiter(
                "ORDER_ACCEPTED",
                response
        );

        webSocketNotificationService.notifyKitchen(
                "ORDER_ACCEPTED",
                response
        );

        return response;
    }

    @Transactional
    public OrderResponse startPreparing(Long orderId) {

        Order order = getOrderEntity(orderId);

        if (order.getStatus() != OrderStatus.ACCEPTED) {

            throw new BadRequestException(
                    "Only ACCEPTED orders can be prepared"
            );
        }

        order.setStatus(
                OrderStatus.PREPARING
        );

        Order savedOrder =
                orderRepository.save(order);

        OrderResponse response =
                orderService.toOrderResponse(savedOrder);

        webSocketNotificationService.notifyWaiter(
                "ORDER_PREPARING",
                response
        );

        webSocketNotificationService.notifyKitchen(
                "ORDER_PREPARING",
                response
        );

        webSocketNotificationService.notifyCustomer(
                savedOrder.getOrderSession().getId(),
                "ORDER_PREPARING",
                response
        );

        return response;
    }

    @Transactional
    public OrderResponse markReady(Long orderId) {

        Order order =
                getOrderEntity(orderId);

        if (order.getStatus()
                != OrderStatus.PREPARING) {

            throw new BadRequestException(
                    "Only PREPARING orders can be marked ready"
            );
        }

        order.setStatus(
                OrderStatus.READY
        );

        Order savedOrder =
                orderRepository.save(order);

        OrderResponse response =
                orderService.toOrderResponse(savedOrder);

        /*
         * Kitchen dashboard.
         */
        webSocketNotificationService.notifyKitchen(
                "ORDER_READY",
                response
        );

        /*
         * Waiter dashboard.
         */
        webSocketNotificationService.notifyWaiter(
                "ORDER_READY",
                response
        );

        /*
         * Customer dashboard.
         */
        webSocketNotificationService.notifyCustomer(
                savedOrder.getOrderSession().getId(),
                "ORDER_READY",
                response
        );

        return response;
    }

    private Order getOrderEntity(Long orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found"
                        )
                );
    }
}