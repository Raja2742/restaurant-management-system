package restaurant_backend.repository;

import restaurant_backend.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {

    boolean existsByName(String name);
}