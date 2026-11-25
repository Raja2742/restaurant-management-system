package restaurant_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import restaurant_backend.dto.menu.MenuItemRequest;
import restaurant_backend.dto.menu.MenuItemResponse;
import restaurant_backend.service.MenuItemService;

import java.util.List;

@RestController
@RequestMapping("/api/menu/items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItemResponse>>
    getAllMenuItems() {

        return ResponseEntity.ok(
                menuItemService.getAllMenuItems()
        );
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuItemResponse>>
    getAvailableMenuItems() {

        return ResponseEntity.ok(
                menuItemService.getAvailableMenuItems()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponse>
    getMenuItemById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                menuItemService.getMenuItemById(id)
        );
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<MenuItemResponse>>
    getAvailableItemsByCategory(
            @PathVariable Long categoryId
    ) {

        return ResponseEntity.ok(
                menuItemService.getAvailableItemsByCategory(
                        categoryId
                )
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemResponse> createMenuItem(
            @Valid @RequestPart("item") MenuItemRequest request,
            @RequestPart("image") MultipartFile image
    ) {
        MenuItemResponse response =
                menuItemService.createMenuItem(request, image);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestPart("item") MenuItemRequest request,
            @RequestPart(value = "image", required = false)
            MultipartFile image
    ) {
        return ResponseEntity.ok(
                menuItemService.updateMenuItem(
                        id,
                        request,
                        image
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteMenuItem(
            @PathVariable Long id
    ) {

        menuItemService.deleteMenuItem(id);

        return ResponseEntity.noContent().build();
    }
}