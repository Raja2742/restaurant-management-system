package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import restaurant_backend.dto.menu.MenuCategoryRequest;
import restaurant_backend.dto.menu.MenuCategoryResponse;
import restaurant_backend.dto.menu.MenuItemRequest;
import restaurant_backend.dto.menu.MenuItemResponse;
import restaurant_backend.dto.staff.StaffRequest;
import restaurant_backend.dto.staff.StaffResponse;
import restaurant_backend.dto.table.TableRequest;
import restaurant_backend.dto.table.TableResponse;
import restaurant_backend.entity.Role;
import restaurant_backend.entity.User;
import restaurant_backend.exception.BadRequestException;
import restaurant_backend.exception.ConflictException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    private final RestaurantTableService restaurantTableService;
    private final MenuCategoryService menuCategoryService;
    private final MenuItemService menuItemService;

    private final PasswordEncoder passwordEncoder;

    // =========================
    // TABLES
    // =========================

    public List<TableResponse> getAllTables() {
        return restaurantTableService.getAllTables();
    }

    public TableResponse getTable(Long tableId) {
        return restaurantTableService.getTableById(tableId);
    }

    public TableResponse createTable(TableRequest request) {
        return restaurantTableService.createTable(request);
    }

    public TableResponse updateTable(
            Long tableId,
            TableRequest request
    ) {
        return restaurantTableService.updateTable(
                tableId,
                request
        );
    }

    public void deleteTable(Long tableId) {
        restaurantTableService.deleteTable(tableId);
    }

    // =========================
    // CATEGORIES
    // =========================

    public List<MenuCategoryResponse> getAllCategories() {
        return menuCategoryService.getAllCategories();
    }

    public MenuCategoryResponse createCategory(
            MenuCategoryRequest request
    ) {
        return menuCategoryService.createCategory(request);
    }

    public MenuCategoryResponse updateCategory(
            Long categoryId,
            MenuCategoryRequest request
    ) {
        return menuCategoryService.updateCategory(
                categoryId,
                request
        );
    }

    public void deleteCategory(Long categoryId) {
        menuCategoryService.deleteCategory(categoryId);
    }

    // =========================
    // MENU ITEMS
    // =========================

    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }

    public MenuItemResponse getMenuItem(Long menuItemId) {
        return menuItemService.getMenuItemById(menuItemId);
    }

    public MenuItemResponse createMenuItem(
            MenuItemRequest request,
            MultipartFile image) {

        return menuItemService.createMenuItem(request, image);
    }

    public MenuItemResponse updateMenuItem(
            Long id,
            MenuItemRequest request,
            MultipartFile image) {

        return menuItemService.updateMenuItem(id, request, image);
    }

    public void deleteMenuItem(Long menuItemId) {
        menuItemService.deleteMenuItem(menuItemId);
    }

    // =========================
    // STAFF
    // =========================

    public List<StaffResponse> getAllStaff() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() != Role.CUSTOMER
                )
                .map(this::toStaffResponse)
                .toList();
    }

    public StaffResponse getStaff(Long staffId) {

        User user =
                getStaffEntity(staffId);

        return toStaffResponse(user);
    }

    @Transactional
    public StaffResponse createStaff(
            StaffRequest request
    ) {

        if (userRepository.existsByEmail(
                request.email()
        )) {

            throw new ConflictException(
                    "Email already exists"
            );
        }

        if (request.role() == Role.CUSTOMER) {

            throw new ConflictException(
                    "Customer cannot be created as staff"
            );
        }

        if (request.password() == null || request.password().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        User staff = new User();

        staff.setName(request.name());
        staff.setEmail(request.email());
        staff.setPhone(request.phone());

        // VERY IMPORTANT
        staff.setPassword(
                passwordEncoder.encode(
                        request.password()
                )
        );

        staff.setRole(request.role());

        User savedStaff =
                userRepository.save(staff);

        return toStaffResponse(savedStaff);
    }

    @Transactional
    public StaffResponse updateStaff(
            Long staffId,
            StaffRequest request
    ) {

        User staff =
                getStaffEntity(staffId);

        if (request.role() == Role.CUSTOMER) {

            throw new ConflictException(
                    "Customer cannot be assigned as staff"
            );
        }

        staff.setName(request.name());
        staff.setPhone(request.phone());
        staff.setRole(request.role());
        if (request.password() != null && !request.password().isBlank()) {
            staff.setPassword(passwordEncoder.encode(request.password()));
        }
        // Don't change password automatically here.
        // Password change will have its own API later.

        User updatedStaff =
                userRepository.save(staff);

        return toStaffResponse(updatedStaff);
    }

    public void deleteStaff(Long staffId) {

        User staff =
                getStaffEntity(staffId);

        userRepository.delete(staff);
    }

    private User getStaffEntity(Long staffId) {

        User user =
                userRepository.findById(staffId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Staff member not found"
                                )
                        );

        if (user.getRole() == Role.CUSTOMER) {

            throw new ResourceNotFoundException(
                    "Staff member not found"
            );
        }

        return user;
    }

    private StaffResponse toStaffResponse(
            User user
    ) {

        return new StaffResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}