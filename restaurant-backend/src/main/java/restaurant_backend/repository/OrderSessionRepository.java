package restaurant_backend.repository;

import restaurant_backend.entity.OrderSession;
import restaurant_backend.entity.OrderSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderSessionRepository extends JpaRepository<OrderSession, Long> {

    Optional<OrderSession> findBySessionNumber(String sessionNumber);

    Optional<OrderSession> findByRestaurantTableIdAndStatus(
            Long tableId,
            OrderSessionStatus status
    );
    List<OrderSession> findByStatus(OrderSessionStatus status);
}