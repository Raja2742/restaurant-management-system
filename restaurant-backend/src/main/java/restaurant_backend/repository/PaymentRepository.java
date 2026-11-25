package restaurant_backend.repository;

import restaurant_backend.entity.Payment;
import restaurant_backend.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderSessionId(Long sessionId);

    Optional<Payment> findByTransactionId(String transactionId);

    boolean existsByOrderSessionIdAndStatus(
            Long sessionId,
            PaymentStatus status
    );
}