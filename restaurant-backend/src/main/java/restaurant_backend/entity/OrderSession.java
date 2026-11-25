package restaurant_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "order_sessions")
public class OrderSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sessionNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable restaurantTable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSessionStatus status;

    @JsonIgnore
    @OneToMany(
            mappedBy = "orderSession",
            cascade = CascadeType.ALL
    )
    private List<Order> orders = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime closedAt;

    @PrePersist
    public void prePersist() {

        createdAt = LocalDateTime.now();

        if (status == null) {
            status = OrderSessionStatus.ACTIVE;
        }
    }
}