package restaurant_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import restaurant_backend.dto.menu.MenuCategoryRequest;
import restaurant_backend.dto.menu.MenuCategoryResponse;
import restaurant_backend.dto.menu.MenuItemRequest;
import restaurant_backend.dto.menu.MenuItemResponse;
import restaurant_backend.dto.staff.StaffRequest;
import restaurant_backend.dto.staff.StaffResponse;
import restaurant_backend.dto.table.TableRequest;
import restaurant_backend.dto.table.TableResponse;
import restaurant_backend.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // =========================
    // TABLES
    // =========================

    @GetMapping("/tables")
    public ResponseEntity<List<TableResponse>>
    getAllTables() {

        return ResponseEntity.ok(
                adminService.getAllTables()
        );
    }

    @GetMapping("/tables/{tableId}")
    public ResponseEntity<TableResponse>
    getTable(
            @PathVariable Long tableId
    ) {

        return ResponseEntity.ok(
                adminService.getTable(tableId)
        );
    }

    @PostMapping("/tables")
    public ResponseEntity<TableResponse>
    createTable(
            @Valid @RequestBody TableRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        adminService.createTable(request)
                );
    }

    @PutMapping("/tables/{tableId}")
    public ResponseEntity<TableResponse>
    updateTable(
            @PathVariable Long tableId,
            @Valid @RequestBody TableRequest request
    ) {

        return ResponseEntity.ok(
                adminService.updateTable(
                        tableId,
                        request
                )
        );
    }

    @DeleteMapping("/tables/{tableId}")
    public ResponseEntity<Void>
    deleteTable(
            @PathVariable Long tableId
    ) {

        adminService.deleteTable(tableId);

        return ResponseEntity.noContent().build();
    }

    // =========================
    // CATEGORIES
    // =========================

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategoryResponse>>
    getAllCategories() {

        return ResponseEntity.ok(
                adminService.getAllCategories()
        );
    }

    @PostMapping("/categories")
    public ResponseEntity<MenuCategoryResponse>
    createCategory(
            @Valid @RequestBody
            MenuCategoryRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        adminService.createCategory(request)
                );
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<MenuCategoryResponse>
    updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody
            MenuCategoryRequest request
    ) {

        return ResponseEntity.ok(
                adminService.updateCategory(
                        categoryId,
                        request
                )
        );
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<Void>
    deleteCategory(
            @PathVariable Long categoryId
    ) {

        adminService.deleteCategory(categoryId);

        return ResponseEntity.noContent().build();
    }

    // =========================
    // MENU ITEMS
    // =========================

    @GetMapping("/menu-items")
    public ResponseEntity<List<MenuItemResponse>>
    getAllMenuItems() {

        return ResponseEntity.ok(
                adminService.getAllMenuItems()
        );
    }

    @GetMapping("/menu-items/{menuItemId}")
    public ResponseEntity<MenuItemResponse>
    getMenuItem(
            @PathVariable Long menuItemId
    ) {

        return ResponseEntity.ok(
                adminService.getMenuItem(menuItemId)
        );
    }

    @PostMapping(
            value = "/menu-items",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MenuItemResponse> createMenuItem(
            @Valid @RequestPart("item") MenuItemRequest request,
            @RequestPart("image") MultipartFile image) {

        MenuItemResponse response =
                adminService.createMenuItem(request, image);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PutMapping(
            value = "/menu-items/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestPart("item") MenuItemRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        System.out.println("🔥 UPDATE MENU CONTROLLER REACHED");
        MenuItemResponse response =
                adminService.updateMenuItem(id, request, image);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/menu-items/{menuItemId}")
    public ResponseEntity<Void>
    deleteMenuItem(
            @PathVariable Long menuItemId
    ) {

        adminService.deleteMenuItem(menuItemId);

        return ResponseEntity.noContent().build();
    }

    // =========================
    // STAFF
    // =========================

    @GetMapping("/staff")
    public ResponseEntity<List<StaffResponse>>
    getAllStaff() {

        return ResponseEntity.ok(
                adminService.getAllStaff()
        );
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<StaffResponse>
    getStaff(
            @PathVariable Long staffId
    ) {

        return ResponseEntity.ok(
                adminService.getStaff(staffId)
        );
    }

    @PostMapping("/staff")
    public ResponseEntity<StaffResponse>
    createStaff(
            @Valid @RequestBody StaffRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        adminService.createStaff(request)
                );
    }

    @PutMapping("/staff/{staffId}")
    public ResponseEntity<StaffResponse>
    updateStaff(
            @PathVariable Long staffId,
            @Valid @RequestBody StaffRequest request
    ) {

        return ResponseEntity.ok(
                adminService.updateStaff(
                        staffId,
                        request
                )
        );
    }

    @DeleteMapping("/staff/{staffId}")
    public ResponseEntity<Void>
    deleteStaff(
            @PathVariable Long staffId
    ) {

        adminService.deleteStaff(staffId);

        return ResponseEntity.noContent().build();
    }
}