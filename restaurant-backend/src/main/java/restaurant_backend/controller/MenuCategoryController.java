package restaurant_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.menu.MenuCategoryRequest;
import restaurant_backend.dto.menu.MenuCategoryResponse;
import restaurant_backend.service.MenuCategoryService;

import java.util.List;

@RestController
@RequestMapping("/api/menu/categories")
@RequiredArgsConstructor
public class MenuCategoryController {

    private final MenuCategoryService menuCategoryService;

    @GetMapping
    public ResponseEntity<List<MenuCategoryResponse>>
    getAllCategories() {

        return ResponseEntity.ok(
                menuCategoryService.getAllCategories()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuCategoryResponse>
    getCategoryById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                menuCategoryService.getCategoryById(id)
        );
    }

    @PostMapping
    public ResponseEntity<MenuCategoryResponse>
    createCategory(
            @Valid @RequestBody
            MenuCategoryRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        menuCategoryService.createCategory(
                                request
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuCategoryResponse>
    updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody
            MenuCategoryRequest request
    ) {

        return ResponseEntity.ok(
                menuCategoryService.updateCategory(
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id
    ) {

        menuCategoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}