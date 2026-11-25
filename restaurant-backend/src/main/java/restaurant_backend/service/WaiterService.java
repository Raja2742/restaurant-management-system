package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.order.OrderResponse;
import restaurant_backend.dto.table.TableResponse;
import restaurant_backend.entity.Order;
import restaurant_backend.entity.OrderStatus;
import restaurant_backend.entity.RestaurantTable;
import restaurant_backend.exception.BadRequestException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.OrderRepository;
import restaurant_backend.repository.RestaurantTableRepository;
import restaurant_backend.entity.OrderSession;
import restaurant_backend.entity.OrderSessionStatus;
import restaurant_backend.repository.OrderSessionRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WaiterService {

    private final OrderRepository orderRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final OrderService orderService;
    private final WebSocketNotificationService webSocketNotificationService;
    private final OrderSessionRepository orderSessionRepository;

    public List<OrderResponse> getReadyOrders() {

        return orderRepository
                .findByStatus(OrderStatus.READY)
                .stream()
                .map(orderService::toOrderResponse)
                .toList();
    }

    public List<OrderResponse> getActiveOrders() {

        return orderRepository.findByStatusIn(
                        List.of(
                                OrderStatus.ACCEPTED,
                                OrderStatus.PREPARING,
                                OrderStatus.READY,
                                OrderStatus.SERVED
                        )
                )
                .stream()
                .map(orderService::toOrderResponse)
                .toList();
    }

    public List<TableResponse> getAllTables() {

        return restaurantTableRepository.findAll()
                .stream()
                .map(this::toTableResponse)
                .toList();
    }

    public TableResponse getTable(Long tableId) {

        RestaurantTable table =
                restaurantTableRepository.findById(tableId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        return toTableResponse(table);
    }

    @Transactional
    public OrderResponse serveOrder(Long orderId) {

        Order order =
                getOrderEntity(orderId);

        if (order.getStatus()
                != OrderStatus.READY) {

            throw new BadRequestException(
                    "Only READY orders can be served"
            );
        }

        order.setStatus(
                OrderStatus.SERVED
        );

        Order savedOrder =
                orderRepository.save(order);

        OrderResponse response =
                orderService.toOrderResponse(savedOrder);

        webSocketNotificationService.notifyWaiter(
                "ORDER_SERVED",
                response
        );

        webSocketNotificationService.notifyCustomer(
                savedOrder.getOrderSession().getId(),
                "ORDER_SERVED",
                response
        );

        return response;
    }

    @Transactional
    public OrderResponse completeOrder(Long orderId) {

        Order order =
                getOrderEntity(orderId);

        if (order.getStatus()
                != OrderStatus.SERVED) {

            throw new BadRequestException(
                    "Only SERVED orders can be completed"
            );
        }

        order.setStatus(
                OrderStatus.COMPLETED
        );

        Order savedOrder =
                orderRepository.save(order);

        OrderResponse response =
                orderService.toOrderResponse(savedOrder);

        webSocketNotificationService.notifyWaiter(
                "ORDER_COMPLETED",
                response
        );

        webSocketNotificationService.notifyCustomer(
                savedOrder.getOrderSession().getId(),
                "ORDER_COMPLETED",
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

    private TableResponse toTableResponse(RestaurantTable table) {

        Long activeSessionId = orderSessionRepository
                .findByRestaurantTableIdAndStatus(
                        table.getId(),
                        OrderSessionStatus.ACTIVE
                )
                .map(OrderSession::getId)
                .orElse(null);

        return new TableResponse(
                table.getId(),
                table.getTableNumber(),
                table.getCapacity(),
                table.getStatus(),
                table.getQrCode(),
                activeSessionId
        );
    }
}