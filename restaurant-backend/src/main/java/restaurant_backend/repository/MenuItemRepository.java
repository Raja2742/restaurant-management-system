package restaurant_backend.repository;

import restaurant_backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByAvailableTrue();

    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);

    boolean existsByName(String name);
}