package restaurant_backend.repository;

import restaurant_backend.entity.Order;
import restaurant_backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByOrderSessionId(Long sessionId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByStatusIn(List<OrderStatus> statuses);

    boolean existsByOrderSessionId(Long sessionId);
}