package restaurant_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import restaurant_backend.entity.MenuCategory;
import restaurant_backend.entity.MenuItem;
import restaurant_backend.entity.RestaurantTable;
import restaurant_backend.entity.Role;
import restaurant_backend.entity.TableStatus;
import restaurant_backend.entity.User;

import restaurant_backend.repository.MenuCategoryRepository;
import restaurant_backend.repository.MenuItemRepository;
import restaurant_backend.repository.RestaurantTableRepository;
import restaurant_backend.repository.UserRepository;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
@Profile("dev")
public class DataInitializer {

    private final UserRepository userRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initializeData() {
        return args -> seedData();
    }

    @Transactional
    public void seedData() {
        seedUsers();
        seedCategories();
        seedTables();
        seedMenuItems();

        System.out.println("==================================");
        System.out.println("Restaurant sample data initialized");
        System.out.println("==================================");
    }

    // 1. USERS

    private void seedUsers() {

        createUser(
                "Restaurant Admin",
                "admin@restaurant.com",
                "9876543210",
                "Admin@123",
                Role.ADMIN
        );

        createUser(
                "Kitchen Staff",
                "kitchen@restaurant.com",
                "9876543211",
                "Kitchen@123",
                Role.KITCHEN
        );

        createUser(
                "Restaurant Waiter",
                "waiter@restaurant.com",
                "9876543212",
                "Waiter@123",
                Role.WAITER
        );

        createUser(
                "Restaurant Cashier",
                "cashier@restaurant.com",
                "9876543213",
                "Cashier@123",
                Role.CASHIER
        );

        createUser(
                "Test Customer",
                "customer@restaurant.com",
                "9876543214",
                "Customer@123",
                Role.CUSTOMER
        );
    }

    private void createUser(
            String name,
            String email,
            String phone,
            String rawPassword,
            Role role
    ) {

        if (userRepository.existsByEmail(email)) {
            return;
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);

        // Always store a BCrypt hash, never the raw password.
        user.setPassword(
                passwordEncoder.encode(rawPassword)
        );

        user.setRole(role);

        userRepository.save(user);
    }

    // 2. MENU CATEGORIES

    private void seedCategories() {

        createCategory(
                "Breakfast",
                "South Indian breakfast dishes"
        );

        createCategory(
                "Starters",
                "Delicious snacks and starters"
        );

        createCategory(
                "Main Course",
                "Rice dishes and main meals"
        );

        createCategory(
                "Beverages",
                "Hot and cold drinks"
        );

        createCategory(
                "Desserts",
                "Sweet dishes and desserts"
        );
    }

    private void createCategory(
            String name,
            String description
    ) {

        if (menuCategoryRepository.existsByName(name)) {
            return;
        }

        MenuCategory category = new MenuCategory();

        category.setName(name);
        category.setDescription(description);
        category.setActive(true);

        menuCategoryRepository.save(category);
    }

    // 3. RESTAURANT TABLES

    private void seedTables() {

        createTable("T1", 2, "QR-TABLE-T1");
        createTable("T2", 2, "QR-TABLE-T2");
        createTable("T3", 4, "QR-TABLE-T3");
        createTable("T4", 4, "QR-TABLE-T4");
        createTable("T5", 6, "QR-TABLE-T5");
    }

    private void createTable(
            String tableNumber,
            int capacity,
            String qrCode
    ) {

        if (restaurantTableRepository
                .existsByTableNumber(tableNumber)) {
            return;
        }

        RestaurantTable table = new RestaurantTable();

        table.setTableNumber(tableNumber);
        table.setCapacity(capacity);
        table.setQrCode(qrCode);
        table.setStatus(TableStatus.AVAILABLE);

        restaurantTableRepository.save(table);
    }

    // 4. MENU ITEMS

    private void seedMenuItems() {

        // Breakfast
        createMenuItem(
                "Idli",
                "Soft steamed rice cakes served with chutney",
                "40.00",
                "/uploads/menu/idli.jpg",
                "Breakfast"

        );

        createMenuItem(
                "Masala Dosa",
                "Crispy dosa filled with potato masala",
                "80.00",
                "/uploads/menu/masala-dosa.jpg",
                "Breakfast"
        );

        createMenuItem(
                "Plain Dosa",
                "Crispy South Indian dosa",
                "60.00",
                "/uploads/menu/plain-dosa.jpg",
                "Breakfast"
        );

        // Starters
        createMenuItem(
                "Gobi Manchurian",
                "Crispy cauliflower tossed in Manchurian sauce",
                "120.00",
                "/uploads/menu/gobi-manchurian.jpg",
                "Starters"
        );

        createMenuItem(
                "Paneer Tikka",
                "Grilled paneer with Indian spices",
                "180.00",
                "/uploads/menu/paneer-tikka.jpg",
                "Starters"
        );

        // Main Course
        createMenuItem(
                "Veg Biryani",
                "Aromatic rice cooked with vegetables and spices",
                "150.00",
                "/uploads/menu/veg-biryani.jpg",
                "Main Course"
        );

        createMenuItem(
                "Chicken Biryani",
                "Chicken and aromatic rice cooked with spices",
                "220.00",
                "/uploads/menu/chicken-biryani.jpg",
                "Main Course"
        );

        createMenuItem(
                "Paneer Butter Masala",
                "Paneer cooked in a creamy tomato gravy",
                "180.00",
                "/uploads/menu/paneer-butter-masala.jpg",
                "Main Course"
        );

        createMenuItem(
                "Butter Naan",
                "Soft Indian bread topped with butter",
                "40.00",
                "/uploads/menu/butter-naan.jpg",
                "Main Course"
        );

        // Beverages
        createMenuItem(
                "Tea",
                "Freshly brewed Indian tea",
                "20.00",
                "/uploads/menu/tea.jpg",
                "Beverages"
        );

        createMenuItem(
                "Cold Coffee",
                "Chilled coffee drink",
                "90.00",
                "/uploads/menu/cold-coffee.jpg",
                "Beverages"
        );

        // Desserts
        createMenuItem(
                "Gulab Jamun",
                "Sweet milk-solid dumplings in sugar syrup",
                "60.00",
                "/uploads/menu/gulab-jamun.jpg",
                "Desserts"
        );
    }

    private void createMenuItem(
            String name,
            String description,
            String price,
            String imageUrl,
            String categoryName
    ) {

        // Avoid duplicate menu items on application restart.
        if (menuItemRepository.existsByName(name)) {
            return;
        }

        MenuCategory category =
                menuCategoryRepository.findAll()
                        .stream()
                        .filter(c -> c.getName().equals(categoryName))
                        .findFirst()
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Category not found: " + categoryName
                                )
                        );

        MenuItem item = new MenuItem();

        item.setName(name);
        item.setDescription(description);
        item.setPrice(new BigDecimal(price));
        item.setAvailable(true);
        item.setCategory(category);
        item.setImageUrl(imageUrl);
        menuItemRepository.save(item);
    }
}